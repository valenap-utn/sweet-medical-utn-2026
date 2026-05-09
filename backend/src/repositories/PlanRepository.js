import {BadRequestError, NotFoundError, UnprocessableEntityError} from "../error/AppError.js";
import {Plan} from "../domain/coberturas/Plan.js";


export class PlanRepository {
    constructor() {
        this.planes = {};
        this.nextId = 1;
    }

    // (C)reate
    guardar(plan){
        this.validarPlan(plan);
        const id = plan.id ?? this.nextId++;
        plan.id = id;
        this.planes[id] = plan;
        return plan;
    }

    guardarTodos(planes){
        if(!Array.isArray(planes)){
            throw new BadRequestError("Debe enviar una lista de planes.");
        }
        return planes.map((plan)=> this.guardar(plan));
    }

    // (D)elete
    eliminar(id){
        this.validarId(id);
        const planAEliminar = this.planes[id];
        if(!planAEliminar){
            throw new NotFoundError("El id no pertenece a un plan.");
        }
        delete this.planes[id];
        return planAEliminar;
    }

    // (R)ead
    obtenerPorId(id){
        this.validarId(id);
        const plan = this.planes[id] ?? null;
        if(!plan){
            return null;
        }
        return plan;
    }

    obtenerPorNombre(nombre){
        this.validarNombre(nombre);
        const nombreNormalizado = nombre.trim().toLowerCase();

        return (
            Object.values(this.planes).find((plan)=>{
                return plan.nombre.trim().toLowerCase() === nombreNormalizado;
            }) ?? null
        )
    }

    obtenerTodos(){
        return Object.values(this.planes);
    }

    // Devuelve los planes que cubren la especialidad indicada
    obtenerPorEspecialidad(nombreEspecialidad){
        const nombreNormalizado = nombreEspecialidad.trim().toLowerCase();
        return Object.values(this.planes).filter(plan =>
            plan.coberturasEspecialidad.some(
                cobertura => cobertura.especialidad.nombre.trim().toLowerCase() === nombreNormalizado
            )
        );
    }

    // Devuelve los planes que cubren la práctica indicada
    obtenerPorPractica(nombrePractica){
        const nombreNormalizado = nombrePractica.trim().toLowerCase();
        return Object.values(this.planes).filter(plan =>
            plan.coberturasPractica.some(
                cobertura => cobertura.practica.nombre.trim().toLowerCase() === nombreNormalizado
            )
        );
    }

    obtenerPaginados(nroPagina, limitePorPagina, filtros = {}){
        let planes = this.obtenerTodos();

        // Estos filtros NO SON acumulativos
        if(filtros.especialidad !== undefined){
            const especialidadNormalizada = filtros.especialidad.trim().toLowerCase();
            planes = this.obtenerPorEspecialidad(especialidadNormalizada);
        }
        if(filtros.practica !== undefined){
            const practicaNormalizada = filtros.practica.trim().toLowerCase();
            planes = this.obtenerPorPractica(practicaNormalizada);
        }

        const inicio = (nroPagina - 1) * limitePorPagina;
        const fin = inicio + limitePorPagina;

        return {
            planes: planes.slice(inicio, fin),
            totalPlanes: planes.length
        }
    }

    // (U)pdate ---- PUT
    actualizar(id, planActualizado){
        this.validarId(id);
        this.validarPlan(planActualizado);

        const planExistente = this.obtenerPorId(id);

        if(!planExistente){
            throw new NotFoundError("El plan no existe.");
        }

        planActualizado.id = id;
        this.planes[id] = planActualizado;
        return planActualizado;
    }

    // ----- Validaciones ----- //

    validarPlan(plan){
        if(!(plan instanceof Plan)){
            throw new UnprocessableEntityError("El plan es inválido");
        }
    }

    validarId(id){
        if(!Number.isInteger(id) || id <= 0){
            throw new BadRequestError("El id no es válido.");
        }
    }

    validarNombre(nombre){
        if(typeof nombre !== "string" || nombre.trim().length === 0){
            throw new BadRequestError("El nombre del plan es obligatorio.");
        }
    }
}
