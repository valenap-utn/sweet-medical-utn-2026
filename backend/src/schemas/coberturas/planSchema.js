import mongoose from "mongoose";
import {Plan} from "../../domain/coberturas/Plan.js";
import {CoberturaEspecialidadModel} from "./coberturaEspecialidadSchema.js";
import {CoberturaPracticaModel} from "./coberturaPracticaSchema.js";

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
        type: [CoberturaEspecialidadModel],
        default: []
    },
    coberturasPractica: {
        type: [CoberturaPracticaModel],
        default: []
    }
}, {
    // Para trazabilidad ( createdAt , updatedAt )
    timestamps: true
})

PlanSchema.loadClass(Plan);

export const PlanModel = mongoose.model('Plan', PlanSchema);
