import mongoose from "mongoose";
import { Medico } from "../../domain/users/Medico.js";
import {DisponibilidadHorariaSchema} from "../disponibilidadHorariaSchema.js";

const MedicoSchema = new mongoose.Schema({

    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    matricula: {
        type: String,
        required: true,
        trim: true
    },
    especialidades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Especialidad"
    }],
    practicas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Practica"
    }],
    sedes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sede"
    }],
    disponibilidades: [DisponibilidadHorariaSchema]
}, {
    // Para trazabilidad ( createdAt , updatedAt )
    timestamps: true

})
// Cargamos el esquema 'Medico' (mongoose) a la entidad 'Medico' (nuestro dominio)
MedicoSchema.loadClass(Medico);

// Exportamos el modelo mongoose que se usará correspondiente al esquema
export const MedicoModel = mongoose.model("Medico", MedicoSchema);