export class PlanController {
    constructor({planService}) {
        this.planService = planService;
    }

    crear = async (req, res, next) => {
        try {
            /*console.log("BODY RECIBIDO:", req.body);
            console.log("PLAN SERVICE:", this.planService);*/

            const plan = await this.planService.crear(req.body);
            res.status(201).json(plan);
        } catch (err) {
            next(err);
        }
    }

    obtenerTodos = async (req, res, next) => {
        try {
            const planes = await this.planService.obtenerTodos();
            res.status(200).json({data: planes});
        } catch (e) {
            next(e);
        }
    }

    obtenerPorId = async (req, res, next) => {
        try {
            const {id} = req.params;
            const plan = await this.planService.obtenerPorId({id});
            res.status(200).json({data: plan});
        } catch (e) {
            next(e);
        }
    }

    agregarCoberturaEspecialidad = async (req, res, next) => {
        try {
            const {id} = req.params;
            const {especialidadId, nivel} = req.body;

            const plan = await this.planService.agregarCoberturaEspecialidad({
                planId: id,
                especialidadId,
                nivel
            });

            res.status(200).json({data: plan});
        } catch (e) {
            next(e);
        }
    }

    agregarCoberturaPractica = async (req, res, next) => {
        try {
            const {id} = req.params;
            const {practicaId, nivel} = req.body;

            const plan = await this.planService.agregarCoberturaPractica({
                planId: id,
                practicaId,
                nivel
            });

            res.status(200).json({data: plan});
        } catch (e) {
            next(e);
        }
    }

    quitarCoberturaEspecialidad = async (req, res, next) => {
        try {
            const {id, especialidadId} = req.params;
            const plan = await this.planService.quitarCoberturaEspecialidad({
                planId: id,
                especialidadId
            });
            res.status(200).json({data: plan});
        } catch (err) {
            next(err);
        }
    }

    quitarCoberturaPractica = async (req, res, next) => {
        try {
            const {id, practicaId} = req.params;
            const plan = await this.planService.quitarCoberturaPractica({
                planId: id,
                practicaId
            });
            res.status(200).json({data: plan});
        } catch (e) {
            next(e);
        }
    }

    eliminar = async (req, res, next) => {
        try{
            const {id} = req.params;
            const plan = await this.planService.eliminar(id);
            res.status(200).json({data: plan});
        }catch(err){
            next(err);
        }
    }
}
