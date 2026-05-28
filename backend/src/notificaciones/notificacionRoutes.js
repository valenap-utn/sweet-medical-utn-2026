import express from "express";
import {
    obtenerNoLeidas,
    obtenerLeidas,
    marcarComoLeida,
} from "../controllers/NotificacionController.js";

const router = express.Router();

// GET /api/notificaciones/no-leidas/:usuarioId
router.get("/no-leidas/:usuarioId", obtenerNoLeidas);

// GET /api/notificaciones/leidas/:usuarioId
router.get("/leidas/:usuarioId", obtenerLeidas);

// PATCH /api/notificaciones/:id/leer
// Marca una notificación como leída
router.patch("/:id/leer", marcarComoLeida);

export default router;
