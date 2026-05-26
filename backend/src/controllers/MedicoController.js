export class MedicoController {
    constructor(medicoService) {
        this.medicoService = medicoService;
    }
    cancelarTurno = async (req,res,next) => {
        try {
            const { medicoId, turnoId } = req.params;
            const { motivo } = req.body;

            const turno = await this.medicoService.cancelarTurno({
                medicoId,
                turnoId,
                motivo
            });

            res.status(200).json(turno);
        } catch (err) {
            next(err);
        }
    }
    marcarTurnoRealizado = async (req, res, next) => {
        try {
            const { medicoId, turnoId } = req.params;

            const turno = await this.medicoService.marcarTurnoRealizado({
                medicoId,
                turnoId
            });

            res.status(200).json(turno);
        } catch (err) {
            next(err);
        }
    };
    obtenerHistorial = async (req, res, next) => {
        try {
            const { pacienteId } = req.params;

            const turnos = await this.medicoService.obtenerHistorial({
                pacienteId
            });

            res.status(200).json(turnos);
        } catch (err) {
            next(err);
        }
    };

    proponerCambioFecha = async (req, res, next) => {
        try {
            const { medicoId, turnoId } = req.params;
            const { nuevaFechaHora } = req.body;

            const turno = await this.medicoService.proponerCambioFecha({
                medicoId,
                turnoId,
                nuevaFechaHora
            });

            res.status(200).json(turno);
        } catch (err) {
            next(err);
        }
    };

    confirmarModificacionFecha = async (req, res, next) => {
        try {
            const { medicoId, turnoId } = req.params;

            const turno = await this.medicoService.confirmarModificacionFecha({
                medicoId,
                turnoId
            });

            res.status(200).json(turno);
        } catch (err) {
            next(err);
        }
    };
}