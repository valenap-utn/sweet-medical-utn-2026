import {EstadoTurno} from "../domain/enums/EstadoTurno.js";
import {isAfter, isValid, parseISO, subHours} from "date-fns";

export class MedicoService {
    constructor({medicoRepository, turnoRepository}) {
        this.medicoRepository = medicoRepository;
        this.turnoRepository = turnoRepository;
    }

    async cancelarTurno({medicoId, turnoId, motivo}) {
        if (!motivo) throw new Error("Debe indicar un motivo para la cancelación");

        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new Error("No se encontró el turno");

        const medicoDelTurno = turno.medico._id;
        if (String(medicoDelTurno) !== String(medicoId)) throw new Error("El turno no pertenece al medico");

        const unaHoraAntes = subHours(turno.fechaHoraInicio, 1);
        if (isAfter(new Date(), unaHoraAntes)) {
            throw new Error("El turno solo puede cancelarse con al menos 1 hora de anticipación.");
        }
        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.CANCELADO,
            usuario: medicoId,
            motivo: motivo,
            turnoId: turno._id,
        })
        return await this.turnoRepository.save(turno);
    }

    async marcarTurnoRealizado({medicoId, turnoId}) {
        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new Error("Turno no encontrado.");
        const medicoDelTurno = turno.medico._id;
        if (String(medicoDelTurno) !== String(medicoId)) throw new Error("El turno no pertenece al medico");
        if (turno.estado !== EstadoTurno.CONFIRMADO) throw new Error("El turno que quiere marcar como realizado no está confirmado");
        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.REALIZADO,
            usuario: medicoId,
            motivo: "Se realizó el turno",
            turnoId: turno._id,
        })
        return await this.turnoRepository.save(turno);
    }

    async obtenerHistorial({pacienteId}) {
        return await this.turnoRepository.findByPacienteId(pacienteId);
    }

    async proponerCambioFecha({medicoId, turnoId, nuevaFechaHora}) {
        if (!nuevaFechaHora) throw new Error("Debe indicar la nueva fecha y hora propuesta.");

        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new Error("Turno no encontrado.");

        const medicoDelTurno = turno.medico._id;
        if (String(medicoDelTurno) !== String(medicoId)) throw new Error("El turno no pertenece al medico");

        const fechaParseada = parseISO(nuevaFechaHora);
        if (!isValid(fechaParseada)) throw new Error("La fecha especificada no es válida.");

        // Se asigna la fecha propuesta al campo temporal sin sobreescribir la original todavía
        turno.fechaHoraSolicitada = fechaParseada;

        // Registramos el cambio en el historial manteniendo el estado de espera (RESERVADO)
        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.RESERVADO,
            usuario: medicoId,
            motivo: "El médico propone una nueva fecha para el turno (requiere confirmación del paciente).",
            turnoId: turnoId
        });
        return await this.turnoRepository.save(turno);
    }

    async confirmarModificacionFecha({medicoId, turnoId}) {
        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new Error("Turno no encontrado.");

        if (!turno.fechaHoraSolicitada) throw new Error("No existe ninguna propuesta de cambio de fecha pendiente para este turno");

        // Efectuamos el cambio real sobreescribiendo la fecha de inicio original
        turno.fechaHoraInicio = turno.fechaHoraSolicitada;

        // Limpiamos el campo temporal de solicitud
        turno.fechaHoraSolicitada = null;

        // El turno se consolida pasando a CONFIRMADO
        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.CONFIRMADO,
            usuario: medicoId,
            motivo: "Modificación de fecha confirmada y consolidada en agenda.",
            turnoId: turnoId
        });
        return await this.turnoRepository.save(turno);
    }

    async agregarDisponibilidad({medicoId, disponibilidad}){
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new Error("Medico no encontrado.");

        if(!this.disponibilidadValida(disponibilidad)) throw new Error("Disponibilidad no válida");

        const existe = medico.disponibilidades.some(d => d.diaSemana === disponibilidad.diaSemana && d.horaDesde === disponibilidad.horaDesde && d.horaHasta === disponibilidad.horaHasta);
        if(existe) throw new Error("Disponibilidad ya existente");

        medico.disponibilidades.push(disponibilidad);

        return await this.medicoRepository.save(medico);
    }

    async quitarDisponibilidad({medicoId, disponibilidad}){
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new Error("Medico no encontrado.");

        const cantidadOriginal = medico.disponibilidades.length;

        medico.disponibilidades = medico.disponibilidades.filter(d => !(d.diaSemana === disponibilidad.diaSemana && d.horaDesde === disponibilidad.horaDesde && d.horaHasta === disponibilidad.horaHasta));
        if(cantidadOriginal === medico.disponibilidades.length) throw new Error("Disponibilidad no encontrada");

        return await this.medicoRepository.save(medico);

    }

    //TODO: Revisar formato de horario para verificar que sea válido
    disponibilidadValida(disponibilidad){
        return isValid(parseISO(disponibilidad.horaDesde)) && isValid(parseISO(disponibilidad.horaHasta)) && disponibilidad.horaHasta > disponibilidad.horaDesde;
    }
}