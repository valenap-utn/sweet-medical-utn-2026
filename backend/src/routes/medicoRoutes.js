import express from "express";
import {MedicoController} from "../controllers/MedicoController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";

export default function medicoRoutes(getController) {
    const router = express.Router();
    const medicoController = getController(MedicoController);

    // Endpoints
    router.get('/pacientes/:pacienteId/turnos', authMiddleware, medicoController.obtenerHistorial);

    router.get('/agenda', authMiddleware, medicoController.obtenerAgenda);

    router.get('/servicios/:servicioId/turnos', authMiddleware, medicoController.consultarDisponibilidad);

    router.get('/disponibilidades', authMiddleware, medicoController.obtenerDisponibilidades);

    router.post('/disponibilidades', authMiddleware, medicoController.agregarDisponibilidad);

    router.delete('/disponibilidades', authMiddleware, medicoController.quitarDisponibilidad);

    router.post('/servicios/:servicioId', authMiddleware, medicoController.agregarServicio);

    router.delete('/servicios/:servicioId', authMiddleware, medicoController.quitarServicio);

    return router;
}