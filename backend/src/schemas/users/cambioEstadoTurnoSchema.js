import mongoose from "mongoose";
import {EstadoTurno} from "../../domain/enums/EstadoTurno.js";
import {CambioEstadoTurno} from "../../domain/CambioEstadoTurno.js";

const CambioEstadoTurnoSchema = new mongoose.Schema({

    fechaHoraIngreso: {
        type: Date,
        required: true
    },
    estado: {
        type: String,
        required: true,
        enum: Object.values(EstadoTurno)
            .filter(v => v instanceof EstadoTurno)
            .map(v => v.nombre),
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    motivo: {
        type: String,
        required: true
    },
}, {
    _id: false,
});

CambioEstadoTurnoSchema.loadClass(CambioEstadoTurno);

export { CambioEstadoTurnoSchema };





