import mongoose from "mongoose";
import { DisponibilidadHoraria } from "../domain/DisponibilidadHoraria.js";
import { DiaSemana } from "../domain/enums/DiaSemana.js";

const DisponibilidadHorariaSchema = new mongoose.Schema({
    diaSemana: {
        type: String,
        required: true,
        enum: Object.values(DiaSemana)
            .filter(v => v instanceof DiaSemana)
            .map(v => v.nombre)
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
    _id: false,
    timestamps: false
})

DisponibilidadHorariaSchema.loadClass(DisponibilidadHoraria);

export { DisponibilidadHorariaSchema };
