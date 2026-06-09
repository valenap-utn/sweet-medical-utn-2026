export class ObraSocialController {
    constructor(obraSocialService) {
        this.obraSocialService = obraSocialService;
    }

    crear = async (req, res, next) => {
        try {
            const obraSocial = await this.obraSocialService.crear(req.body);

            res.status(201).json(obraSocial);
        } catch (err) {
            next(err);
        }
    }

    obtenerTodas = async (req, res, next) => {
        try {
            const obraSocial = await this.obraSocialService.obtenerTodas();

            res.status(200).json(obraSocial);
        } catch (err) {
            next(err);
        }
    }

    agregarPlan = async (req, res, next) => {
        try {
            const {obraSocialId, planId} = req.params;
            const obraSocial = await this.obraSocialService.agregarPlan({
                obraSocialId,
                planId,
            });

            res.status(200).json(obraSocial);
        } catch (err) {
            next(err);
        }
    }

    obtenerPlanes = async (req, res, next) => {
        try {
            const {obraSocialId} = req.params;
            const planes = await this.obraSocialService.obtenerPlanes({obraSocialId});

            res.status(200).json(planes);
        } catch (err) {
            next(err);
        }
    }
}
