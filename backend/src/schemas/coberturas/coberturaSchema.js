import mongoose from "mongoose";
import {Cobertura} from "../../domain/coberturas/Cobertura.js";
import {NivelCobertura} from "../../domain/enums/NivelCobertura.js";

const CoberturaSchema = new mongoose.Schema({
    servicio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Servicio",
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

CoberturaSchema.loadClass(Cobertura);

export const CoberturaModel = mongoose.model("Cobertura", CoberturaSchema);
export { CoberturaSchema };
