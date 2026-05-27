import mongoose from "mongoose";
import {Practica} from "../../domain/coberturas/Practica.js";

const PracticaSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: true,
        trim: true,
    },
    nombre:{
        type: String,
        required: true,
        trim: true,
        validate:{
            validator: function(v){
                return v && v.length >= 3;
            },
            message: "El nombre de la práctica debe tener al menos 3 caracteres."
        }
    },
    duracionTurnoEnMins: {
        type: Number,
        required: true,
    },
    costo: {
        type: Number,
        required: true,
    }
}, {

    timestamps: true
})

PracticaSchema.loadClass(Practica);

export const PracticaModel = mongoose.model("Practica", PracticaSchema);

