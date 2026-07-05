export class MedicoController {
    constructor(medicoService) {
        this.medicoService = medicoService;
    }


    obtenerHistorial = async (req, res, next) => {
        try {
            const {pacienteId} = req.params;

            const turnos = await this.medicoService.obtenerHistorial({
                pacienteId,
                medicoId: req.user.medicoId
            });

            res.status(200).json(turnos);
        } catch (err) {
            next(err);
        }
    };

    obtenerAgenda = async (req, res, next) => {
        try {
            const turnos = await this.medicoService.obtenerAgenda({
                medicoId: req.user.medicoId,
                filtros: req.query,
            });

            res.status(200).json(turnos);
        } catch (err) {
            next(err);
        }
    };

    // Sedes

    obtenerSedes = async (req, res, next) => {
        try {
            const sedes = await this.medicoService.obtenerSedes({
                medicoId: req.user.medicoId,
            })
            res.status(200).json(sedes);
        } catch (err) {
            next(err);
        }
    }

    agregarSede = async (req, res, next) => {
        try {
            const {sedeId} = req.params;
            const resultado = await this.medicoService.agregarSede({
                medicoId: req.user.medicoId,
                sedeId,
            })

            res.status(200).json(resultado);
        } catch (err) {
            next(err);
        }
    }

    obtenerEspecialidades = async (req, res, next) => {
        try {
            const especialidades = await this.medicoService.obtenerEspecialidades({
                medicoId: req.user.medicoId,
            });

            res.status(200).json(especialidades);
        } catch (err) {
            next(err);
        }
    };

    obtenerPracticas = async (req, res, next) => {
        try {
            const practicas = await this.medicoService.obtenerPracticas({
                medicoId: req.user.medicoId,
            });

            res.status(200).json(practicas);
        } catch (err) {
            next(err);
        }
    };

    quitarSede = async (req, res, next) => {
        try {
            const {sedeId} = req.params;
            const resultado = await this.medicoService.quitarSede({
                medicoId: req.user.medicoId,
                sedeId,
            })
            res.status(200).json(resultado);
        } catch (err) {
            next(err);
        }
    }

    // Disponibilidades
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

    // Practicas
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

    // Especialidades
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