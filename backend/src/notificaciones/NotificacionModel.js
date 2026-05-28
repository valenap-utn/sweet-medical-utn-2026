import mongoose from "mongoose";
import { TipoNotificacion } from "../domain/Notificacion.js";

// No estoy muy segura de que haya que tener un Schema para las Notif.
const notificacionSchema = new mongoose.Schema(
    {
        destinatario: {
            type: String,
            required: true,
            index: true,
        },
        remitente: {
            type: String,
            required: true,
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

// Índice compuesto: las dos queries frecuentes son exactamente estas
notificacionSchema.index({ destinatario: 1, leida: 1, fechaHoraCreacion: -1 });

export const NotificacionModel = mongoose.model("Notificacion", notificacionSchema);
