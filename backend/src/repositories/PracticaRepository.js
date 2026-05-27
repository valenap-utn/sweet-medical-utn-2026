import {PracticaModel} from "../schemas/coberturas/practicaSchema.js";

export class PracticaRepository {
    constructor() {
        this.model = PracticaModel;
    }

    async create(practica) {
        return await this.model.create(practica);
    }

    async findById(id) {
        return await this.model.findById(id);
    }
}