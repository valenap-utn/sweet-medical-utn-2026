export class ServiciosMedicoController {

    constructor(serviciosMedicoService) {
        this.serviciosMedicoService = serviciosMedicoService;
    }

    async crearEspecialidad(req, res, next) {
        try {

            const {
                nombre,
                duracionTurnoEnMins,
                costo
            } = req.body;

            const especialidad =
                await this.serviciosMedicoService.crearEspecialidad({
                    nombre,
                    duracionTurnoEnMins,
                    costo
                });

            res.status(201).json({
                status: "success",
                data: especialidad
            });

        } catch (error) {
            next(error);
        }
    }

    async borrarEspecialidad(req, res, next) {
        try {

            const { especialidadId } = req.params;

            const especialidad =
                await this.serviciosMedicoService.borrarEspecialidad({
                    especialidadId
                });

            res.status(200).json({
                status: "success",
                data: especialidad
            });

        } catch (error) {
            next(error);
        }
    }

    async modificarEspecialidad(req, res, next) {
        try {

            const { especialidadId } = req.params;

            const {
                nombre,
                duracionTurnoEnMins,
                costo
            } = req.body;

            const especialidad =
                await this.serviciosMedicoService.modificarEspecialidad(
                    especialidadId,
                    {
                        nombre,
                        duracionTurnoEnMins,
                        costo
                    }
                );

            res.status(200).json({
                status: "success",
                data: especialidad
            });

        } catch (error) {
            next(error);
        }
    }

    async crearPractica(req, res, next) {
        try {

            const {
                nombre,
                duracionTurnoEnMins,
                costo
            } = req.body;

            const practica =
                await this.serviciosMedicoService.crearPractica({
                    nombre,
                    duracionTurnoEnMins,
                    costo
                });

            res.status(201).json({
                status: "success",
                data: practica
            });

        } catch (error) {
            next(error);
        }
    }

    async borrarPractica(req, res, next) {
        try {

            const { practicaId } = req.params;

            const practica =
                await this.serviciosMedicoService.borrarPractica({
                    practicaId
                });

            res.status(200).json({
                status: "success",
                data: practica
            });

        } catch (error) {
            next(error);
        }
    }

    async modificarPractica(req, res, next) {
        try {

            const { practicaId } = req.params;

            const {
                nombre,
                duracionTurnoEnMins,
                costo
            } = req.body;

            const practica =
                await this.serviciosMedicoService.modificarPractica(
                    practicaId,
                    {
                        nombre,
                        duracionTurnoEnMins,
                        costo
                    }
                );

            res.status(200).json({
                status: "success",
                data: practica
            });

        } catch (error) {
            next(error);
        }
    }
}