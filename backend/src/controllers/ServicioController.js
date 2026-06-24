export class ServicioController {
    constructor(servicioService) {
        this.servicioService = servicioService;
    }

    crear = async (req, res, next) => {
        try {
            const servicio = await this.servicioService.crear(req.body);
            res.status(201).json(servicio);
        } catch (err) {
            next(err);
        }
    }

    obtenerTodos = async (req, res, next) => {
        try {
            const servicios = await this.servicioService.obtenerTodos();
            res.status(200).json(servicios);
        } catch (err) {
            next(err);
        }
    }
    
    modificar = async  (req, res, next) => {
        try {
            const {servicioId} = req.params;
            const servicio = await this.servicioService.modificar(servicioId, req.body);
            res.status(200).json(servicio);
        } catch (err) {
            next(err);
        }
    }

    eliminar = async (req, res, next) => {
        try{
            const {servicioId} = req.params;
            const resultado = await this.servicioService.eliminar(servicioId);
            res.status(200).json(resultado);
        }catch(err){
            next(err);
        }
    }
}
