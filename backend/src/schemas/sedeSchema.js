import mongoose from "mongoose";
import { Sede } from "../domain/Sede.js";

const SedeSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    direccion: {
        type: String,
        required: true,
        trim: true
    }
}, {
    // Para trazabilidad ( createdAt , updatedAt )
    timestamps: true
})

SedeSchema.loadClass(Sede);

export const SedeModel = mongoose.model("Sede", SedeSchema);