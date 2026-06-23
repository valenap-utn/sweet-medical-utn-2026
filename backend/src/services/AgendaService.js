
import {Agenda} from '../domain/Agenda.js';
import {addDays} from 'date-fns';
import {BadRequestError, NotFoundError} from "../error/AppError.js";
import {EstadoTurno} from "../domain/enums/EstadoTurno.js";

export class AgendaService {
    constructor({agendaRepository, medicoRepository, turnoRepository}) {
        this.agendaRepository = agendaRepository;
        this.medicoRepository = medicoRepository;
        this.turnoRepository = turnoRepository;
    }

    async generarTurnos({medicoId}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`No se encontró el médico ${medicoId}`);

        let turnos = [];
        let agenda = await this.agendaRepository.findByMedicoId(medicoId);
        if (!agenda) {
            agenda = await this.agendaRepository.create({medico, turnos: []});
            turnos = agenda.generarTurnos();
        } else {
            turnos = agenda.regenerarTurnos();
        }

        const turnosPersistidos = await this.turnoRepository.createMany(turnos);
        agenda.turnos.push(...turnosPersistidos);

        return await this.agendaRepository.save(agenda);
    }

    async obtenerAgenda({medicoId}) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) throw new NotFoundError(`No se encontró el médico ${medicoId}`);

        const agenda = await this.agendaRepository.findByMedicoId(medicoId);
        if (!agenda) throw new NotFoundError(`No se encontró la agenda del médico ${medicoId}`);

        return agenda;
    }

    async borrarAgenda({medicoId}) {
        const medico = await this.medicoRepository.findById(medicoId);

        if (!medico) throw new NotFoundError(`No se encontró el médico ${medicoId}`);

        const agenda = await this.agendaRepository.findByMedicoId(medicoId);

        if (!agenda) throw new NotFoundError(`No se encontró la agenda del médico ${medicoId}`);

        const turnosIds = agenda.turnos.map(turno => turno._id || turno.id || turno);

        await this.turnoRepository.deleteManyByIds(turnosIds);

        await this.agendaRepository.deleteById(agenda.id);

        return {message: "Agenda eliminada correctamente"};
    }
}