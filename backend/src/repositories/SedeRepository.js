import {SedeModel} from "../schemas/sedeSchema.js";

export class SedeRepository {
    constructor() {
        this.model = SedeModel;
    }

    async create(sede) {
        return await this.model.create(sede);
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async findAll() {
        return this.model.find({});
    }

    async delete(sedeId) {
        return this.model.findByIdAndDelete(sedeId);
    }
}