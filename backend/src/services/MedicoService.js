import {EstadoTurno} from "../domain/enums/EstadoTurno.js";
import {TipoServicio} from "../domain/enums/TipoServicio.js";
import {isAfter, isValid, parseISO, subHours} from "date-fns";

export class MedicoService {
    constructor({medicoRepository, turnoRepository, especialidadRepository, practicaRepository}) {
        this.medicoRepository = medicoRepository;
        this.turnoRepository = turnoRepository;
        this.especialidadRepository = especialidadRepository;
        this.practicaRepository = practicaRepository;
        this.agendaService = agendaService;
    }

    async cancelarTurno({medicoId, turnoId, motivo}) {
        if (!motivo) throw new Error("Debe indicar un motivo para la cancelación");

        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new Error(`Turno ${turnoId} no encontrado.`);

        this.validarTurnoPerteneceAMedico(turno, medicoId);

        const unaHoraAntes = subHours(turno.fechaHoraInicio, 1);
        if (isAfter(new Date(), unaHoraAntes)) {
            throw new Error("El turno solo puede cancelarse con al menos 1 hora de anticipación.");
        }
        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.CANCELADO.nombre,
            usuario: medicoId,
            motivo: motivo,
            turnoId: turno._id,
        })
        return await this.turnoRepository.save(turno);
    }



    async marcarTurnoRealizado({medicoId, turnoId}) {
        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new Error(`Turno ${turnoId} no encontrado.`);
        this.validarTurnoPerteneceAMedico(turno, medicoId);
        if (turno.estado !== EstadoTurno.CONFIRMADO.nombre) throw new Error(`El turno ${turnoId} no está confirmado`);
        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.REALIZADO.nombre,
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
        if (!turno) throw new Error(`Turno ${turnoId} no encontrado.`);

        this.validarTurnoPerteneceAMedico(turno, medicoId);

        const fechaParseada = parseISO(nuevaFechaHora);
        if (!isValid(fechaParseada)) throw new Error(`La fecha ${fechaParseada} no es válida.`);

        // Se asigna la fecha propuesta al campo temporal sin sobreescribir la original todavía
        turno.fechaHoraSolicitada = fechaParseada;

        // Registramos el cambio en el historial manteniendo el estado de espera (RESERVADO)
        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.RESERVADO.nombre,
            usuario: medicoId,
            motivo: "Nueva fecha propuesta para el turno.",
            turnoId: turnoId
        });
        return await this.turnoRepository.save(turno);
    }

    async confirmarModificacionFecha({medicoId, turnoId}) {
        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new Error(`Turno ${turnoId} no encontrado.`);

        if (!turno.fechaHoraSolicitada) throw new Error(`No existe ninguna propuesta de cambio de fecha pendiente para el turno ${turnoId}`);

        // Efectuamos el cambio real sobreescribiendo la fecha de inicio original
        turno.fechaHoraInicio = turno.fechaHoraSolicitada;

        // Limpiamos el campo temporal de solicitud
        turno.fechaHoraSolicitada = null;

        // El turno se consolida pasando a CONFIRMADO
        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.CONFIRMADO.nombre,
            usuario: medicoId,
            motivo: "Modificación de fecha confirmada.",
            turnoId: turnoId
        });
        return await this.turnoRepository.save(turno);
    }

    async consultarDisponibilidadEspecialidad({medicoId, especialidadId}) {
        return await this.turnoRepository.buscarDisponibles({medicoId: medicoId, tipoServicio: TipoServicio.ESPECIALIDAD, especialidadId: especialidadId})
    }

    async consultarDisponibilidadPractica({medicoId, practicaId}) {
        return await this.turnoRepository.buscarDisponibles({medicoId: medicoId, tipoServicio: TipoServicio.PRACTICA, practicaId: practicaId})
    }

    async agregarDisponibilidad({medicoId, disponibilidad}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new Error(`Medico ${medicoId} no encontrado.`);

        if (!this.disponibilidadValida(disponibilidad)) throw new Error("Disponibilidad no válida");

        if (medico.disponibilidades.some(d => this.disponibilidadCoincide(d, disponibilidad))) throw new Error("Disponibilidad ya existente");

        medico.definirDisponibilidad(disponibilidad);
        await this.medicoRepository.save(medico);

        await this.agendaService.regenerarAgenda({ medicoId }); // <--- NUEVO

        return { mensaje: "Disponibilidad agregada y agenda regenerada." };
    }

    async quitarDisponibilidad({medicoId, disponibilidad}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new Error(`Medico ${medicoId} no encontrado.`);

        const cantidadOriginal = medico.disponibilidades.length;

        medico.disponibilidades = medico.disponibilidades.filter(d => !(this.disponibilidadCoincide(d, disponibilidad)));
        if (cantidadOriginal === medico.disponibilidades.length) throw new Error("Disponibilidad no encontrada");

        await this.medicoRepository.save(medico);

        await this.agendaService.regenerarAgenda({ medicoId }); // <--- NUEVO

        return { mensaje: "Disponibilidad eliminada y agenda regenerada." };

    }

    async agregarEspecialidad({medicoId, especialidadId}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new Error(`Medico ${medicoId} no encontrado.`);

        const especialidad = await this.especialidadRepository.findById(especialidadId);
        if (!especialidad) throw new Error(`Especialidad ${especialidadId} no existe, créela antes de agregar`);

        if (medico.especialidades.some(e => this.servicioCoincide(e, especialidad))) throw new Error(`El medico ${medicoId} ya tiene la especialidad ${especialidadId}`);

        medico.agregarEspecialidad(especialidad);

        return await this.medicoRepository.save(medico);

    }

    async quitarEspecialidad({medicoId, especialidadId}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new Error(`Medico ${medicoId} no encontrado.`);

        const especialidad = await this.especialidadRepository.findById(especialidadId);
        if (!especialidad) throw new Error(`Especialidad ${especialidadId} no existe`);

        const cantidadOriginal = medico.especialidades.length;

        medico.especialidades = medico.especialidades.filter(e => !(this.servicioCoincide(e, especialidad)));
        if (cantidadOriginal === medico.especialidades.length) throw new Error(`El medico ${medicoId} no tiene la especialidad ${especialidadId}`);

        return await this.medicoRepository.save(medico);

    }

    async agregarPractica({medicoId, practicaId}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new Error(`Medico ${medicoId} no encontrado.`);

        const practica = await this.practicaRepository.findById(practicaId);
        if (!practica) throw new Error(`Práctica ${practicaId} no existe, créela antes de agregar`);

        if (medico.practicas.some(p => this.servicioCoincide(p, practica))) throw new Error(`El medico ${medicoId} ya tiene la práctica ${practicaId}`);

        medico.agregarPractica(practica);

        return await this.medicoRepository.save(medico);
    }

    async quitarPractica({medicoId, practicaId}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new Error(`Medico ${medicoId} no encontrado.`);

        const practica = await this.practicaRepository.findById(practicaId);
        if (!practica) throw new Error(`Práctica ${practicaId} no existe`);

        const cantidadOriginal = medico.practicas.length;

        medico.practicas = medico.practicas.filter(p => !(this.servicioCoincide(p, practica)));
        if (cantidadOriginal === medico.practicas.length) throw new Error(`El medico ${medicoId} no tiene la práctica ${practicaId}`);

        return await this.medicoRepository.save(medico);
    }


    // -------------------------------------------- FUNCIONES AUXILIARES -----------------------------------------------------------------

    disponibilidadValida(disponibilidad) {
        const formatoHora = /^([01]\d|2[0-3]):([0-5]\d)$/; // Verifica que el formato ingresado de horario sea de forma "HH:mm" Ejemplo: "08:00"
        return formatoHora.test(disponibilidad.horaDesde) && formatoHora.test(disponibilidad.horaHasta) && disponibilidad.horaHasta > disponibilidad.horaDesde;
    }

    disponibilidadCoincide(d, disponibilidad) {
        return d.diaSemana === disponibilidad.diaSemana && d.horaDesde === disponibilidad.horaDesde && d.horaHasta === disponibilidad.horaHasta;
    }

    servicioCoincide(s, servicio) {
        return s.nombre === servicio.nombre && s.costo === servicio.costo;
    }

    validarTurnoPerteneceAMedico(turno, medicoId) {
        const medicoDelTurno = turno.medico._id;
        if (String(medicoDelTurno) !== String(medicoId)) {
            throw new Error(`El turno ${turno._id} no pertenece al médico ${medicoId}.`)
        }
    }

}