import cron from 'node-cron';
import { addDays } from 'date-fns';
import { Agenda } from '../domain/Agenda.js';

export class TurnosBatchService {
    constructor({ medicoRepository, turnoRepository }) {
        this.medicoRepository = medicoRepository;
        this.turnoRepository = turnoRepository;
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

    async ejecutarGeneracion() {
        const fechaDesde = new Date();
        const fechaHasta = addDays(fechaDesde, 30);

        const medicos = await this.medicoRepository.findAll();

        for (const medico of medicos) {
            const agenda = new Agenda(medico);

            const turnosExistentes = await this.turnoRepository.findFuturosByMedico(medico._id, fechaDesde);
            agenda.turnos = turnosExistentes;

            // Unificamos los servicios
            const servicios = [...(medico.especialidades || []), ...(medico.practicas || [])];

            // Rellenamos la agenda para los próximos 30 días
            for (const servicio of servicios) {
                agenda.generarTurnos(fechaDesde, fechaHasta, servicio);
            }

            // Filtramos únicamente los turnos creados recién (no tienen _id de Mongoose)
            const nuevosTurnos = agenda.turnos.filter(turno => !turno._id);

            // Persistimos masivamente
            if (nuevosTurnos.length > 0) {
                await this.turnoRepository.insertMany(nuevosTurnos);
            }
        }
    }
}