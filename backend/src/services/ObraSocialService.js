import {BadRequestError, ConflictError, NotFoundError} from "../error/AppError.js";

export class ObraSocialService {
    constructor(obraSocialRepository, planRepository) {
        this.obraSocialRepository = obraSocialRepository;
        this.planRepository = planRepository;
    }

    async crear({nombre}) {
        if (!nombre) throw new BadRequestError("Debe indicar el nombre de la obra social.");

        const existente = await this.obraSocialRepository.findByNombre(nombre);
        if (existente) throw new ConflictError(`Ya existe una obra social con el nombre ${nombre}`);

        return await this.obraSocialRepository.create({
            nombre,
            planes: [],
        });
    }

    // Devuelve todas las obras sociales disponibles/creadas
    async obtenerTodas() {
        return await this.obraSocialRepository.findAll();
    }

    async agregarPlan({obraSocialId, planId}) {
        const obraSocial = await this.obraSocialRepository.findById(obraSocialId);
        if (!obraSocial) throw new NotFoundError(`No se encontró la obra social con id: ${obraSocialId}.`);

        const plan = await this.planRepository.findById(planId);
        if (!plan) throw new NotFoundError(`No se encontró el plan con id: ${planId}.`);

        obraSocial.agregarPlan(plan._id);

        return await this.obraSocialRepository.save(obraSocial);
    }

    // Devuelve los planes que pertenecen a una obra social específica
    async obtenerPlanes({obraSocialId}) {
        const obraSocial = await this.obraSocialRepository.findById(obraSocialId);
        if (!obraSocial) throw new NotFoundError(`No se encontró la obra social con id: ${obraSocialId}.`);

        return obraSocial.planes;
    }

    async quitarPlan({obraSocialId, planId}) {
        const obraSocial = await this.obraSocialRepository.findById(obraSocialId);
        if (!obraSocial) throw new NotFoundError(`No se encontró la obra social con id: ${obraSocialId}.`);

        const plan = await this.planRepository.findById(planId);
        if (!plan) throw new NotFoundError(`No se encontró el plan con id: ${planId}.`);

        return this.obraSocialRepository.quitarPlan({obraSocialId, planId});
    }

    async eliminar({obraSocialId}) {
        const obraSocial = await this.obraSocialRepository.eliminar(obraSocialId);
        if (!obraSocial) throw new NotFoundError(`No se encontró la obra social con id: ${obraSocialId}.`);
        return obraSocial;
    }

}
