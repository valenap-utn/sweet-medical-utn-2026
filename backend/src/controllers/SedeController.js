export class SedeController {
    constructor(sedeService) {
        this.sedeService = sedeService;
    }

    create = async (req, res, next) => {
        try {
            const sede = await this.sedeService.create(req.body);
            res.status(201).json(sede);
        } catch (err) {
            next(err);
        }
    }

    delete = async (req, res, next) => {
        try {
            const {sedeId} = req.params;
            const resultado = await this.sedeService.delete(sedeId);
            res.status(200).json(resultado);
        } catch (err) {
            next(err);
        }
    }

    findAll = async (req, res, next) => {
        try{
            const sedes = await this.sedeService.findAll();
            res.status(200).json(sedes);
        }catch(err){
            next(err);
        }
    }
}
