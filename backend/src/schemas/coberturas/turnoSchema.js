import mongoose from "mongoose";
import { Turno } from "../domain/Turno.js";
import { EstadoTurno } from "../domain/enums/EstadoTurno.js";

const CambioEstadoTurnoSchema = new mongoose.Schema({
    fechaHoraIngreso: {
        type: String, // We can store LocalDateTime as string
        required: true
    },
    estado: {
        type: String,
        required: true
    },
    turno: {
        type: String,
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    motivo: {
        type: String,
        default: ""
    }
}, {
    _id: false
});

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
    fechaHora: {
        type: Date,
        required: true
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
        required: true,
        enum: Object.values(EstadoTurno)
            .filter(v => v instanceof EstadoTurno)
            .map(v => v.nombre)
    },
    costo: {
        type: Number,
        required: true
    },
    historialEstados: {
        type: [CambioEstadoTurnoSchema],
        default: []
    }
}, {
    timestamps: true
});

// Post-init hook to map either populated especialidad or practica to the domain's 'practica' field.
TurnoSchema.post('init', function(doc) {
    doc.practica = doc.practica || doc.especialidad;
    // Map string state to EstadoTurno object if it is a string
    if (typeof doc.estado === 'string') {
        const found = Object.values(EstadoTurno)
            .filter(v => v instanceof EstadoTurno)
            .find(v => v.nombre.toUpperCase() === doc.estado.toUpperCase());
        if (found) {
            doc.estado = found;
        }
    }
});

TurnoSchema.loadClass(Turno);

export const TurnoModel = mongoose.model("Turno", TurnoSchema);
