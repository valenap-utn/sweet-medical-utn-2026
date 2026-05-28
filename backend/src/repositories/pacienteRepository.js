import { PacienteModel } from "../schemas/users/pacienteSchema.js";

export class PacienteRepository {
    async findById(id) {
        return await PacienteModel.findById(id)
            .populate("usuario")
            .populate("obraSocial")
            .populate("plan");
    }

    async findAll(query = {}) {
        return await PacienteModel.find(query)
            .populate("usuario")
            .populate("obraSocial")
            .populate("plan");
    }
}
