import { NotificacionModel } from "../models/NotificacionModel.js";

export class NotificacionRepository {

    async guardar(notificacion) {
        const doc = new NotificacionModel({
            _id:                   notificacion.id,
            usuarioDestinatarioId: notificacion.usuarioDestinatarioId,
            mensaje:               notificacion.mensaje,
            tipo:                  notificacion.tipo,
            leida:                 notificacion.leida,
            fechaHoraCreacion:     notificacion.fechaHoraCreacion?.toString(),
            fechaHoraLeida:        notificacion.fechaHoraLeida?.toString() ?? null,
        });
        return doc.save();
    }

    async obtenerNoLeidasPorUsuario(usuarioId) {
        return NotificacionModel.find({ usuarioDestinatarioId: usuarioId, leida: false })
            .sort({ fechaHoraCreacion: -1 })
            .lean();
    }

    async obtenerLeidasPorUsuario(usuarioId) {
        return NotificacionModel.find({ usuarioDestinatarioId: usuarioId, leida: true })
            .sort({ fechaHoraLeida: -1 })
            .lean();
    }

    async obtenerPorId(id) {
        return NotificacionModel.findById(id).lean();
    }

    async marcarComoLeida(id) {
        return NotificacionModel.findByIdAndUpdate(
            id,
            { leida: true, fechaHoraLeida: new Date() },
            { new: true }
        ).lean();
    }
}
