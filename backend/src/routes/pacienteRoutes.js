import express from "express";
import { requireRole } from "../middlewares/roleMiddleware.js";
import { RolUsuario } from "../domain/enums/RolUsuario.js";
import {PacienteController} from "../controllers/PacienteController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";

export default function pacienteRoutes(getController) {
    const router = express.Router();
    const pacienteController = getController(PacienteController);

    // Endpoints
    router.get(
        '/turnos',
        authMiddleware,
        requireRole(RolUsuario.PACIENTE),
        pacienteController.obtenerHistorial);

    return router;
}
