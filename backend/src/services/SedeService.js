import {NotFoundError} from "../error/AppError.js";

export class SedeService {
    constructor(sedeRepository) {
        this.sedeRepository = sedeRepository;
    }

    async create(sede) {
        return await this.sedeRepository.create(sede);
    }

    async findById(id) {
        return await this.sedeRepository.findById(id);
    }

    async findAll() {
        return await this.sedeRepository.findAll();
    }

    async delete(sedeId) {
        const sede = this.sedeRepository.findById(sedeId);
        if (!sede) throw new NotFoundError(`No se encontró la sede con id: ${sedeId}`);
        await this.sedeRepository.delete(sedeId);
        return {mensaje: "Sede eliminada correctamente."};
    }
}
