import express from "express";
import {TurnoController} from "../controllers/TurnoController.js";

export default function turnoRoutes(getController) {
    const router = express.Router();
    const turnoController = getController(TurnoController);

    // Endpoints
    router.get("/opciones-servicio", turnoController.obtenerOpcionesServicio);

    router.get("/medicos-disponibles", turnoController.obtenerMedicosDisponibles);

    router.get("/disponibles", turnoController.buscarDisponibles);

    return router;
}