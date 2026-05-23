import express from "express";
import {
    obtenerNoLeidas,
    obtenerLeidas,
    marcarComoLeida,
} from "../controllers/NotificacionController.js";

const router = express.Router();

/**
 * @route   GET /api/notificaciones/no-leidas/:usuarioId
 * @desc    Lista de notificaciones sin leer de un usuario
 */
router.get("/no-leidas/:usuarioId", obtenerNoLeidas);

/**
 * @route   GET /api/notificaciones/leidas/:usuarioId
 * @desc    Lista de notificaciones leídas de un usuario
 */
router.get("/leidas/:usuarioId", obtenerLeidas);

/**
 * @route   PATCH /api/notificaciones/:id/leer
 * @desc    Marca una notificación como leída
 * @body    { usuarioId: string }
 */
router.patch("/:id/leer", marcarComoLeida);

export default router;
