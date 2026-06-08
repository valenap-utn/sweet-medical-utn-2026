import {EstadoTurno} from "../domain/enums/EstadoTurno.js";
import {isAfter, isValid, parseISO, subHours} from "date-fns";
import {NivelCobertura} from "../domain/enums/NivelCobertura.js";
import {BadRequestError, ConflictError, ForbiddenError, NotFoundError} from "../error/AppError.js";

export class PacienteService {
    constructor({pacienteRepository, turnoRepository}) {
        this.pacienteRepository = pacienteRepository;
        this.turnoRepository = turnoRepository;
    }

    /* ===== ESTADOS del TURNO ====================================================================================== */

    // EstadoTurno.RESERVADO.nombre
    /*async reservarTurno({pacienteId, turnoId}) {
        // Buscamos al paciente y al turno indicados
        const paciente = await this.pacienteRepository.findById(pacienteId);
        if (!paciente) throw new NotFoundError(`No se encontró al paciente con id: ${pacienteId}.`);

        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new NotFoundError(`No se encontró el turno con id: ${turnoId}.`);

        // Verificamos que el turno se encuentre Dispo.
        if (turno.estado !== EstadoTurno.DISPONIBLE.nombre) {
            throw new ConflictError(`El turno con id: ${turnoId} no puede reservarse porque su estado actual es ${turno.estado}.`);
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

    // EstadoTurno.CANCELADO.nombre
    async cancelarTurno({pacienteId, turnoId, motivo}) {
        if (!motivo) throw new BadRequestError("Debe indicar un motivo de cancelación.");

        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new NotFoundError(`No se encontró el turno con id: ${turnoId}.`);

        // Chequeamos que el turno pertenezca a quien lo está intentando modificar
        this.validarTurnoPerteneceAPaciente(turno, pacienteId);

        // Chequeamos que falte al menos una hora o mas para que pueda cancelarse el turno
        const unaHoraAntes = subHours(turno.fechaHoraInicio, 1);
        if (isAfter(new Date(), unaHoraAntes)) {
            throw new ConflictError("El turno solo puede cancelarse con al menos 1 hora de anticipación.");
        }

        // Asignamos nuevo estado al turno
        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.CANCELADO.nombre,
            usuario: pacienteId,
            motivo: motivo,
            turnoId: turno._id,
        })

        return await this.turnoRepository.save(turno);
    }*/

    // EstadoTurno.CONFIRMADO.nombre
    async confirmarCambioFechaPropuestoPorMedico({pacienteId, turnoId}) {
        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new NotFoundError(`No se encontró el turno con id: ${turnoId}.`);

        this.validarTurnoPerteneceAPaciente(turno, pacienteId);

        if (!turno.fechaHoraSolicitada) throw new ConflictError(`El turno con id: ${turno._id} no tiene una propuesta de cambio de fecha pendiente.`);

        // Efectuamos el cambio real sobreescribiendo la fecha de inicio original
        turno.fechaHoraInicio = turno.fechaHoraSolicitada;

        // Limpiamos el campo temporal de solicitud
        turno.fechaHoraSolicitada = null;

        // El turno se consolida pasando a CONFIRMADO
        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.CONFIRMADO.nombre,
            usuario: pacienteId,
            motivo: "El paciente confirmó la propuesta de cambio de fecha del médico.",
            turnoId: turno._id,
        });
        return await this.turnoRepository.save(turno);
    }

    // Historial de Turnos de un paciente
    async obtenerHistorial({pacienteId}) {
        return await this.turnoRepository.findByPacienteId(pacienteId);
    }

    // EstadoTurno.RESERVADO.nombre
    async solicitarCambioFecha({pacienteId, turnoId, nuevaFechaHora}) {
        if (!nuevaFechaHora) throw new BadRequestError("Debe indicar la nueva fecha solicitada.")

        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new NotFoundError(`No se encontró el turno con id: ${turnoId}.`);

        const paciente = await this.pacienteRepository.findById(pacienteId);
        if (!paciente) throw new NotFoundError(`No se encontró al paciente con id: ${pacienteId}.`);

        //Chequeamos que el que quiere solicitar el cambio de fecha sea a quien le pertenece el turno
        this.validarTurnoPerteneceAPaciente(turno, pacienteId);

        const nuevaFechaParseada = parseISO(nuevaFechaHora);

        if (!isValid(nuevaFechaParseada)) throw new BadRequestError(`La nueva fecha solicitada no es válida: ${nuevaFechaHora}.`)

        turno.fechaHoraSolicitada = nuevaFechaParseada;

        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.RESERVADO.nombre, // pendiente de confirmación por parte del médico
            usuario: pacienteId,
            motivo: "Solicitud de cambio de fecha pendiente de confirmación médica.",
            turnoId: turno._id,
        });

        return this.turnoRepository.save(turno);
    }


    // ----- FUNCIONES AUXILIARES -----

    validarTurnoPerteneceAPaciente(turno, pacienteId) {
        const pacienteDelTurno = turno.paciente?._id || turno.paciente?.id || turno.paciente;
        if (String(pacienteDelTurno) !== String(pacienteId)) {
            throw new ForbiddenError(`El turno con id: ${turno._id} no pertenece al paciente ${pacienteId}.`)
        }
    }

    calcularCostoPaciente({paciente, turno}) {
        const servicio = turno.especialidad ?? turno.practica;
        if (!servicio) throw new ConflictError(`El turno ${turno._id} no tiene especialidad ni práctica asociada.`);

        const costoBase = servicio.costo ?? 0;

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
