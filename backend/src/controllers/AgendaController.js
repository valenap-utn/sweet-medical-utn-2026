export class AgendaController {

    constructor({ agendaService }) {
        this.agendaService = agendaService;
    }

    // Endpoint: PUT /api/agenda/medicos/:medicoId/disponibilidad
    actualizarDisponibilidad = async (req, res, next) => {
        try {
            const { medicoId } = req.params;
            const nuevasDisponibilidades = req.body.disponibilidades;

            if (!nuevasDisponibilidades || !Array.isArray(nuevasDisponibilidades)) {
                return res.status(400).json({ error: "Debe enviar un array de disponibilidades." });
            }

            // CORRECCIÓN: Llamamos al método con el nombre exacto que tiene en AgendaService
            const resultado = await this.agendaService.modificarDisponibilidad({
                medicoId,
                nuevasDisponibilidades
            });

            res.status(200).json(resultado);
        } catch (error) {
            // res.status(400).json({ error: error.message });
            next(error);
        }
    }

    // Endpoint: POST /api/agenda/medicos/:medicoId/generar
    generarTurnosManualmente = async (req, res, next) => {
        try {
            const { medicoId } = req.params;
            const { fechaDesde, fechaHasta } = req.body;

            if (!fechaDesde || !fechaHasta) {
                return res.status(400).json({ error: "Debe indicar fechaDesde y fechaHasta." });
            }

            const resultado = await this.agendaService.generarTurnosParaMedico({
                medicoId,
                fechaDesde: new Date(fechaDesde),
                fechaHasta: new Date(fechaHasta)
            });

            res.status(201).json(resultado);
        } catch (error) {
            // res.status(400).json({ error: error.message });
            next(error);
        }
    }
}