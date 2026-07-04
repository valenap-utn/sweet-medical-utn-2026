import {BadRequestError, ConflictError, NotFoundError} from "../error/AppError.js";
import {NivelCobertura} from "../domain/enums/NivelCobertura.js";

export class PlanService {
    constructor({planRepository}) {
        this.planRepository = planRepository;
    }

    async crear({nombre, coberturasEspecialidad = [], coberturasPractica = []}) {
        if (!nombre) throw new BadRequestError("El nombre del plan es obligatorio");

        const existente = this.planRepository.findByNombre(nombre);
        if (existente) throw new ConflictError(`Ya existe un plan con nombre ${nombre}.`)

        const plan = {
            nombre,
            coberturasEspecialidad,
            coberturasPractica,
        };

        return this.planRepository.guardar({plan});
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

    // Coberturas

    async agregarCoberturaEspecialidad({planId, especialidadId, nivel}) {
        this.validarNivelCobertura(nivel)

        if (!especialidadId) throw new BadRequestError("La especialidad es obligatoria.");

        const plan = await this.planRepository.agregarCoberturaEspecialidad({
            planId,
            especialidadId,
            nivel
        });
        if (!plan) throw new NotFoundError(`No se encontró un plan con id: ${planId}`);

        return plan;
    }

    async agregarCoberturaPractica({planId, practicaId, nivel}) {
        this.validarNivelCobertura(nivel)

        if (!practicaId) throw new BadRequestError("La práctica es obligatoria.");

        const plan = await this.planRepository.agregarCoberturaPractica({
            planId,
            practicaId,
            nivel
        });
        if (!plan) throw new NotFoundError(`No se encontró un plan con id: ${planId}`);

        return plan;
    }

    async quitarCoberturaEspecialidad({planId, especialidadId}) {
        if (!especialidadId) throw new BadRequestError("La especialidad es obligatoria.");

        const plan = await this.planRepository.quitarCoberturaEspecialidad({
            planId,
            especialidadId
        });
        if (!plan) throw new NotFoundError(`No se encontró un plan con id: ${planId}`);

        return plan;
    }

    async quitarCoberturaPractica({planId, practicaId}) {
        if (!practicaId) throw new BadRequestError("La práctica es obligatoria.");

        const plan = await this.planRepository.quitarCoberturaPractica({
            planId,
            practicaId
        });
        if (!plan) throw new NotFoundError(`No se encontró un plan con id: ${planId}`);

        return plan;
    }

    async eliminar({id}) {
        const plan = await this.planRepository.eliminar(id);
        if(!plan) throw new NotFoundError(`No se encontró el plan con id: ${id}.`);
        return plan;
    }

    // Validaciones
    validarNivelCobertura(nivel) {
        const nivelesValidos = Object.values(NivelCobertura).map(n => n.toString());
        if (!nivel || !nivelesValidos.includes(nivel)) throw new BadRequestError(`Nivel de cobertura inválido. Valores permitidos: ${nivelesValidos.join(', ')}`);
    }
}
