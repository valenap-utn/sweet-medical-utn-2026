export class PacienteController {
    constructor(pacienteService) {
        this.pacienteService = pacienteService;
    }

    reservarTurno = async (req, res, next) => {
        try {
            const {pacienteId, turnoId} = req.params;
            const turno = await this.pacienteService.reservarTurno({pacienteId, turnoId});
            res.status(200).json(turno);
        } catch (err) {
            next(err);
        }
    };

    cancelarTurno = async (req, res, next) => {
        try {
            const {pacienteId, turnoId} = req.params;
            const {motivo} = req.body;
            const turno = await this.pacienteService.cancelarTurno({pacienteId, turnoId, motivo});
            res.status(200).json(turno);
        } catch (err) {
            next(err);
        }
    };

    obtenerHistorial = async (req, res, next) => {
        try {
            const {pacienteId} = req.params;
            const turnos = await this.pacienteService.obtenerHistorial({pacienteId});
            res.status(200).json(turnos);
        } catch (e) {
            next(e);
        }
    };

    solicitarCambioFecha = async (req, res, next) => {
        try {
            const {pacienteId, turnoId} = req.params;
            const {nuevaFechaHora} = req.body;
            const turno = this.pacienteService.solicitarCambioFecha({pacienteId, turnoId, nuevaFechaHora});
            res.status(200).json(turno);
        } catch (e) {
            next(e);
        }
    }

}
