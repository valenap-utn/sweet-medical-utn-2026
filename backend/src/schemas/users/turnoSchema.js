import mongoose from "mongoose";
import {CambioEstadoTurnoSchema} from "./cambioEstadoTurnoSchema.js";
import {Turno} from "../../domain/Turno.js";
import {EstadoTurno} from "../../domain/enums/EstadoTurno.js";
import {TipoServicio} from "../../domain/enums/TipoServicio.js";


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
    tipoServicio:{
        type: String,
        enum: Object.values(TipoServicio),
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
    fechaHoraInicio: {
        type: Date,
        required: true
    },
    fechaHoraFin: {
        type: Date,
        required: true
    },
    fechaHoraSolicitada: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
});

TurnoSchema.loadClass(Turno);
export const TurnoModel = mongoose.model("Turno", TurnoSchema);




