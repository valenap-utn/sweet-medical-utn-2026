import { ObraSocialModel } from "../schemas/obraSocialSchema.js";
import { EspecialidadModel } from "../schemas/coberturas/especialidadSchema.js";
import { PracticaModel } from "../schemas/coberturas/practicaSchema.js";

export class PlanService {
    constructor({planRepository}) {
        this.planRepository = planRepository;
    }

    async crearPlan(nombre, obraSocialId) {
        if (obraSocialId) {
            const os = await ObraSocialModel.findById(obraSocialId);
            if (!os) {
                throw new Error("Obra Social no encontrada.");
            }
        }
        return await this.planRepository.create(nombre, obraSocialId);
    }

    async obtenerPlanPorId(id) {
        const plan = await this.planRepository.findById(id);
        if (!plan) {
            throw new Error("Plan no encontrado.");
        }
        return plan;
    }

    async listarPlanes(obraSocialId) {
        if (obraSocialId) {
            const os = await ObraSocialModel.findById(obraSocialId);
            if (!os) {
                return [];
            }
            return await this.planRepository.findAll({ _id: { $in: os.planes } });
        }
        return await this.planRepository.findAll({});
    }

    async agregarCoberturaEspecialidad(planId, especialidadId, nivel) {
        const plan = await this.obtenerPlanPorId(planId);
        const especialidad = await EspecialidadModel.findById(especialidadId);
        if (!especialidad) {
            throw new Error("Especialidad no encontrada.");
        }

        // Remover si ya existe para evitar duplicados
        plan.coberturasEspecialidad = plan.coberturasEspecialidad.filter(
            c => c.especialidad.toString() !== especialidadId.toString()
        );
        plan.coberturasEspecialidad.push({ especialidad: especialidadId, nivel });
        return await this.planRepository.save(plan);
    }

    async agregarCoberturaPractica(planId, practicaId, nivel) {
        const plan = await this.obtenerPlanPorId(planId);
        const practica = await PracticaModel.findById(practicaId);
        if (!practica) {
            throw new Error("Práctica no encontrada.");
        }

        // Remover si ya existe
        plan.coberturasPractica = plan.coberturasPractica.filter(
            c => c.practica.toString() !== practicaId.toString()
        );
        plan.coberturasPractica.push({ practica: practicaId, nivel });
        return await this.planRepository.save(plan);
    }

    async quitarCoberturaEspecialidad(planId, especialidadId) {
        const plan = await this.obtenerPlanPorId(planId);
        plan.coberturasEspecialidad = plan.coberturasEspecialidad.filter(
            c => c.especialidad.toString() !== especialidadId.toString()
        );
        return await this.planRepository.save(plan);
    }

    async quitarCoberturaPractica(planId, practicaId) {
        const plan = await this.obtenerPlanPorId(planId);
        plan.coberturasPractica = plan.coberturasPractica.filter(
            c => c.practica.toString() !== practicaId.toString()
        );
        return await this.planRepository.save(plan);
    }
}
