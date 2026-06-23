import {ServicioModel} from "../schemas/coberturas/servicioSchema.js";

export class ServicioRepository {
    constructor() {
        this.model = ServicioModel;
    }

    async create(servicio) {
        return await this.model.create(servicio);
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async findAll() {
        return await this.model.find({});
    }

    async findOne(nombre, duracionTurnoEnMins, costo) {
        return await this.model.findOne({nombre: nombre, duracionTurnoEnMins: duracionTurnoEnMins, costo: costo});
    }

    async save(servicio) {
        return await servicio.save();
    }

    async delete(servicioId) {
        return this.model.findByIdAndDelete(servicioId);
    }
}