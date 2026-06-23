import mongoose from "mongoose";
import { DisponibilidadHoraria } from "../domain/DisponibilidadHoraria.js";
import { DiaSemana } from "../domain/enums/DiaSemana.js";

const DisponibilidadHorariaSchema = new mongoose.Schema({
    diaSemana: {
        type: String,
        required: true,
        enum: Object.values(DiaSemana)
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
    },
    sede: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sede",
        required: true
    },
    servicio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Servicio",
        required: true
    }
}, {
    _id: false,
    timestamps: false
})

DisponibilidadHorariaSchema.loadClass(DisponibilidadHoraria);

export { DisponibilidadHorariaSchema };
