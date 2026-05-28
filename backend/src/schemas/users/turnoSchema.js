import mongoose from "mongoose";
import { Turno } from "../domain/Turno.js";
import { EstadoTurno } from "../domain/enums/EstadoTurno.js";
import { CambioEstadoTurnoSchema } from "./cambioEstadoTurnoSchema.js";


const TurnoSchema = new mongoose.Schema({

    medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medico",
        required: true
    },
    paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Paciente",
        default: null
    },
    sede: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sede",
        required: true
    },
    especialidad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Especialidad",
        default: null
    },
    practica: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Practica",
        default: null
    },
    estado: {
        type: String,
        enum: Object.values(EstadoTurno)
            .filter(v => v instanceof EstadoTurno)
            .map(v => v.nombre),
        required: true,
    },
    costo: {
        type: Number,
        default: null
    },
    historialEstados: {
        type: [CambioEstadoTurnoSchema],
        default: [],
    },
    fechaHora: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
});

TurnoSchema.loadClass(Turno);
export const TurnoModel = mongoose.model("Turno", TurnoSchema);




