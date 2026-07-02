import {PlanModel} from "../schemas/coberturas/planSchema.js";

export class PlanRepository {
    constructor() {
        this.model = PlanModel;
    }

    async obtenerTodos() {
        return this.model.find().populate("coberturasEspecialidad.especialidad").populate("coberturasPractica.practica").lean();
    }

    async obtenerPorId({id}) {
        return this.model.findById(id).populate("coberturasEspecialidad.especialidad").populate("coberturasPractica.practica").lean();
    }

    async guardar({plan}) {
        const doc = new this.model({
            nombre: plan.nombre,
            coberturasEspecialidad: plan.coberturasEspecialidad ?? [],
            coberturasPractica: plan.coberturasPractica ?? [],
        });
        return doc.save();
    }

    // Coberturas
    async agregarCoberturaEspecialidad({planId, especialidadId, nivel}) {
        return this.model.findByIdAndUpdate(
            planId,
            {
                $addToSet: {
                    coberturasEspecialidad: {
                        especialidad: especialidadId,
                        nivel
                    }
                }
            },
            {new: true, runValidators: true}
        )
            .populate("coberturasEspecialidad.especialidad")
            .populate("coberturasPractica.practica")
            // .lean();
    }

    async agregarCoberturaPractica({planId, practicaId, nivel}) {
        return this.model.findByIdAndUpdate(
            planId,
            {
                $addToSet: {
                    coberturasPractica: {
                        practica: practicaId,
                        nivel
                    }
                }
            },
            {new: true, runValidators: true}
        )
            .populate("coberturasEspecialidad.especialidad")
            .populate("coberturasPractica.practica")
            // .lean();
    }

    async quitarCoberturaEspecialidad({planId, especialidadId}) {
        return this.model.findByIdAndUpdate(
            planId,
            {
                $pull: {
                    coberturasEspecialidad: {
                        especialidad: especialidadId
                    }
                }
            },
            {new: true, runValidators: true}
        )
            .populate("coberturasEspecialidad.especialidad")
            .populate("coberturasPractica.practica")
            // .lean();
    }

    async quitarCoberturaPractica({planId, practicaId}) {
        return this.model.findByIdAndUpdate(
            planId,
            {
                $pull: {
                    coberturasPractica: {
                        practica: practicaId
                    }
                }
            },
            {new: true, runValidators: true}
        )
            .populate("coberturasEspecialidad.especialidad")
            .populate("coberturasPractica.practica")
            // .lean();
    }

    async findByNombre(nombre){
        return await this.model.findOne({nombre});
    }

    async findById(id){
        return await this.model
            .findById(id)
            .populate("coberturasEspecialidad.especialidad")
            .populate("coberturasPractica.practica")
            // .lean();
    }

    async eliminar({id}) {
        return this.model.findByIdAndDelete(id);
    }
}
