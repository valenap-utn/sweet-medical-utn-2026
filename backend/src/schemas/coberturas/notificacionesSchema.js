import mongoose from "mongoose";
import {Notificacion} from "../../domain/Notificacion.js";

const NotificacionSchema = new mongoose.Schema({
    destinatario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    remitente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    mensaje: {
        type: String,
        required: true
    },
    fechaHoraCreacion: {
        type: Date,
        default: Date.now
    },
    fechaHoraLeida: {
        type: Date,
        default: null
    },
    leida: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

NotificacionSchema.loadClass(Notificacion);

export const NotificacionModel = mongoose.model("Notificacion", NotificacionSchema);
