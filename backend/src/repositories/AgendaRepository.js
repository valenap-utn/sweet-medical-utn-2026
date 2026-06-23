import { AgendaModel } from "../schemas/agendaSchema.js";

export class AgendaRepository {
    constructor() {
        this.model = AgendaModel;
    }


    async create(agenda) {
        return await this.model.create(agenda);
    }

    async save(agenda) {
        return await agenda.save();
    }

    async findById(id) {
        return await this.model
            .findById(id)
            .populate("medico")
            .populate("turnos");
    }

    async findByMedicoId(medicoId) {
        return await this.model
            .findOne({ medico: medicoId })
            .populate({
                path: "medico",
                populate: [
                    {path: "disponibilidades.servicio"},
                    {path: "disponibilidades.sede"}
                ]
            })
            .populate({
                path: "turnos",
                populate: [
                    { path: "paciente" },
                    { path: "servicio" },
                    { path: "sede" }
                ]
            });
    }

    async delete(agenda) {
        return await agenda.deleteOne();
    }

    async deleteById(id) {
        return await this.model.findByIdAndDelete(id);
    }
}