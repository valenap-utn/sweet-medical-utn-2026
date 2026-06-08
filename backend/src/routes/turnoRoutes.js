import express from "express";
import {TurnoController} from "../controllers/TurnoController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";

export default function turnoRoutes(getController) {
    const router = express.Router();
    const turnoController = getController(TurnoController);

    // Endpoints
    router.post("/", turnoController.crearTurno);

    router.get("/disponibles", turnoController.buscarTurnosDisponibles);

    router.get("/:turnoId/cotizacion", authMiddleware, turnoController.obtenerCotizacionTurno);

    router.patch("/:turnoId/reserva", authMiddleware, turnoController.reservarTurno);

    router.patch("/:turnoId/cancelacion", authMiddleware, turnoController.cancelarTurno);

    router.patch("/:turnoId/realizacion", authMiddleware, turnoController.marcarTurnoRealizado)

    return router;
}