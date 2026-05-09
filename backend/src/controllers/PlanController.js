import {PlanService} from "../services/PlanService.js";
import {BadRequestError} from "../error/AppError.js";


export class PlanController {
    constructor({planService = new PlanService()} = {}) {
        this.planService = planService;
    }

    findAll = async (req, res, next) => {
        try{
            const paginacion = this.extraerPaginacion(req.query);
            const filtros = this.extraerFiltros(req.query);
            const resultado = this.planService.obtenerTodos({...paginacion, filtros});

            return res.status(200).json({
                status: 'success',
                data: resultado.planes,
                paginacion: {
                    nroPagina: resultado.nroPagina,
                    limitePorPagina: resultado.limitePorPagina,
                    totalPaginas: resultado.totalPaginas,
                    totalPlanes: resultado.totalPlanes
                }
            })

        }catch(err){
            return next(err);
        }
    }

    create = async (req, res, next) => {
        try{
            const datosPlan = this.extraerYValidarBodyPlan(req.body);
            const planCreado = this.planService.crear(datosPlan);
            return res.status(200).json({status: 'success', data: planCreado});
        }catch(err){
            return next(err);
        }
    }

    findById = async (req, res, next) => {
        try{
            const id = this.parsearId(req.params.id);
            const plan = this.planService.obtenerPorId(id);
            return res.status(200).json({status: 'success', data: plan});
        }catch(err){
            return next(err);
        }
    }

    update = async (req, res, next) => {
        try{
            const id = this.parsearId(req.params.id);
            const datosPlan = this.extraerYValidarBodyPlan(req.body);
            const planActualizado = this.planService.actualizar(id, datosPlan);
            return res.status(200).json({status: 'success', data: planActualizado});
        }catch(err){
            return next(err);
        }
    }

    delete = async (req, res, next) => {
        try{
            const id = this.parsearId(req.params.id);
            const planEliminado = this.planService.eliminar(id);
            return res.status(200).json({status: 'success', data: planEliminado});
        }catch(err){
            return next(err);
        }
    }

    // ----- Funciones auxiliares -----

    validarEnteroPositivo(numero,parametro){
        if(!Number.isInteger(numero) || numero <= 0){
            throw new BadRequestError(`El parámetro ${parametro} debe ser un entero positivo.`)
        }
    }

    parsearId(idParam){
        const id = Number(idParam);
        this.validarEnteroPositivo(id,"Id");
        return id;
    }

    extraerYValidarBodyPlan(body){
        if(!body || typeof body !== "object" || Array.isArray(body)){
            throw new BadRequestError(`El body ${body} de la request es inválido.`);
        }
        const camposPermitidos = ["nombre"]

        // TODO: revisar bien estructura del body para agenda

        return {
            nombre: body.nombre,
        }
    }

    extraerFiltros(query){
        //TODO
    }

    extraerPaginacion(query){
        //TODO
    }

    seed = async (req, res, next) => {
        //TODO: Para inicializar con planes ya cargados desde un inicio
    }


}
