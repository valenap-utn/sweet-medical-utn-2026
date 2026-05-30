export class NotificacionController {
    constructor(notificacionService) {
        this.notificacionService = notificacionService;
    }

    // Retorna todas las notificaciones sin leer del usuario, ordenadas de más reciente a más antigua.
    obtenerNoLeidas = async (req, res, next) => {
        try {
            const {usuarioId} = req.params;
            const notificaciones = await this.notificacionService.obtenerNoLeidas({usuarioId});
            res.status(200).json({data: notificaciones});
        } catch (e) {
            next(e);
        }
    }

// Retorna todas las notificaciones ya leídas del usuario, ordenadas por fechaHoraLeida desc.
    obtenerLeidas = async (req, res, next) => {
        try {
            const {usuarioId} = req.params;
            const notificaciones = await this.notificacionService.obtenerLeidas({usuarioId});
            res.status(200).json({data: notificaciones});
        } catch (e) {
            next(e);
        }
    }

// Marca una notificación como leída. Idempotente.
    marcarComoLeida = async (req, res, next) => {
        try {
            const {id} = req.params;
            const {usuarioId} = req.body;
            const notificacion = await this.notificacionService.marcarComoLeida({id, usuarioId});
            res.status(200).json({data: notificacion});
        } catch (e) {
            next(e);
        }
    }
}
