import mongoose from "mongoose";
import {Servicio} from "../../domain/coberturas/Servicio.js";
import {TipoServicio} from "../../domain/enums/TipoServicio.js";

const ServicioSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: false,
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
    tipoServicio:{
        type: String,
        enum: Object.values(TipoServicio),
        required: true
    },
    duracionTurnoEnMins: {
        type: Number,
        required: true
    },
    costo: {
        type: Number,
        required: true
    },
}, {

    timestamps: true
})

ServicioSchema.loadClass(Servicio);

export const ServicioModel = mongoose.model("Servicio", ServicioSchema);

