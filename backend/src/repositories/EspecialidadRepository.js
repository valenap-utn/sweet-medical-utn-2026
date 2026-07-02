import {EspecialidadModel} from "../schemas/coberturas/especialidadSchema.js";

export class EspecialidadRepository {
    constructor() {
        this.model = EspecialidadModel;
    }

    async create(especialidad) {
        return await this.model.create(especialidad);
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

    async save(especialidad) {
        return await especialidad.save();
    }

    async findAll() {
        return await this.model.find({});
    }

    async delete(especialidadId) {
        return this.model.findByIdAndDelete(especialidadId);
    }
}