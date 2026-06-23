import mongoose from "mongoose";
import {Agenda} from "../domain/Agenda.js";

const AgendaSchema = new mongoose.Schema({
        medico: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Medico",
            required: true,
            unique: true
        },

        turnos: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Turno"
        }]
    },
    {
        timestamps: true
    }
);

AgendaSchema.loadClass(Agenda)

export const AgendaModel = mongoose.model("Agenda", AgendaSchema);