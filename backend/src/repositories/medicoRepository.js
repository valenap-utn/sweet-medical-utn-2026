import { MedicoModel } from "../schemas/users/medicoSchema.js";
export class MedicoRepository {
    async findById(id) {
        return await MedicoModel.findById(id)
            .populate("usuario")
            .populate("especialidades")
            .populate("practicas")
            .populate("sedes");
    }
    async findAll(query = {}) {
        return await MedicoModel.find(query)
            .populate("usuario")
            .populate("especialidades")
            .populate("practicas")
            .populate("sedes");
    }
    async save(medicoDoc) {
        const saved = await medicoDoc.save();
        return await this.findById(saved._id);
    }
}
