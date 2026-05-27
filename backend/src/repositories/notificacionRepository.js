import { NotificacionModel } from "../schemas/notificacionSchema.js";

export class NotificacionRepository {
    async create(destinatarioId, remitenteId, mensaje) {
        const notifDoc = new NotificacionModel({
            destinatario: destinatarioId,
            remitente: remitenteId,
            mensaje,
            leida: false
        });
        return await notifDoc.save();
    }

    async findById(id) {
        return await NotificacionModel.findById(id);
    }

    async find(query = {}) {
        return await NotificacionModel.find(query)
            .populate("destinatario")
            .populate("remitente")
            .sort({ fechaHoraCreacion: -1 });
    }

    async save(notifDoc) {
        return await notifDoc.save();
    }
}
