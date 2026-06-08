export class TurnoController {
    constructor(turnoService) {
        this.turnoService = turnoService;
    }

    crearTurno = async (req, res, next) => {
        try {
            const turno = await this.turnoService.crearTurno(req.body);
            res.status(201).json(turno);
        } catch (error) {
            next(error);
        }
    }

    buscarTurnosDisponibles = async (req, res, next) => {
        try {
            const resultado = await this.turnoService.buscarTurnosDisponibles(req.query);
            res.status(200).json(resultado);
        } catch (err) {
            next(err);
        }
    };


    reservarTurno = async (req, res, next) => {
        try {
            const {turnoId} = req.params;

            const turno = await this.turnoService.reservarTurno({
                turnoId: turnoId,
                usuario: req.user,
            });

            res.status(200).json(turno);
        } catch (error) {
            next(error);
        }
    }

    cancelarTurno = async (req, res, next) => {
        try {
            const {turnoId} = req.params;
            const {motivo} = req.body;

            const turno = await this.turnoService.cancelarTurno({
                turnoId: turnoId,
                usuario: req.user,
                motivo: motivo,
            });

            res.status(200).json(turno);
        } catch (error) {
            next(error);
        }
    }

    marcarTurnoRealizado = async (req, res, next) => {
        try{
            const {turnoId} = req.params;
            const turno = await this.turnoService.marcarTurnoRealizado({
                turnoId: turnoId,
                usuario: req.user,
            });
            res.status(200).json(turno);
        }catch(error){
            next(error);
        }
    }

    obtenerCotizacionTurno = async (req, res, next) => {
        try{
            const {turnoId} = req.params;
            const  cotizacion = await this.turnoService.obtenerCotizacionTurno({
                turnoId: turnoId,
                usuario: req.user,
            });
            res.status(200).json(cotizacion);
        }catch(error){
            next(error);
        }
    }

    // ------ Estos los debería mover a otro lado ----------------------------------------------------------------------

    obtenerMedicosDisponibles = async (req, res, next) => {
        try {
            const medicos = await this.turnoService.obtenerMedicosDisponibles(req.query);
            res.status(200).json(medicos);
        } catch (err) {
            next(err);
        }
    }

    obtenerOpcionesServicio = async (req, res, next) => {
        try {
            const opciones = await this.turnoService.obtenerOpcionesServicio(req.query);
            res.status(200).json(opciones);
        } catch (err) {
            next(err);
        }
    }
}
