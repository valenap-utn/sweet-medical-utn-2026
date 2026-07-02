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

    async findOne(nombre, duracionTurnoEnMins, costo) {
        return await this.model.findOne({nombre: nombre, duracionTurnoEnMins: duracionTurnoEnMins, costo: costo});
    }

    async findByIdAndDelete(id) {
        return await this.model.findByIdAndDelete(id);
    }

    async save(practica) {
        return await practica.save();
    }

    async findAll() {
        return await this.model.find({});
    }

    async delete(practicaId) {
        return this.model.findByIdAndDelete(practicaId);
    }
}