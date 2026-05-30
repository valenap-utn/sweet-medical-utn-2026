export class PlanController {
    constructor(planService) {
        this.planService = planService;
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
}
