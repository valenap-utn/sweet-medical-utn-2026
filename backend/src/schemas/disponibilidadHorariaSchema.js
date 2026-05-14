import mongoose from "mongoose";
import { DisponibilidadHoraria } from "../domain/DisponibilidadHoraria.js";

const DisponibilidadHorariaSchema = new mongoose.Schema({
    diaSemana: {
        type: String,
        required: true,
        trim: true
    },
    horaDesde: {
        type: String,
        required: true,
        trim: true
    },
    horaHasta: {
        type: String,
        required: true,
        trim: true
    }
}, {
    // Para trazabilidad ( createdAt , updatedAt )
    timestamps: true
})

DisponibilidadHorariaSchema.loadClass(DisponibilidadHoraria);

export const DisponibilidadHorariaModel = mongoose.model("DisponibilidadHoraria", DisponibilidadHorariaSchema);
