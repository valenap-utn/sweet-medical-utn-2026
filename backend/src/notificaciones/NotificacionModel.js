import mongoose from "mongoose";
import { TipoNotificacion } from "../domain/Notificacion.js";

const notificacionSchema = new mongoose.Schema(
    {
        usuarioDestinatarioId: {
            type: String,
            required: true,
            index: true,
        },
        mensaje: {
            type: String,
            required: true,
        },
        tipo: {
            type: String,
            enum: Object.values(TipoNotificacion),
            required: true,
        },
        leida: {
            type: Boolean,
            default: false,
            index: true,
        },
        fechaHoraCreacion: {
            type: Date,
            default: Date.now,
        },
        fechaHoraLeida: {
            type: Date,
            default: null,
        },
    },
    { versionKey: false }
);

// índice compuesto: consultas frecuentes por destinatario + estado de lectura
notificacionSchema.index({ usuarioDestinatarioId: 1, leida: 1 });

export const NotificacionModel = mongoose.model("Notificacion", notificacionSchema);
