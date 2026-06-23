import {TipoServicio} from "../domain/enums/TipoServicio.js";
import {BadRequestError, ConflictError, NotFoundError} from "../error/AppError.js";

export class MedicoService {
    constructor({medicoRepository, turnoRepository, servicioRepository, agendaService}) {
        this.medicoRepository = medicoRepository;
        this.turnoRepository = turnoRepository;
        this.servicioRepository = servicioRepository;
        this.agendaService = agendaService;
    }

    // Para consultar el historial de turnos de un paciente específico
    async obtenerHistorial({pacienteId}) {
        return await this.turnoRepository.findByPacienteId(pacienteId);
    }

    async obtenerAgenda({medicoId}) {
        return await this.agendaService.obtenerAgenda({medicoId})
    }

    /* ===== Acciones sobre DISPONIBILIDADES ======================================================================== */
    async consultarDisponibilidad({medicoId, servicioId}) {
        console.log({medicoId, servicioId});
        return await this.turnoRepository.buscarTurnosDisponibles({medicoId: medicoId, servicioId: servicioId})
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

        if (!this.disponibilidadValida(disponibilidad)) throw new BadRequestError(`Disponibilidad no válida`);

        if (medico.disponibilidades.some(d => this.disponibilidadCoincide(d, disponibilidad))) throw new ConflictError(`El médico ya tiene registrada la disponibilidad`);

        medico.definirDisponibilidad(disponibilidad);

        await this.medicoRepository.save(medico);

        await this.agendaService.generarTurnos({ medicoId }); // <--- NUEVO

        return { mensaje: "Disponibilidad agregada y agenda regenerada." };
    }

    async quitarDisponibilidad({medicoId, disponibilidad}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`No se encontró el médico con id: ${medicoId} .`);

        const cantidadOriginal = medico.disponibilidades.length;

        medico.disponibilidades = medico.disponibilidades.filter(d => !(this.disponibilidadCoincide(d, disponibilidad)));
        if (cantidadOriginal === medico.disponibilidades.length) throw new Error("Disponibilidad no encontrada");

        await this.medicoRepository.save(medico);

        await this.agendaService.generarTurnos({ medicoId }); // <--- NUEVO

        return { mensaje: "Disponibilidad eliminada y agenda regenerada." };

    }

    /* ===== Acciones sobre SERVICIOS ======================================================================== */
    async agregarServicio({medicoId, servicioId}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`No se encontró el médico con id: ${medicoId} .`);

        const servicio = await this.servicioRepository.findById(servicioId);
        if (!servicio) throw new NotFoundError(`No se encontró el servicio con id: ${servicioId} .`);

        if (medico.servicios.some(s => this.servicioCoincide(s, servicio))) throw new ConflictError(`El medico ${medicoId} ya tiene el servicio ${servicioId}`);

        medico.agregarServicio(servicio);

        return await this.medicoRepository.save(medico);
    }

    async quitarServicio({medicoId, servicioId}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`No se encontró el médico con id: ${medicoId} .`);

        const servicio = await this.servicioRepository.findById(servicioId);
        if (!servicio) throw new NotFoundError(`No se encontró el servicio con id: ${servicioId} .`);

        const cantidadOriginal = medico.servicios.length;

        medico.servicios = medico.servicios.filter(s => !(this.servicioCoincide(s, servicio)));
        if (cantidadOriginal === medico.servicios.length) throw new Error(`El medico ${medicoId} no tiene el servicio ${servicioId}`);

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