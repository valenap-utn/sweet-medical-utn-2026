import express from "express";
import {NotificacionController} from "../controllers/NotificacionController.js";

export default function notificacionRoutes(getController) {
    const router = express.Router();
    const notificacionController = getController(NotificacionController);

    // GET /api/notificaciones/no-leidas/:usuarioId
    router.get("/no-leidas/:usuarioId", notificacionController.obtenerNoLeidas);

    // GET /api/notificaciones/leidas/:usuarioId
    router.get("/leidas/:usuarioId", notificacionController.obtenerLeidas);

    // PATCH /api/notificaciones/:id/leer
    // Marca una notificación como leída
    router.patch("/:id/leer", notificacionController.marcarComoLeida);

    return router;
}
