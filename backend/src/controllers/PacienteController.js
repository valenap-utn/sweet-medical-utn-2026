export class PacienteController {
    constructor(pacienteService) {
        this.pacienteService = pacienteService;
    }

    obtenerHistorial = async (req, res, next) => {
        try {
            const turnos = await this.pacienteService.obtenerHistorial({
                pacienteId: req.user.pacienteId,
            });
            res.status(200).json(turnos);
        } catch (e) {
            next(e);
        }
    };

}
