import { NotificacionService } from "../services/NotificacionService.js";
import { NotificacionRepository } from "../repositories/NotificacionRepository.js";

// Composición manual — se puede reemplazar por un contenedor DI si el proyecto lo incorpora
const notificacionService = new NotificacionService(new NotificacionRepository());

/**
 * GET /api/notificaciones/no-leidas/:usuarioId
 */
export async function obtenerNoLeidas(req, res, next) {
    try {
        const { usuarioId } = req.params;
        const notificaciones = await notificacionService.obtenerNoLeidas(usuarioId);
        res.status(200).json({ data: notificaciones });
    } catch (e) {
        next(e);
    }
}

/**
 * GET /api/notificaciones/leidas/:usuarioId
 */
export async function obtenerLeidas(req, res, next) {
    try {
        const { usuarioId } = req.params;
        const notificaciones = await notificacionService.obtenerLeidas(usuarioId);
        res.status(200).json({ data: notificaciones });
    } catch (e) {
        next(e);
    }
}

/**
 * PATCH /api/notificaciones/:id/leer
 * Body: { usuarioId: string }
 */
export async function marcarComoLeida(req, res, next) {
    try {
        const { id } = req.params;
        const { usuarioId } = req.body;
        const notificacion = await notificacionService.marcarComoLeida(id, usuarioId);
        res.status(200).json({ data: notificacion });
    } catch (e) {
        next(e);
    }
}
