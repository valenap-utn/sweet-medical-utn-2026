import {PlanModel} from "../schemas/coberturas/planSchema.js";

export class PlanRepository {
    constructor() {
        this.model = PlanModel;
    }

    async obtenerTodos() {
        return this.model.find().populate("coberturas.servicio").lean();
    }

    async obtenerPorId({id}) {
        return this.model.findById(id).populate("coberturas.servicio").lean();
    }

    async guardar({plan}) {
        const doc = new this.model({
            nombre: plan.nombre,
            coberturas: plan.coberturas ?? []
        });
        return doc.save();
    }

    // Coberturas
    async agregarCobertura({planId, servicioId, nivel}) {
        return this.model.findByIdAndUpdate(
            planId,
            {
                $addToSet: {
                    coberturas: {
                        servicio: servicioId,
                        nivel
                    }
                }
            },
            {new: true, runValidators: true}
        )
            .populate("coberturas.servicio")
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

    async quitarCobertura({planId, servicioId}) {
        return this.model.findByIdAndUpdate(
            planId,
            {
                $pull: {
                    coberturas: {
                        servicio: servicioId
                    }
                }
            },
            {new: true, runValidators: true}
        )
            .populate("coberturas.servicio")
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
            .populate("coberturas.servicio")
            // .lean();
    }

    async eliminar({id}) {
        return this.model.findByIdAndDelete(id);
    }
}
