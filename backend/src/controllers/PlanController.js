export class PlanController {
    constructor(planService) {
        this.planService = planService;
    }

    crearPlan = async (req, res, next) => {
        try {
            const { nombre, obraSocialId } = req.body;
            const plan = await this.planService.crearPlan(nombre, obraSocialId);
            res.status(201).json(plan);
        } catch (err) {
            next(err);
        }
    }

    obtenerPlanPorId = async (req, res, next) => {
        try {
            const plan = await this.planService.obtenerPlanPorId(req.params.id);
            res.json(plan);
        } catch (err) {
            next(err);
        }
    }

    listarPlanes = async (req, res, next) => {
        try {
            const { obraSocialId } = req.query;
            const planes = await this.planService.listarPlanes(obraSocialId);
            res.json(planes);
        } catch (err) {
            next(err);
        }
    }

    agregarCoberturaEspecialidad = async (req, res, next) => {
        try {
            const { especialidadId, nivel } = req.body;
            const plan = await this.planService.agregarCoberturaEspecialidad(req.params.id, especialidadId, nivel);
            res.json(plan);
        } catch (err) {
            next(err);
        }
    }

    agregarCoberturaPractica = async (req, res, next) => {
        try {
            const { practicaId, nivel } = req.body;
            const plan = await this.planService.agregarCoberturaPractica(req.params.id, practicaId, nivel);
            res.json(plan);
        } catch (err) {
            next(err);
        }
    }

    quitarCoberturaEspecialidad = async (req, res, next) => {
        try {
            const { id, especialidadId } = req.params;
            const plan = await this.planService.quitarCoberturaEspecialidad(id, especialidadId);
            res.json(plan);
        } catch (err) {
            next(err);
        }
    }

    quitarCoberturaPractica = async (req, res, next) => {
        try {
            const { id, practicaId } = req.params;
            const plan = await this.planService.quitarCoberturaPractica(id, practicaId);
            res.json(plan);
        } catch (err) {
            next(err);
        }
    }
}
