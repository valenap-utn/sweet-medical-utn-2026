import express from "express";
import {MedicoController} from "../controllers/MedicoController.js";

export default function medicoRoutes(getController) {
    const router = express.Router();
    const medicoController = getController(MedicoController);

    // Endpoints
    router.get('/:medicoId/pacientes/:pacienteId/turnos', medicoController.obtenerHistorial);

    router.get('/:medicoId/especialidades/:especialidadId/turnos', medicoController.consultarDisponibilidadEspecialidad);

    router.get('/:medicoId/practicas/:practicaId/turnos', medicoController.consultarDisponibilidadPractica);

    router.post('/:medicoId/disponibilidades', medicoController.agregarDisponibilidad);

    router.delete('/:medicoId/disponibilidades', medicoController.quitarDisponibilidad);

    router.post('/:medicoId/practicas/:practicaId', medicoController.agregarPractica);

    router.delete('/:medicoId/practicas/:practicaId', medicoController.quitarPractica);

    router.post('/:medicoId/especialidades/:especialidadId', medicoController.agregarEspecialidad);

    router.delete('/:medicoId/especialidades/:especialidadId', medicoController.quitarEspecialidad);

    return router;
}