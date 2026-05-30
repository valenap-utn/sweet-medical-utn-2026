import mongoose from "mongoose";
import {CoberturaPractica} from "../../domain/coberturas/CoberturaPractica.js";
import {NivelCobertura} from "../../domain/enums/NivelCobertura.js";

const CoberturaPracticaSchema = new mongoose.Schema({
    practica: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Practica",
        required: true,
    },
    nivel: {
        type: String,
        required: true,
        enum: Object.values(NivelCobertura)
            .filter(v => v instanceof NivelCobertura)
            .map(v => v.nombre)
    }
}, {
    _id: false, // para no generar un 'id' automatico a cada subdocumento del array
});

CoberturaPracticaSchema.loadClass(CoberturaPractica);

export const CoberturaPracticaModel = mongoose.model("CoberturaPractica", CoberturaPracticaSchema);
export { CoberturaPracticaSchema };
