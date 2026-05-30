import express from 'express';

import { TurnoRepository } from '../repositories/TurnoRepository.js';
import { MedicoRepository } from '../repositories/MedicoRepository.js';

import { AgendaService } from '../services/AgendaService.js';
import { AgendaController } from '../controllers/AgendaController.js';

const router = express.Router();


// Instanciamos la capa de datos
const medicoRepository = new MedicoRepository();
const turnoRepository = new TurnoRepository();

// Instanciamos la capa de servicio pasándole los repositorios
const agendaService = new AgendaService({
    medicoRepository,
    turnoRepository
});

//  Instanciamos el controller pasándole el servicio
const agendaController = new AgendaController({
    agendaService
});


// PUT: Modifica la disponibilidad y re-calcula la agenda
router.put('/medicos/:medicoId/disponibilidad', agendaController.actualizarDisponibilidad);

// POST: Genera turnos manualmente para un rango de fechas
router.post('/medicos/:medicoId/generar', agendaController.generarTurnosManualmente);

export default router;