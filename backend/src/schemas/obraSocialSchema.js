import mongoose from "mongoose";
import {ObraSocial} from "../domain/ObraSocial.js";

const ObraSocialSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(value) {
                return value && value.length >= 3;
            },
            message: 'El nombre de la obra social debe tener al menos 3 caracteres.'
        }
    },

}, {
    // Para trazabilidad ( createdAt , updatedAt )
    timestamps: true
})

ObraSocialSchema.loadClass(ObraSocial);

export const ObraSocialModel = mongoose.model('ObraSocial', ObraSocialSchema);
