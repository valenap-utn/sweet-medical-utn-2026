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
            const {medicoId, especialidadId} = req.params;

            const disponibilidad = await this.medicoService.consultarDisponibilidadEspecialidad({
                medicoId,
                especialidadId
            });

            res.status(200).json(disponibilidad);
        } catch (err) {
            next(err);
        }
    };

    consultarDisponibilidadPractica = async (req, res, next) => {
        try {
            const {medicoId, practicaId} = req.params;

            const disponibilidad = await this.medicoService.consultarDisponibilidadPractica({
                medicoId,
                practicaId
            });

            res.status(200).json(disponibilidad);
        } catch (err) {
            next(err);
        }
    };



    agregarDisponibilidad = async (req, res, next) => {
        try {
            const {medicoId} = req.params;
            const {disponibilidad} = req.body;

            const medico = await this.medicoService.agregarDisponibilidad({
                medicoId,
                disponibilidad
            });

            res.status(200).json(medico);
        } catch (err) {
            next(err);
        }
    };

    quitarDisponibilidad = async (req, res, next) => {
        try {
            const {medicoId} = req.params;
            const {disponibilidad} = req.body;

            const medico = await this.medicoService.quitarDisponibilidad({
                medicoId,
                disponibilidad
            });

            res.status(200).json(medico);
        } catch (err) {
            next(err);
        }
    };

    agregarPractica = async (req, res, next) => {
        try {
            const {medicoId, practicaId} = req.params;

            const medico = await this.medicoService.agregarPractica({
                medicoId,
                practicaId
            });

            res.status(200).json(medico);
        } catch (err) {
            next(err);
        }
    };

    quitarPractica = async (req, res, next) => {
        try {
            const {medicoId, practicaId} = req.params;

            const medico = await this.medicoService.quitarPractica({
                medicoId,
                practicaId
            });

            res.status(200).json(medico);
        } catch (err) {
            next(err);
        }
    };

    agregarEspecialidad = async (req, res, next) => {
        try {
            const {medicoId, especialidadId} = req.params;

            const medico = await this.medicoService.agregarEspecialidad({
                medicoId,
                especialidadId
            });

            res.status(200).json(medico);
        } catch (err) {
            next(err);
        }
    };

    quitarEspecialidad = async (req, res, next) => {
        try {
            const {medicoId, especialidadId} = req.params;

            const medico = await this.medicoService.quitarEspecialidad({
                medicoId,
                especialidadId
            });

            res.status(200).json(medico);
        } catch (err) {
            next(err);
        }
    };
}