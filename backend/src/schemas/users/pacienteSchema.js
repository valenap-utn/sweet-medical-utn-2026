import mongoose from "mongoose";
import {Paciente} from "../../domain/users/Paciente.js";

const PacienteSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    dni:{
        type: String,
        required: true,
        trim: true,
    },
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    obraSocial: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ObraSocial",
        required: true // o puede ser false ?
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        required: true
    }
}, {
    // Para trazabilidad ( createdAt , updatedAt )
    timestamps: true
})

// Cargamos el esquema 'Paciente' (mongoose) a la entidad 'Paciente' (nuestro dominio)
PacienteSchema.loadClass(Paciente);

// Exportamos el modelo mongoose que se usará correspondiente al esquema
export const PacienteModel = mongoose.model("Paciente", PacienteSchema);
