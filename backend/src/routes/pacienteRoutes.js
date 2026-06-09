import express from "express";
import {PacienteController} from "../controllers/PacienteController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";

export default function pacienteRoutes(getController) {
    const router = express.Router();
    const pacienteController = getController(PacienteController);

    // Endpoints
    router.get('/turnos', authMiddleware, pacienteController.obtenerHistorial);

    return router;
}
