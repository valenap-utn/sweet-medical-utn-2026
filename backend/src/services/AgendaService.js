import { Agenda } from '../domain/Agenda.js';
import { addDays } from 'date-fns';

export class AgendaService {
    constructor({ medicoRepository, turnoRepository }) {
        this.medicoRepository = medicoRepository;
        this.turnoRepository = turnoRepository;
    }

    async regenerarAgenda({ medicoId }) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new Error("Médico no encontrado");

        const fechaDesde = new Date();
        const fechaHasta = addDays(fechaDesde, 30);

        const turnosFuturos = await this.turnoRepository.findFuturosByMedico(medicoId, fechaDesde);

        const agenda = new Agenda(medico);
        agenda.turnos = [...turnosFuturos];

        // Se limpia la agenda en base a la disponibilidad ACTUAL del médico
        agenda.refrescarTurnos();

        const idsTurnosValidos = agenda.turnos.map(t => t._id?.toString()).filter(id => id);
        const turnosAEliminar = turnosFuturos.filter(t => !idsTurnosValidos.includes(t._id?.toString()));

        if (turnosAEliminar.length > 0) {
            const idsAEliminar = turnosAEliminar.map(t => t._id);
            await this.turnoRepository.deleteMany(idsAEliminar);
        }

        const servicios = [...(medico.especialidades || []), ...(medico.practicas || [])];
        for (const servicio of servicios) {
            agenda.generarTurnos(fechaDesde, fechaHasta, servicio);
        }

        const nuevosTurnos = agenda.turnos.filter(turno => !turno._id);
        if (nuevosTurnos.length > 0) {
            await this.turnoRepository.insertMany(nuevosTurnos);
        }

        return {
            mensaje: "Agenda regenerada exitosamente.",
            turnosEliminados: turnosAEliminar.length,
            turnosGenerados: nuevosTurnos.length
        };
    }

    async generarTurnosParaMedico({ medicoId, fechaDesde, fechaHasta }) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new Error("Médico no encontrado");

        const turnosExistentes = await this.turnoRepository.findFuturosByMedico(medicoId, fechaDesde);

        const agenda = new Agenda(medico);
        agenda.turnos = turnosExistentes;

        const servicios = [...(medico.especialidades || []), ...(medico.practicas || [])];
        for (const servicio of servicios) {
            agenda.generarTurnos(fechaDesde, fechaHasta, servicio);
        }

        const nuevosTurnos = agenda.turnos.filter(turno => !turno._id);
        if (nuevosTurnos.length > 0) {
            await this.turnoRepository.insertMany(nuevosTurnos);
        }

        return {
            mensaje: "Turnos generados exitosamente.",
            turnosGenerados: nuevosTurnos.length
        };
    }
}