import express from "express";
import {MedicoController} from "../controllers/MedicoController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";

export default function medicoRoutes(getController) {
    const router = express.Router();
    const medicoController = getController(MedicoController);

    // Endpoints
    router.get('/pacientes/:pacienteId/turnos', authMiddleware, medicoController.obtenerHistorial);

    router.get('/especialidades/:especialidadId/turnos', authMiddleware, medicoController.consultarDisponibilidadEspecialidad);

    router.get('/practicas/:practicaId/turnos', authMiddleware, medicoController.consultarDisponibilidadPractica);

    router.get('/disponibilidades', authMiddleware, medicoController.obtenerDisponibilidades);

    router.post('/disponibilidades', authMiddleware, medicoController.agregarDisponibilidad);

    router.delete('/disponibilidades', authMiddleware, medicoController.quitarDisponibilidad);

    router.post('/practicas/:practicaId', authMiddleware, medicoController.agregarPractica);

    router.delete('/practicas/:practicaId', authMiddleware, medicoController.quitarPractica);

    router.post('/especialidades/:especialidadId', authMiddleware, medicoController.agregarEspecialidad);

    router.delete('/especialidades/:especialidadId', authMiddleware, medicoController.quitarEspecialidad);

    return router;
}