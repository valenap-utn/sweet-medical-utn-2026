import cron from 'node-cron';
import {addDays} from 'date-fns';
import {Agenda} from '../domain/Agenda.js';
import {NotFoundError} from "../error/AppError.js";
import {ServicioInvalido} from "../exceptions/ServicioInvalido.js";

export class TurnosBatchService {
    constructor({medicoRepository, turnoRepository, servicioRepository}) {
        this.medicoRepository = medicoRepository;
        this.turnoRepository = turnoRepository;
        this.servicioRepository = servicioRepository;
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
        const servicio = await this.servicioRepository.findById(disponibilidad.servicio);
        if (!servicio) throw new ServicioInvalido(`Servicio ${disponibilidad.servicio} no existe`);

        return servicio
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