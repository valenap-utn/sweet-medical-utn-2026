import express from 'express';
import {AgendaController} from '../controllers/AgendaController.js';

export default function agendaRoutes(getController) {
    const router = express.Router();
    const agendaController = getController(AgendaController);

    // PUT: Modifica la disponibilidad y re-calcula la agenda
    router.put('/medicos/:medicoId/disponibilidad', agendaController.actualizarDisponibilidad);

    // POST: Genera turnos manualmente para un rango de fechas
    router.post('/medicos/:medicoId/generar', agendaController.generarTurnosManualmente);

    return router;
}
