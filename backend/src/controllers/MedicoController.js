export class MedicoController {
    constructor(medicoService) {
        this.medicoService = medicoService;
    }


    obtenerHistorial = async (req, res, next) => {
        try {
            const {pacienteId} = req.params;

            const turnos = await this.medicoService.obtenerHistorial({
                pacienteId
            });

            res.status(200).json(turnos);
        } catch (err) {
            next(err);
        }
    };

    obtenerAgenda = async (req, res, next) => {
        try {
            const agenda = await this.medicoService.obtenerAgenda({medicoId: req.user.medicoId});

            res.status(200).json(agenda);
        } catch (err) {
            next(err);
        }
    };


    consultarDisponibilidad = async (req, res, next) => {
        try {
            const {servicioId} = req.params;

            const disponibilidad = await this.medicoService.consultarDisponibilidad({
                medicoId: req.user.medicoId,
                servicioId
            });

            res.status(200).json(disponibilidad);
        } catch (err) {
            next(err);
        }
    };

    obtenerDisponibilidades = async (req, res, next) => {
        try {
            const disponibilidades = await this.medicoService.obtenerDisponibilidades({
                medicoId: req.user.medicoId,
            })
            res.status(200).json(disponibilidades);
        } catch (err) {
            next(err);
        }
    };

    agregarDisponibilidad = async (req, res, next) => {
        try {
            const disponibilidad = req.body;

            const medico = await this.medicoService.agregarDisponibilidad({
                medicoId: req.user.medicoId,
                disponibilidad
            });

            res.status(200).json(medico);
        } catch (err) {
            next(err);
        }
    };

    quitarDisponibilidad = async (req, res, next) => {
        try {
            const disponibilidad = req.body;

            const medico = await this.medicoService.quitarDisponibilidad({
                medicoId: req.user.medicoId,
                disponibilidad
            });

            res.status(200).json(medico);
        } catch (err) {
            next(err);
        }
    };

    agregarServicio = async (req, res, next) => {
        try {
            const {servicioId} = req.params;

            const medico = await this.medicoService.agregarServicio({
                medicoId: req.user.medicoId,
                servicioId
            });

            res.status(200).json(medico);
        } catch (err) {
            next(err);
        }
    };

    quitarServicio = async (req, res, next) => {
        try {
            const {servicioId} = req.params;

            const medico = await this.medicoService.quitarServicio({
                medicoId: req.user.medicoId,
                servicioId
            });

            res.status(200).json(medico);
        } catch (err) {
            next(err);
        }
    };

}