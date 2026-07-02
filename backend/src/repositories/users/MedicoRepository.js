import {MedicoModel} from "../../schemas/users/medicoSchema.js";

export class MedicoRepository {
    constructor() {
        this.model = MedicoModel;
    }

    async create(medico) {
        return await this.model.create(medico);
    }

    async findById(id) {
        return await this.model.findById(id).populate("especialidades").populate("practicas").populate("sedes");
    }

    async findAll() {
        return await this.model.find({})
            .populate("especialidades")
            .populate("practicas")
            .populate("sedes");
    }

    // Agrego este métod0 para poder actualizar al médico
    async save(medico) {
        return await medico.save();
    }

    // Para encontrar medicos por ID de Usuario
    async findByUsuarioId(usuarioId) {
        return await this.model
            .findOne({usuario: usuarioId})
            .populate("usuario");
    }
}