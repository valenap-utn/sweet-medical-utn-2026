import { PlanModel } from "../schemas/coberturas/planSchema.js";
import { ObraSocialModel } from "../schemas/obraSocialSchema.js";

export class PlanRepository {
    async create(nombre, obraSocialId) {
        // Mongoose validation will run here
        const planDoc = new PlanModel({ nombre });
        const savedPlan = await planDoc.save();

        if (obraSocialId) {
            await ObraSocialModel.findByIdAndUpdate(obraSocialId, {
                $push: { planes: savedPlan._id }
            });
        }
        return savedPlan;
    }

    async findById(id) {
        return await PlanModel.findById(id);
    }

    async findAll(query = {}) {
        return await PlanModel.find(query);
    }

    async save(planDoc) {
        return await planDoc.save();
    }
}
