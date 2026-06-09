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


    consultarDisponibilidadEspecialidad = async (req, res, next) => {
        try {
            const {especialidadId} = req.params;

            const disponibilidad = await this.medicoService.consultarDisponibilidadEspecialidad({
                medicoId: req.user.medicoId,
                especialidadId
            });

            res.status(200).json(disponibilidad);
        } catch (err) {
            next(err);
        }
    };

    consultarDisponibilidadPractica = async (req, res, next) => {
        try {
            const {practicaId} = req.params;

            const disponibilidad = await this.medicoService.consultarDisponibilidadPractica({
                medicoId: req.user.medicoId,
                practicaId
            });

            res.status(200).json(disponibilidad);
        } catch (err) {
            next(err);
        }
    };


    agregarDisponibilidad = async (req, res, next) => {
        try {
            const {disponibilidad} = req.body;

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
            const {disponibilidad} = req.body;

            const medico = await this.medicoService.quitarDisponibilidad({
                medicoId: req.user.medicoId,
                disponibilidad
            });

            res.status(200).json(medico);
        } catch (err) {
            next(err);
        }
    };

    agregarPractica = async (req, res, next) => {
        try {
            const {practicaId} = req.params;

            const medico = await this.medicoService.agregarPractica({
                medicoId: req.user.medicoId,
                practicaId
            });

            res.status(200).json(medico);
        } catch (err) {
            next(err);
        }
    };

    quitarPractica = async (req, res, next) => {
        try {
            const {practicaId} = req.params;

            const medico = await this.medicoService.quitarPractica({
                medicoId: req.user.medicoId,
                practicaId
            });

            res.status(200).json(medico);
        } catch (err) {
            next(err);
        }
    };

    agregarEspecialidad = async (req, res, next) => {
        try {
            const {especialidadId} = req.params;

            const medico = await this.medicoService.agregarEspecialidad({
                medicoId: req.user.medicoId,
                especialidadId
            });

            res.status(200).json(medico);
        } catch (err) {
            next(err);
        }
    };

    quitarEspecialidad = async (req, res, next) => {
        try {
            const {especialidadId} = req.params;

            const medico = await this.medicoService.quitarEspecialidad({
                medicoId: req.user.medicoId,
                especialidadId
            });

            res.status(200).json(medico);
        } catch (err) {
            next(err);
        }
    };
}