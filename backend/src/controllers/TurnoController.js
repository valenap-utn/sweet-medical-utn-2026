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

    buscarDisponibles = async (req, res, next) => {
        try {
            // Esto sería por ej.: /api/turnos/disponibles?pacienteId=1&sedeId=2&tipoServicio=PRACTICA
            const {pacienteId, ...filtros} = req.query

            const resultado = await this.turnoService.buscarDisponibles({
                pacienteId,
                filtros
            });

            res.status(200).json(resultado);
        } catch (err) {
            next(err);
        }
    };

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
