import mongoose from "mongoose";
import {Especialidad} from "../../domain/coberturas/Especialidad.js";


const EspecialidadSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true,
        validate:{
            validator: function(v){
                return v && v.length >= 3;
            },
            message: "El nombre de la especialidad debe tener al menos 3 caracteres."
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

EspecialidadSchema.loadClass(Especialidad);

export const EspecialidadModel = mongoose.model("Especialidad", EspecialidadSchema);
