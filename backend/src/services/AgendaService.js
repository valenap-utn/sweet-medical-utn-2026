import {Agenda} from '../domain/Agenda.js';
import {addDays} from 'date-fns';
import {BadRequestError, NotFoundError} from "../error/AppError.js";
import {EstadoTurno} from "../domain/enums/EstadoTurno.js";
import {TipoServicio} from "../domain/enums/TipoServicio.js";

export class AgendaService {
    constructor({medicoRepository, turnoRepository, especialidadRepository, practicaRepository}) {
        this.medicoRepository = medicoRepository;
        this.turnoRepository = turnoRepository;
        this.especialidadRepository = especialidadRepository;
        this.practicaRepository = practicaRepository;
    }

    async resolverServicio(disponibilidad) {
        if (disponibilidad.tipoServicio === TipoServicio.ESPECIALIDAD) {
            return await this.especialidadRepository.findById(disponibilidad.servicio);
        }

        if (disponibilidad.tipoServicio === TipoServicio.PRACTICA) {
            return await this.practicaRepository.findById(disponibilidad.servicio);
        }

        throw new BadRequestError(`Tipo de servicio inválido: ${disponibilidad.tipoServicio}`);
    }

    async regenerarAgenda({medicoId}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`No se encontró un médico con id: ${medicoId}`);

        const fechaDesde = new Date();
        const fechaHasta = addDays(fechaDesde, 30);

        const turnosFuturos = await this.turnoRepository.findFuturosByMedico(medicoId, fechaDesde);

        const agenda = new Agenda(medico);
        agenda.turnos = [...turnosFuturos];

        // Se limpia la agenda en base a la disponibilidad ACTUAL del médico
        agenda.refrescarTurnos();

        const idsTurnosValidos = agenda.turnos.map(t => t._id?.toString()).filter(id => id);
        const turnosAEliminar = turnosFuturos.filter(t =>
            t.estado === EstadoTurno.DISPONIBLE.nombre && // para que no modifique aquellos futuros ya reservados
            !idsTurnosValidos.includes(t._id?.toString())
        );

        if (turnosAEliminar.length > 0) {
            const idsAEliminar = turnosAEliminar.map(t => t._id);
            await this.turnoRepository.deleteMany(idsAEliminar);
        }

        for (const disponibilidad of medico.disponibilidades || []) {
            const servicio = await this.resolverServicio(disponibilidad);
            if (!servicio) throw new NotFoundError(`No se encontró el servicio asociado a la disponibilidad.`);

            agenda.generarTurnos(fechaDesde, fechaHasta, disponibilidad, servicio);
        }

        /*console.log("Turnos totales en agenda:", agenda.turnos.length);
        console.log("Turnos nuevos:", agenda.turnos.filter(t => !t._id).length);
        console.log("Primer turno:", agenda.turnos[0]);*/

        const nuevosTurnos = agenda.turnos.filter(turno => turno.esNuevo);
        if (nuevosTurnos.length > 0) {
            const turnosParaInsertar = nuevosTurnos.map(({esNuevo, ...turno}) => turno);
            await this.turnoRepository.insertMany(turnosParaInsertar);
        }

        return {
            mensaje: "Agenda regenerada exitosamente.",
            turnosEliminados: turnosAEliminar.length,
            turnosGenerados: nuevosTurnos.length
        };
    }

    async generarTurnosParaMedico({medicoId, fechaDesde, fechaHasta}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`No se encontró un médico con id: ${medicoId}`);

        const turnosExistentes = await this.turnoRepository.findFuturosByMedico(medicoId, fechaDesde);

        const agenda = new Agenda(medico);
        agenda.turnos = turnosExistentes;

        for (const disponibilidad of medico.disponibilidades || []) {
            const servicio = await this.resolverServicio(disponibilidad);
            if (!servicio) throw new NotFoundError(`No se encontró el servicio asociado a la disponibilidad.`);

            agenda.generarTurnos(fechaDesde, fechaHasta, disponibilidad, servicio);
        }

        /*console.log("Turnos totales en agenda:", agenda.turnos.length);
        console.log("Turnos nuevos:", agenda.turnos.filter(t => !t._id).length);
        console.log("Primer turno:", agenda.turnos[0]);*/

        const nuevosTurnos = agenda.turnos.filter(turno => turno.esNuevo);
        if (nuevosTurnos.length > 0) {
            const turnosParaInsertar = nuevosTurnos.map(({esNuevo, ...turno}) => turno);
            await this.turnoRepository.insertMany(turnosParaInsertar);
        }

        return {
            mensaje: "Turnos generados exitosamente.",
            turnosGenerados: nuevosTurnos.length
        };
    }

    // TODO: chequear que esta implementación sea correcta
    async modificarDisponibilidad({medicoId, nuevasDisponibilidades}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`No se encontró un médico con id: ${medicoId}`);

        // Actualizamos disponibilidades
        if (!Array.isArray(nuevasDisponibilidades)) throw new BadRequestError(`Las disponibilidades deben enviarse como array, se recibió: ${typeof nuevasDisponibilidades} `);

        medico.disponibilidades = nuevasDisponibilidades;
        await this.medicoRepository.save(medico); //"reescribimos" al medico que ya teníamos con sus nuevas disponibilidades

        // Regeneramos agenda futura
        return await this.regenerarAgenda({medicoId});
    }
}