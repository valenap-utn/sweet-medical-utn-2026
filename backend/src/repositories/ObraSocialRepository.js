import {ObraSocialModel} from "../schemas/obraSocialSchema.js";

export class ObraSocialRepository {
    constructor() {
        this.model = ObraSocialModel;
    }

    async create(obraSocial) {
        return await this.model.create(obraSocial);
    }

    async findById(id) {
        return await this.model
            .findById(id)
            .populate("planes");
    }

    async findAll() {
        return await this.model
            .find({})
            .populate("planes");
    }

    async findByNombre(nombre) {
        return await this.model.findOne({nombre});
    }

    async save(obraSocial) {
        return await obraSocial.save();
    }

    async quitarPlan({obraSocialId, planId}) {
        return this.model.findByIdAndUpdate(
            obraSocialId,
            {
                $pull: {
                    planes: planId
                }
            },
            {new: true, runValidators: true}
        )
            .populate("planes")
    }

    async eliminar({obraSocialId}) {
        return this.model.findByIdAndDelete(obraSocialId);
    }
}
