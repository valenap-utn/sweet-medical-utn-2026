export class AdminController {
    constructor(turnosBatchService, agendaService) {
        this.turnosBatchService = turnosBatchService;
        this.agendaService = agendaService;
    }

    ejecutarBatchTurnos = async (req, res, next) => {
        try {
            await this.turnosBatchService.ejecutarGeneracion();

            res.status(200).json({
                mensaje: "Batch de generación de turnos ejecutado correctamente."
            });
        } catch (err) {
            next(err);
        }
    }

    regenerarAgendaMedico = async (req, res, next) => {
        try{
            const {medicoId} = req.params;
            const resultado = await this.agendaService.regenerarAgenda({
                medicoId,
            })

            res.status(200).json(resultado);
        }catch(err){
            next(err);
        }
    }

}

