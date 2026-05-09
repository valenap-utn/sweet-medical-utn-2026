import {PlanRepository} from "../repositories/PlanRepository.js";
import {BadRequestError, ConflictError, NotFoundError, UnprocessableEntityError} from "../error/AppError.js";
import {Plan} from "../domain/coberturas/Plan.js";


export class PlanService {
    constructor({ planRepository = new PlanRepository() } = {}) {
        this.planRepository = planRepository;
    }

    // Numero y limite, si no están 1 o 10 respectivamente y si se pada undefined {}
    obtenerTodos({nroPagina = 1, limitePorPagina = 10, filtros = {}} = {}){
        this.validarPaginacion(nroPagina,limitePorPagina);
        this.validarFiltros(filtros);

        const { planes, totalPlanes } = this.planRepository.obtenerPaginados(nroPagina, limitePorPagina, filtros);

        const totalPaginas = totalPlanes === 0 ? 0 : Math.ceil(totalPlanes/limitePorPagina);

        return {
            planes,
            nroPagina,
            limitePorPagina,
            totalPaginas,
            totalPlanes
        }
    }

    obtenerPorId(id){
        this.validarEnteroPositivo(id, "Id");
        const plan = this.planRepository.obtenerPorId(id);
        if(!plan){
            throw new NotFoundError("Plan no encontrado.");
        }
        return plan;
    }

    // Debería agregar obtenerPorEspecialidad/Practica ?

    crear(datosPlan){
        this.validarDatosPlan(datosPlan);
        this.validarNombreDisponible(datosPlan.nombre);

        const plan = new Plan(datosPlan.nombre);

        // Chequeamos si al crearse el Plan hay especialidades o prácticas para agregar
        const coberturasEspecialidad = datosPlan.coberturasEspecialidad ?? [];
        const coberturasPractica = datosPlan.coberturasPractica ?? [];

        // Si hay coberturas => las agregamos al Plan
        coberturasEspecialidad.forEach(coberturaEspecialidad => {
            plan.agregarEspecialidad(coberturaEspecialidad);
        })

        coberturasPractica.forEach(coberturaPractica => {
            plan.agregarPractica(coberturaPractica);
        })

        return this.planRepository.guardar(plan);
    }

    crearVarios(listaPlanes){
        if(!Array.isArray(listaPlanes) || listaPlanes.length === 0){
            throw new BadRequestError("Debe enviar una lista de planes no vacía.");
        }
        const planes = listaPlanes.map((datos) => {
            this.validarDatosPlan(datos);
            this.validarNombreDisponible(datos.nombre);
            return new Plan(datos.nombre);
        })
        return this.planRepository.guardarTodos(planes);
    }

    actualizar(id, datosPlan){
        this.validarEnteroPositivo(id,"Id");
        this.validarDatosPlan(datosPlan);

        const planExistente = this.obtenerPorId(id);
        this.validarNombreDisponible(datosPlan.nombre, id);

        const planActualizado = new Plan(datosPlan.nombre)

        planActualizado.id = planExistente.id;
        return this.planRepository.actualizar(planActualizado);
    }

    eliminar(id){
        this.validarEnteroPositivo(id,"Id");
        const plan = this.obtenerPorId(id);
        return this.planRepository.eliminar(plan);
    }


    // ----- Validaaciones ----- //

    validarDatosPlan(datosPlan){
        if(!datosPlan || typeof datosPlan !== "object" || Array.isArray(datosPlan)){
            throw new BadRequestError("Los datos del plan son inválidos.")
        }

        const {nombre, coberturasEspecialidad, coberturasPractica} = datosPlan;
        if(typeof nombre !== "string" || nombre.trim().length < 3){
            throw new UnprocessableEntityError("El nombre del plan debe tener al menos 3 caracteres.");
        }
        if(!Array.isArray(coberturasEspecialidad)){
            throw new UnprocessableEntityError("Las coberturas de especialidad deben ser una lista.");
        }
        if(!Array.isArray(coberturasPractica)){
            throw new UnprocessableEntityError("Las coberturas de práctica deben ser una lista.");
        }
    }

    validarNombreDisponible(nombre, idActual = null){
        const planExistente = this.planRepository.obtenerPorNombre(nombre);
        const existePlanConMismoNombre = planExistente && planExistente.id !== idActual;
        if(existePlanConMismoNombre){
            throw new ConflictError("Ya existe un plan con el mismo nombre.")
        }
    }

    validarEnteroPositivo(nro, parametro) {
        if(!Number.isInteger(nro) || nro <= 0){
            throw new BadRequestError(`${parametro} debe ser un entero positivo.`);
        }
    }

    validarPaginacion(nroPagina, limitePorPagina) {
        this.validarEnteroPositivo(nroPagina, "Número de página");
        this.validarEnteroPositivo(limitePorPagina, "Límite por página");
    }

    validarFiltros({especialidad, practica} = {}) {
        if(especialidad !== undefined && (typeof especialidad !== "string" || especialidad.trim().length === 0)){
            throw new BadRequestError("La especialidad debe ser una cadena de texto no vacía.")
        }
        if(practica !== undefined && (typeof practica !== "string" || practica.trim().length === 0)){
            throw new BadRequestError("La práctica debe ser una cadena de texto no vacía.")
        }
    }
}
