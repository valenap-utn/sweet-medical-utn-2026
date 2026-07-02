import cron from 'node-cron';
import {addDays} from 'date-fns';
import {Agenda} from '../domain/Agenda.js';
import {TipoServicio} from "../domain/enums/TipoServicio.js";
import {BadRequestError, NotFoundError} from "../error/AppError.js";

export class TurnosBatchService {
    constructor({medicoRepository, turnoRepository, especialidadRepository, practicaRepository}) {
        this.medicoRepository = medicoRepository;
        this.turnoRepository = turnoRepository;
        this.especialidadRepository = especialidadRepository;
        this.practicaRepository = practicaRepository;
    }

    iniciarCron() {
        // Se ejecuta todos los días a las 02:00 AM
        cron.schedule('0 2 * * *', async () => {
            console.log('Iniciando proceso batch de generación de turnos...');
            try {
                await this.ejecutarGeneracion();
                console.log('Proceso batch finalizado exitosamente.');
            } catch (error) {
                console.error('Error ejecutando el batch de turnos:', error);
            }
        });
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

    async ejecutarGeneracion() {
        const fechaDesde = new Date();
        const fechaHasta = addDays(fechaDesde, 30);

        const medicos = await this.medicoRepository.findAll();

        for (const medico of medicos) {
            const agenda = new Agenda(medico);

            const turnosExistentes = await this.turnoRepository.findFuturosByMedico(medico._id, fechaDesde);
            agenda.turnos = turnosExistentes;


            // Rellenamos la agenda para los próximos 30 días
            for (const disponibilidad of medico.disponibilidades || []) {
                const servicio = await this.resolverServicio(disponibilidad);
                if (!servicio) throw new NotFoundError(`No se encontró el servicio asociado a la disponibilidad.`);

                agenda.generarTurnos(fechaDesde, fechaHasta, disponibilidad, servicio);
            }

            // Filtramos únicamente los turnos creados recién (no tienen _id de Mongoose)
            const nuevosTurnos = agenda.turnos.filter(turno => turno.esNuevo);

            // Persistimos masivamente
            if (nuevosTurnos.length > 0) {
                const turnosParaInsertar = nuevosTurnos.map(({esNuevo, ...turno}) => turno);
                await this.turnoRepository.insertMany(turnosParaInsertar);
            }
        }
    }
}