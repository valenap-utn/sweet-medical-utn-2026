import {PlanModel} from "../schemas/coberturas/planSchema.js";

export class PlanRepository {

    async obtenerTodos() {
        return PlanModel.find().populate("coberturasEspecialidad.especialidad").populate("coberturasPractica.practica").lean();
    }

    async obtenerPorId({id}) {
        return PlanModel.findById(id).populate("coberturasEspecialidad.especialidad").populate("coberturasPractica.practica").lean();
    }

    async guardar({plan}) {
        const doc = new PlanModel({
            nombre: plan.nombre,
            coberturasEspecialidad: plan.coberturasEspecialidad,
            coberturasPractica: plan.coberturasPractica,
        });
        return doc.save();
    }
}
