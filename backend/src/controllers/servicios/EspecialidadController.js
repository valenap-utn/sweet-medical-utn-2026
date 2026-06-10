
export class EspecialidadController {
    constructor(especialidadService){
        this.especialidadService = especialidadService;
    }

    crear = async (req, res, next) => {
        try{
            const especialidad = await this.especialidadService.crear(req.body);
            res.status(201).json(especialidad);
        }catch(err){
            next(err);
        }
    };

    obtenerTodas = async (req, res, next) => {
        try{
            const especialidades = await this.especialidadService.obtenerTodas();
            res.status(200).json(especialidades);
        }catch(err){
            next(err);
        }
    };

    eliminar = async (req, res, next) => {
        try{
            const {especialidadId} = req.params;
            const resultado = await this.especialidadService.eliminar(especialidadId);

            res.status(200).json(resultado);
        }catch(err){
            next(err);
        }
    }
}
