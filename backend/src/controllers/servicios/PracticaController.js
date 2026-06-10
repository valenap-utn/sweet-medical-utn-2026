export class PracticaController {
    constructor(practicaService) {
        this.practicaService = practicaService;
    }

    crear = async (req, res, next) => {
        try {
            const practica = await this.practicaService.crear(req.body);
            res.status(201).json(practica);
        } catch (err) {
            next(err);
        }
    }

    obtenerTodas = async (req, res, next) => {
        try {
            const practicas = await this.practicaService.obtenerTodas();
            res.status(200).json(practicas);
        } catch (err) {
            next(err);
        }
    }

    eliminar = async (req, res, next) => {
        try{
            const {practicaId} = req.params;
            const resultado = await this.practicaService.eliminar(practicaId);
            res.status(200).json(resultado);
        }catch(err){
            next(err);
        }
    }
}
