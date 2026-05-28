import {NotificacionService} from "../services/NotificacionService.js";
import {NotificacionRepository} from "../repositories/NotificacionRepository.js";

// Composición manual — reemplazable por un contenedor DI en iteraciones posteriores
const notificacionService = new NotificacionService(new NotificacionRepository());

// Retorna todas las notificaciones sin leer del usuario, ordenadas de más reciente a más antigua.
export async function obtenerNoLeidas(req, res, next) {
    try {
        const {usuarioId} = req.params;
        const notificaciones = await notificacionService.obtenerNoLeidas(usuarioId);
        res.status(200).json({data: notificaciones});
    } catch (e) {
        next(e);
    }
}

// Retorna todas las notificaciones ya leídas del usuario, ordenadas por fechaHoraLeida desc.
export async function obtenerLeidas(req, res, next) {
    try {
        const {usuarioId} = req.params;
        const notificaciones = await notificacionService.obtenerLeidas(usuarioId);
        res.status(200).json({data: notificaciones});
    } catch (e) {
        next(e);
    }
}

// Marca una notificación como leída. Idempotente.
export async function marcarComoLeida(req, res, next) {
    try {
        const {id} = req.params;
        const {usuarioId} = req.body;
        const notificacion = await notificacionService.marcarComoLeida(id, usuarioId);
        res.status(200).json({data: notificacion});
    } catch (e) {
        next(e);
    }
}
