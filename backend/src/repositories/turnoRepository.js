import { TurnoModel } from "../schemas/turnoSchema.js";

export class TurnoRepository {
    async findById(id) {
        return await TurnoModel.findById(id)
            .populate({
                path: "medico",
                populate: [{ path: "usuario" }, { path: "especialidades" }, { path: "practicas" }, { path: "sedes" }]
            })
            .populate({
                path: "paciente",
                populate: [{ path: "usuario" }, { path: "obraSocial" }, { path: "plan" }]
            })
            .populate("sede")
            .populate("especialidad")
            .populate("practica");
    }

    async find(query = {}, sort = {}, limit = 0, skip = 0) {
        let chain = TurnoModel.find(query)
            .populate({
                path: "medico",
                populate: [{ path: "usuario" }, { path: "especialidades" }, { path: "practicas" }, { path: "sedes" }]
            })
            .populate({
                path: "paciente",
                populate: [{ path: "usuario" }, { path: "obraSocial" }, { path: "plan" }]
            })
            .populate("sede")
            .populate("especialidad")
            .populate("practica")
            .sort(sort);

        if (skip > 0) chain = chain.skip(skip);
        if (limit > 0) chain = chain.limit(limit);

        return await chain;
    }

    async count(query = {}) {
        return await TurnoModel.countDocuments(query);
    }

    async save(turnoDoc) {
        const saved = await turnoDoc.save();
        return await this.findById(saved._id);
    }

    async createMany(turnosData) {
        return await TurnoModel.insertMany(turnosData);
    }

    async deleteMany(query) {
        return await TurnoModel.deleteMany(query);
    }
}

