import express from 'express';
import {AgendaController} from "../controllers/AgendaController.js";

export default function agendaRoutes(getController) {
    const router = express.Router();
    const agendaController = getController(AgendaController);

    // Endpoints
    router.post('/:medicoId', agendaController.generarTurnosManualmente);

    router.get('/:medicoId', agendaController.obtenerAgenda);

    router.delete('/:medicoId', agendaController.borrarAgenda);

    return router;
}