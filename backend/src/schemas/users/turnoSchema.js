import mongoose from "mongoose";
import {CambioEstadoTurnoSchema} from "./cambioEstadoTurnoSchema.js";
import {Turno} from "../../domain/Turno.js";
import {EstadoTurno} from "../../domain/enums/EstadoTurno.js";
import { toZonedTime, format } from 'date-fns-tz';

const tz = 'America/Argentina/Buenos_Aires';

const formatearFecha = (fecha) => {
    if (!fecha) return null;
    return format(toZonedTime(fecha, tz), "yyyy-MM-dd'T'HH:mm:ss");
};


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
    servicio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Servicio",
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

// Pasamos las fechas y horas a el horario argentino
TurnoSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.fechaHoraInicio = formatearFecha(ret.fechaHoraInicio);
        ret.fechaHoraFin = formatearFecha(ret.fechaHoraFin);
        ret.fechaHoraSolicitada = formatearFecha(ret.fechaHoraSolicitada);
        return ret;
    }
});

TurnoSchema.loadClass(Turno);
export const TurnoModel = mongoose.model("Turno", TurnoSchema);




