import {NotFoundError} from "../error/AppError.js";

export class PlanService {
    constructor({planRepository}) {
        this.planRepository = planRepository;
    }

    async obtenerTodos() {
        return this.planRepository.obtenerTodos();
    }

    async obtenerPorId({id}) {
        const plan = await this.planRepository.obtenerPorId({id});
        if (!plan) {
            throw new NotFoundError(`Plan con id "${id}" no encontrado.`);
        }
        return plan;
    }
}
