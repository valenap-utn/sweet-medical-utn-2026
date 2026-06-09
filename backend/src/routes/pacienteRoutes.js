import express from "express";
import {PacienteController} from "../controllers/PacienteController.js";

export default function pacienteRoutes(getController) {
    const router = express.Router();
    const pacienteController = getController(PacienteController);

    // Endpoints
    router.get('/:pacienteId/turnos', pacienteController.obtenerHistorial);

    return router;
}
