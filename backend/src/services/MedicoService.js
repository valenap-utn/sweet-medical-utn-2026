import {TipoServicio} from "../domain/enums/TipoServicio.js";
import {BadRequestError, ConflictError, NotFoundError} from "../error/AppError.js";

export class MedicoService {
    constructor({medicoRepository, turnoRepository, especialidadRepository, practicaRepository, agendaService}) {
        this.medicoRepository = medicoRepository;
        this.turnoRepository = turnoRepository;
        this.especialidadRepository = especialidadRepository;
        this.practicaRepository = practicaRepository;
        this.agendaService = agendaService;
    }

    // Para consultar el historial de turnos de un paciente específico
    async obtenerHistorial({pacienteId}) {
        return await this.turnoRepository.findByPacienteId(pacienteId);
    }

    /* ===== Acciones sobre DISPONIBILIDADES ======================================================================== */
    async consultarDisponibilidadEspecialidad({medicoId, especialidadId}) {
        console.log({medicoId, especialidadId});
        return await this.turnoRepository.buscarTurnosDisponibles({medicoId: medicoId, tipoServicio: TipoServicio.ESPECIALIDAD, especialidadId: especialidadId})
    }

    async consultarDisponibilidadPractica({medicoId, practicaId}) {
        return await this.turnoRepository.buscarTurnosDisponibles({medicoId: medicoId, tipoServicio: TipoServicio.PRACTICA, practicaId: practicaId})
    }

    // Obtiene todas las disponibilidades del médico (sin importar el tipoServicio)
    async obtenerDisponibilidades({medicoId}){
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`No se encontró el médico con id: ${medicoId} .`);
        return medico.disponibilidades;
    }

    async agregarDisponibilidad({medicoId, disponibilidad}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`No se encontró el médico con id: ${medicoId} .`);

        if (!this.disponibilidadValida(disponibilidad)) throw new BadRequestError(`Disponibilidad ${disponibilidad._id} no válida`);

        if (medico.disponibilidades.some(d => this.disponibilidadCoincide(d, disponibilidad))) throw new ConflictError(`El médico ya tiene registrada la disponibilidad ${disponibilidad.diaSemana}`);

        medico.definirDisponibilidad(disponibilidad);
        await this.medicoRepository.save(medico);

        await this.agendaService.regenerarAgenda({ medicoId }); // <--- NUEVO

        return { mensaje: "Disponibilidad agregada y agenda regenerada." };
    }

    async quitarDisponibilidad({medicoId, disponibilidad}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`No se encontró el médico con id: ${medicoId} .`);

        const cantidadOriginal = medico.disponibilidades.length;

        medico.disponibilidades = medico.disponibilidades.filter(d => !(this.disponibilidadCoincide(d, disponibilidad)));
        if (cantidadOriginal === medico.disponibilidades.length) throw new Error("Disponibilidad no encontrada");

        await this.medicoRepository.save(medico);

        await this.agendaService.regenerarAgenda({ medicoId }); // <--- NUEVO

        return { mensaje: "Disponibilidad eliminada y agenda regenerada." };

    }

    /* ===== Acciones sobre ESPECIALIDADES ======================================================================== */
    async agregarEspecialidad({medicoId, especialidadId}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`No se encontró el médico con id: ${medicoId} .`);

        const especialidad = await this.especialidadRepository.findById(especialidadId);
        if (!especialidad) throw new NotFoundError(`No se encontró la especialidad con id: ${especialidadId} .`);

        if (medico.especialidades.some(e => this.servicioCoincide(e, especialidad))) throw new ConflictError(`El medico ${medicoId} ya tiene la especialidad ${especialidadId}`);

        medico.agregarEspecialidad(especialidad);

        return await this.medicoRepository.save(medico);

    }

    async quitarEspecialidad({medicoId, especialidadId}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`No se encontró el médico con id: ${medicoId} .`);

        const especialidad = await this.especialidadRepository.findById(especialidadId);
        if (!especialidad) throw new NotFoundError(`No se encontró la especialidad con id: ${especialidadId} .`);

        const cantidadOriginal = medico.especialidades.length;

        medico.especialidades = medico.especialidades.filter(e => !(this.servicioCoincide(e, especialidad)));
        if (cantidadOriginal === medico.especialidades.length) throw new Error(`El medico ${medicoId} no tiene la especialidad ${especialidadId}`);

        return await this.medicoRepository.save(medico);

    }

    /* ===== Acciones sobre PRACTICAS ======================================================================== */
    async agregarPractica({medicoId, practicaId}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`No se encontró el médico con id: ${medicoId} .`);

        const practica = await this.practicaRepository.findById(practicaId);
        if (!practica) throw new NotFoundError(`No se encontró la práctica con id: ${practicaId} .`);

        if (medico.practicas.some(p => this.servicioCoincide(p, practica))) throw new Error(`El medico ${medicoId} ya tiene la práctica ${practicaId}`);

        medico.agregarPractica(practica);

        return await this.medicoRepository.save(medico);
    }

    async quitarPractica({medicoId, practicaId}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`No se encontró el médico con id: ${medicoId} .`);

        const practica = await this.practicaRepository.findById(practicaId);
        if (!practica) throw new NotFoundError(`No se encontró la práctica con id: ${practicaId} .`);

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

}