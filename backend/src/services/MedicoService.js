import {TipoServicio} from "../domain/enums/TipoServicio.js";
import {BadRequestError, ConflictError, NotFoundError} from "../error/AppError.js";
import {endOfDay, isAfter, isValid, parseISO, startOfDay,} from "date-fns";
import {EstadoTurno} from "../domain/enums/EstadoTurno.js";

export class MedicoService {
    constructor({
                    medicoRepository,
                    turnoRepository,
                    especialidadRepository,
                    practicaRepository,
                    agendaService,
                    sedeRepository
                }) {
        this.medicoRepository = medicoRepository;
        this.turnoRepository = turnoRepository;
        this.especialidadRepository = especialidadRepository;
        this.practicaRepository = practicaRepository;
        this.agendaService = agendaService;
        this.sedeRepository = sedeRepository;
    }

    // Para consultar el historial de turnos de un paciente específico
    async obtenerHistorial({pacienteId, medicoId}) {
        return await this.turnoRepository.findByMedicoAndPacienteId({pacienteId, medicoId});
    }

    // Sedes
    async obtenerSedes({medicoId}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`No se encontró al médico con id: ${medicoId}`);
        return medico.sedes;
    }

    async obtenerEspecialidades({medicoId}) {
        const medico = await this.medicoRepository.findById(medicoId);

        if (!medico) {
            throw new NotFoundError(
                `No se encontró al médico con id: ${medicoId}`
            );
        }


        return medico.especialidades;
    }

    async obtenerPracticas({medicoId}) {
        const medico = await this.medicoRepository.findById(medicoId);

        if (!medico) {
            throw new NotFoundError(
                `No se encontró al médico con id: ${medicoId}`
            );
        }

        return medico.practicas;
    }

    async obtenerAgenda({medicoId, filtros}) {
        const medico = await this.medicoRepository.findById(medicoId);

        if (!medico) {
            throw new NotFoundError(
                `No se encontró al médico con id: ${medicoId}.`
            );
        }

        let fechaDesde = filtros.fechaDesde
            ? parseISO(filtros.fechaDesde)
            : new Date();

        let fechaHasta = filtros.fechaHasta
            ? parseISO(filtros.fechaHasta)
            : undefined;

        if (!isValid(fechaDesde)) {
            throw new BadRequestError("La fechaDesde no es válida.");
        }

        if (fechaHasta && !isValid(fechaHasta)) {
            throw new BadRequestError("La fechaHasta no es válida.");
        }

        fechaDesde = startOfDay(fechaDesde);

        if (fechaHasta) {
            fechaHasta = endOfDay(fechaHasta);
        }

        if (fechaHasta && isAfter(fechaDesde, fechaHasta)) {
            throw new BadRequestError(
                "La fechaDesde no puede ser posterior a fechaHasta."
            );
        }

        const estadosValidos = Object.values(EstadoTurno)
            .filter((estado) => estado instanceof EstadoTurno)
            .map((estado) => estado.nombre);

        if (
            filtros.estado &&
            !estadosValidos.includes(filtros.estado)
        ) {
            throw new BadRequestError(
                `Estado inválido: ${filtros.estado}.`
            );
        }

        return await this.turnoRepository.buscarAgendaMedico({
            medicoId,
            fechaDesde,
            fechaHasta,
            estado: filtros.estado,
        });
    }

    async agregarSede({medicoId, sedeId}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`El médico con id: ${medicoId} no fue encontrado.`);

        const sede = await this.sedeRepository.findById(sedeId);
        if (!sede) throw new NotFoundError(`No se encontró la sede con id: ${sedeId}`);

        medico.agregarSede(sede);

        // console.log(medico.sedes)

        await this.medicoRepository.save(medico);

        return {mensaje: `Sede asociada correctamente al médico ${medico.nombre}.`};
    }

    async quitarSede({medicoId, sedeId}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`El médico con id: ${medicoId} no fue encontrado.`);

        const sede = await this.sedeRepository.findById(sedeId);
        if (!sede) throw new NotFoundError(`No se encontró la sede con id: ${sedeId}`);

        const cantidadOriginal = medico.sedes.length;

        medico.quitarSede(sede);

        if (medico.sedes.length === cantidadOriginal) throw new NotFoundError(`El médico no tiene asociada la sede indicada con id: ${sedeId}.`);

        // Quitamos las disponibilidades que tenía el médico, asociadas a la sede eliminada
        medico.disponibilidades = medico.disponibilidades.filter(d => {
            const disponibilidadSedeId = d.sede?.toString() ?? d.sede?.toString();
            return disponibilidadSedeId !== sedeId.toString();
        })

        await this.medicoRepository.save(medico);

        await this.agendaService.regenerarAgenda({medicoId});

        return {mensaje: `Sede removida correctamente del médico ${medico.nombre}.`};
    }


    /* ===== Acciones sobre DISPONIBILIDADES ======================================================================== */
    async consultarDisponibilidadEspecialidad({medicoId, especialidadId}) {
        console.log({medicoId, especialidadId});
        return await this.turnoRepository.buscarTurnosDisponibles({
            medicoId: medicoId,
            tipoServicio: TipoServicio.ESPECIALIDAD,
            especialidadId: especialidadId
        })
    }

    async consultarDisponibilidadPractica({medicoId, practicaId}) {
        return await this.turnoRepository.buscarTurnosDisponibles({
            medicoId: medicoId,
            tipoServicio: TipoServicio.PRACTICA,
            practicaId: practicaId
        })
    }

    // Obtiene todas las disponibilidades del médico (sin importar el tipoServicio)
    async obtenerDisponibilidades({medicoId}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`No se encontró el médico con id: ${medicoId} .`);
        return medico.disponibilidades;
    }

    async agregarDisponibilidad({medicoId, disponibilidad}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`No se encontró el médico con id: ${medicoId} .`);

        if (!this.disponibilidadValida(disponibilidad)) throw new BadRequestError("Disponibilidad no válida. Debe indicar diaSemana, horaDesde, horaHasta, sedeId, tipoServicio y servicio.");

        const disponibilidadNormalizada = await this.normalizarDisponibilidad({medico, disponibilidad});

        if (this.tieneSolapamientos(medico.disponibilidades, disponibilidadNormalizada)) {
            throw new ConflictError(`El médico ya tiene una disponibilidad solapada para ese día y horario.`);
        }

        medico.definirDisponibilidad(disponibilidadNormalizada);

        await this.medicoRepository.save(medico);

        await this.agendaService.regenerarAgenda({medicoId}); // <--- NUEVO

        return {mensaje: "Disponibilidad agregada y agenda regenerada."};
    }

    async quitarDisponibilidad({medicoId, disponibilidad}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`No se encontró el médico con id: ${medicoId} .`);

        if (!this.disponibilidadValida(disponibilidad)) throw new BadRequestError("Disponibilidad no válida.");

        const disponibilidadNormalizada = await this.normalizarDisponibilidad({medico, disponibilidad});

        const cantidadOriginal = medico.disponibilidades.length;

        medico.disponibilidades = medico.disponibilidades.filter(d => !(this.disponibilidadCoincide(d, disponibilidadNormalizada)));
        if (cantidadOriginal === medico.disponibilidades.length) throw new NotFoundError("Disponibilidad no encontrada");

        await this.medicoRepository.save(medico);

        await this.agendaService.regenerarAgenda({medicoId}); // <--- NUEVO

        return {mensaje: "Disponibilidad eliminada y agenda regenerada."};

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
        if (cantidadOriginal === medico.especialidades.length) throw new NotFoundError(`El medico ${medicoId} no tiene la especialidad ${especialidadId}`);

        medico.disponibilidades = (medico.disponibilidades || []).filter(d =>
            !(
                d.tipoServicio === TipoServicio.ESPECIALIDAD &&
                d.servicio?.toString() === especialidadId.toString()
            )
        );

        await this.medicoRepository.save(medico);
        await this.agendaService.regenerarAgenda({ medicoId });
        return { mensaje: "Especialidad quitada y agenda regenerada." };

    }

    /* ===== Acciones sobre PRACTICAS ======================================================================== */
    async agregarPractica({medicoId, practicaId}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`No se encontró el médico con id: ${medicoId} .`);

        const practica = await this.practicaRepository.findById(practicaId);
        if (!practica) throw new NotFoundError(`No se encontró la práctica con id: ${practicaId} .`);

        if (medico.practicas.some(p => this.servicioCoincide(p, practica))) throw new ConflictError(`El medico ${medicoId} ya tiene la práctica ${practicaId}`);

        medico.agregarPractica(practica);

        return await this.medicoRepository.save(medico);
    }

    async quitarPractica({ medicoId, practicaId }) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) {
            throw new NotFoundError(`No se encontró el médico con id: ${medicoId} .`);
        }

        const practica = await this.practicaRepository.findById(practicaId);
        if (!practica) {
            throw new NotFoundError(`No se encontró la práctica con id: ${practicaId} .`);
        }

        const cantidadOriginal = medico.practicas.length;

        medico.practicas = medico.practicas.filter(p =>
            !this.servicioCoincide(p, practica)
        );

        if (cantidadOriginal === medico.practicas.length) {
            throw new NotFoundError(`El médico ${medicoId} no tiene la práctica ${practicaId}`);
        }

        medico.disponibilidades = (medico.disponibilidades || []).filter(d =>
            !(
                d.tipoServicio === TipoServicio.PRACTICA &&
                d.servicio?.toString() === practicaId.toString()
            )
        );

        await this.medicoRepository.save(medico);
        await this.agendaService.regenerarAgenda({ medicoId });

        return { mensaje: "Práctica quitada y agenda regenerada." };
    }


    // -------------------------------------------- FUNCIONES AUXILIARES -----------------------------------------------------------------

    disponibilidadValida(disponibilidad) {
        if (!disponibilidad) return false;

        const formatoHora = /^([01]\d|2[0-3]):([0-5]\d)$/; // Verifica que el formato ingresado de horario sea de forma "HH:mm" Ejemplo: "08:00"

        return Boolean(disponibilidad.diaSemana &&
            formatoHora.test(disponibilidad.horaDesde) &&
            formatoHora.test(disponibilidad.horaHasta) &&
            disponibilidad.horaHasta > disponibilidad.horaDesde &&
            disponibilidad.sedeId &&
            disponibilidad.tipoServicio &&
            disponibilidad.servicio &&
            Object.values(TipoServicio).includes(disponibilidad.tipoServicio)
        );
    }

    async normalizarDisponibilidad({medico, disponibilidad}) {
        /*const sedeExisteEnMedico = medico.sedes.some(s => {
            const id = s._id?.toString() ?? s.id?.toString() ?? s.toString();
            return id === disponibilidad.sedeId.toString();
        });*/

        const sedeIdRecibida = disponibilidad.sedeId.toString();
        const sedeExisteEnMedico = medico.sedes.some(s => {
            const sedeIdDelMedico = s._id?.toString() || s.id?.toString() || s.toString();
            return sedeIdRecibida === sedeIdDelMedico;
        })

        /*console.log("medicoId encontrado:", medico._id.toString());
        console.log("sedeId recibida:", disponibilidad.sedeId);

        console.log("sedes del medico:", medico.sedes.map(s => ({
            raw: s,
            _id: s._id?.toString(),
            id: s.id?.toString(),
            toString: s.toString()
        })));*/

        if (!sedeExisteEnMedico) throw new BadRequestError("El médico no atiende en la sede indicada.");

        let servicio;

        if (disponibilidad.tipoServicio === TipoServicio.ESPECIALIDAD) {
            servicio = await this.especialidadRepository.findById(disponibilidad.servicio);
            if (!servicio) throw new NotFoundError(`No se encontró la especialidad con id: ${disponibilidad.servicio}`);

            const medicoTieneEspecialidad = medico.especialidades.some(e =>
                e._id?.toString() === disponibilidad.servicio.toString()
            );

            if (!medicoTieneEspecialidad) throw new BadRequestError(`El médico no tiene asociada esa especialidad.`);
        }

        if (disponibilidad.tipoServicio === TipoServicio.PRACTICA) {
            servicio = await this.practicaRepository.findById(disponibilidad.servicio);
            if (!servicio) throw new NotFoundError(`No se encontró la practica con id: ${disponibilidad.servicio}`);

            const medicoTienePractica = medico.practicas.some(p =>
                p._id?.toString() === disponibilidad.servicio.toString()
            );

            if (!medicoTienePractica) throw new BadRequestError(`El médico no tiene asociada esa práctica.`);
        }

        return {
            diaSemana: disponibilidad.diaSemana,
            horaDesde: disponibilidad.horaDesde,
            horaHasta: disponibilidad.horaHasta,
            sede: disponibilidad.sedeId,
            tipoServicio: disponibilidad.tipoServicio,
            servicio: disponibilidad.servicio
        }
    }

    disponibilidadCoincide(d, disponibilidad) {
        return d.diaSemana === disponibilidad.diaSemana &&
            d.horaDesde === disponibilidad.horaDesde &&
            d.horaHasta === disponibilidad.horaHasta &&
            d.sede?.toString() === disponibilidad.sede?.toString() &&
            d.tipoServicio === disponibilidad.tipoServicio &&
            d.servicio?.toString() === disponibilidad.servicio?.toString();
    }

    tieneSolapamientos(disponibilidades, nuevaDisponibilidad) {
        return disponibilidades.some(d =>
            d.diaSemana === nuevaDisponibilidad.diaSemana &&
            this.horariosSeSolapan(
                d.horaDesde,
                d.horaHasta,
                nuevaDisponibilidad.horaDesde,
                nuevaDisponibilidad.horaHasta,
            )
        );
    }

    horariosSeSolapan(desdeA, hastaA, desdeB, hastaB) {
        return desdeA < hastaB && desdeB < hastaA;
    }

    servicioCoincide(s, servicio) {
        const idA = s._id?.toString() ?? s.id?.toString() ?? s.toString();
        const idB = servicio._id?.toString() ?? servicio.id?.toString() ?? servicio.toString();
        return idA === idB;
    }

}