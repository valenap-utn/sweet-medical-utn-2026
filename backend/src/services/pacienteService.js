import {EstadoTurno} from "../domain/enums/EstadoTurno.js";
import {isAfter, isValid, parseISO, subHours} from "date-fns";
import {NivelCobertura} from "../domain/enums/NivelCobertura.js";

export class PacienteService {
    constructor({pacienteRepository, turnoRepository}) {
        this.pacienteRepository = pacienteRepository;
        this.turnoRepository = turnoRepository;
    }

    async reservarTurno({pacienteId, turnoId}) {
        // Buscamos al paciente y al turno indicados
        const paciente = await this.pacienteRepository.findById(pacienteId);
        if (!paciente) throw new Error("Paciente no encontrado.");

        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new Error("Turno no encontrado.");

        // Verificamos que el turno se encuentre Dispo.
        if (turno.estado.nombre !== EstadoTurno.DISPONIBLE.nombre) {
            throw new Error("El turno no está disponible.")
        }

        // Calculamos el costo de la consulta/turno
        const costo = this.calcularCostoPaciente({paciente, turno});

        // Reservamos el turno
        turno.reservar({
            paciente: paciente._id,
            costo,
            turnoId: turno._id,
        });

        // Y lo guardamos en nuestra DB
        return await this.turnoRepository.save(turno);
    }

    async cancelarTurno({pacienteId, turnoId, motivo}) {
        if (!motivo) throw new Error("Debe indicar un motivo de cancelación.");

        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new Error("Turno no encontrado.");

        // Chequeamos que el turno pertenezca a quien lo está intentando modificar
        this.validarTurnoPerteneceAPaciente(turno, pacienteId);

        // Chequeamos que falte al menos una hora o mas para que pueda cancelarse el turno
        const unaHoraAntes = subHours(turno.fechaHoraInicio, 1);
        if (isAfter(new Date(), unaHoraAntes)) {
            throw new Error("El turno solo puede cancelarse con al menos 1 hora de anticipación.");
        }

        // Asignamos nuevo estado al turno
        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.CANCELADO,
            usuario: pacienteId,
            motivo: motivo,
            turnoId: turno._id,
        })

        return await this.turnoRepository.save(turno);
    }

    async obtenerHistorial({pacienteId}) {
        return await this.turnoRepository.findByPacienteId(pacienteId);
    }

    async solicitarCambioFecha({pacienteId, turnoId, nuevaFechaHora}) {
        if (!nuevaFechaHora) throw new Error("Debe indicar la nueva fecha solicitada.")

        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new Error("Turno no encontrado.");

        const paciente = await this.pacienteRepository.findById(pacienteId);
        if (!paciente) throw new Error("Paciente no encontrado.");

        //Chequeamos que el que quiere solicitar el cambio de fecha sea a quien le pertenece el turno
        this.validarTurnoPerteneceAPaciente(turno, pacienteId);

        const nuevaFechaParseada = parseISO(nuevaFechaHora);

        if (!isValid(nuevaFechaParseada)) throw new Error("La nueva fecha solicitada no es válida.")

        turno.fechaHoraSolicitada = nuevaFechaParseada;

        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.RESERVADO, // pendiente de confirmación por parte del médico
            usuario: pacienteId,
            motivo: "Solicitud de cambio de fecha",
            turnoId: turno._id,
        });

        return this.turnoRepository.save(turno);
    }


    // ----- FUNCIONES AUXILIARES -----

    validarTurnoPerteneceAPaciente(turno, pacienteId) {
        const pacienteDelTurno = turno.paciente?._id || turno.paciente?.id || turno.paciente;
        if (String(pacienteDelTurno) !== String(pacienteId)) {
            throw new Error("El turno no pertenece al paciente.")
        }
    }

    calcularCostoPaciente({ paciente, turno }) {
        const servicio = turno.especialidad ?? turno.practica;
        if (!servicio) throw new Error("El turno no tiene especialidad ni práctica asociada.");

        const costoBase = servicio.costoConsulta ?? servicio.costo ?? 0;

        if (!paciente.plan) return costoBase;

        let cobertura;
        if (turno.especialidad) {
            cobertura = paciente.plan.obtenerCoberturaEspecialidad(turno.especialidad);
        } else {
            cobertura = paciente.plan.obtenerCoberturaPractica(turno.practica);
        }

        const coberturaNombre = cobertura?.nombre ?? cobertura;

        if (coberturaNombre === NivelCobertura.TOTAL.nombre) return 0;
        if (coberturaNombre === NivelCobertura.PARCIAL.nombre) return costoBase * 0.5;

        return costoBase;
    }
}
