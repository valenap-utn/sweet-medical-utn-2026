export class AgendaController {

    constructor(agendaService) {
        this.agendaService = agendaService;
    }

    // Endpoint: POST /api/agenda/medicos/:medicoId/
    generarTurnosManualmente = async (req, res, next) => {
        try {
            const { medicoId } = req.params;

            const resultado = await this.agendaService.generarTurnos({
                medicoId
            });

            res.status(201).json(resultado);
        } catch (error) {
            // res.status(400).json({ error: error.message });
            next(error);
        }
    }

    obtenerAgenda = async (req, res, next) => {
        try {
            const {medicoId} = req.params;

            const agenda = await this.agendaService.obtenerAgenda({medicoId})

            res.status(200).json(agenda);
        } catch (error) {
            next(error);
        }
    }

    borrarAgenda = async (req, res, next) => {
        try {
            const {medicoId} = req.params;

            const resultado = await this.agendaService.borrarAgenda({medicoId});

            res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    }
}