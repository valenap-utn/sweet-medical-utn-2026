import {NotificacionModel} from "../schemas/NotificacionModel.js";

export class NotificacionRepository {

    async guardar({notificacion}) {
        const doc = new NotificacionModel({
            destinatario:      notificacion.destinatario,
            remitente:         notificacion.remitente,
            mensaje:           notificacion.mensaje,
            tipo:              notificacion.tipo,
            leida:             notificacion.leida,
            fechaHoraCreacion: new Date(notificacion.fechaHoraCreacion.toString()),
            fechaHoraLeida:    notificacion.fechaHoraLeida
                                   ? new Date(notificacion.fechaHoraLeida.toString())
                                   : null,
        });
        return doc.save();
    }

    // Notificaciones no leídas de un usuario, más recientes primero.
    async obtenerNoLeidasPorUsuario({usuarioId}) {
        return NotificacionModel
            .find({ destinatario: usuarioId, leida: false })
            .sort({ fechaHoraCreacion: -1 })
            .lean();
    }

    // Notificaciones leídas de un usuario, más recientemente leídas primero.
    async obtenerLeidasPorUsuario({usuarioId}) {
        return NotificacionModel
            .find({ destinatario: usuarioId, leida: true })
            .sort({ fechaHoraLeida: -1 })
            .lean();
    }

    async obtenerPorId({id}) {
        return NotificacionModel.findById(id).lean();
    }

    async marcarComoLeida({id}) {
        return NotificacionModel.findByIdAndUpdate(
            id,
            { leida: true, fechaHoraLeida: new Date() },
            { new: true }
        ).lean();
    }
}
