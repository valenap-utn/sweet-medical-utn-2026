import mongoose from "mongoose";
import {Plan} from "../../domain/coberturas/Plan.js";
import {CoberturaEspecialidadSchema} from "./coberturaEspecialidadSchema.js";
import {CoberturaPracticaSchema} from "./coberturaPracticaSchema.js";

const PlanSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (value) {
                return value && value.length >= 3;
            },
            message: 'El plan necesita un nombre con al menos 3 caracteres.'
        }
    },
    coberturasEspecialidad: {
        type: [CoberturaEspecialidadSchema],
        default: []
    },
    coberturasPractica: {
        type: [CoberturaPracticaSchema],
        default: []
    }
}, {
    // Para trazabilidad ( createdAt , updatedAt )
    timestamps: true
})

PlanSchema.loadClass(Plan);

export const PlanModel = mongoose.model('Plan', PlanSchema);
