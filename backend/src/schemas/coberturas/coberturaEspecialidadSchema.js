import mongoose from "mongoose";
import {NivelCobertura} from "../../domain/enums/NivelCobertura.js";
import {CoberturaEspecialidad} from "../../domain/coberturas/CoberturaEspecialidad.js";


const CoberturaEspecialidadSchema = new mongoose.Schema({
    especialidad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Especialidad",
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

CoberturaEspecialidadSchema.loadClass(CoberturaEspecialidad);

export { CoberturaEspecialidadSchema };

