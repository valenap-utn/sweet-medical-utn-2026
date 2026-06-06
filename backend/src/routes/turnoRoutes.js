import express from "express";
import {TurnoController} from "../controllers/TurnoController.js";

export default function turnoRoutes(getController) {
    const router = express.Router();
    const turnoController = getController(TurnoController);

    // Endpoints
    router.post("/", turnoController.crearTurno);

    router.get("/disponibles", turnoController.buscarTurnosDisponibles);

    router.get("/:turnoId/cotizacion", turnoController.obtenerCotizacionTurno);

    router.patch("/:turnoId/reserva", turnoController.reservarTurno);

    router.patch("/:turnoId/cancelacion", turnoController.cancelarTurno);

    router.patch("/:turnoId/realizacion", turnoController.marcarTurnoRealizado)

    return router;
}