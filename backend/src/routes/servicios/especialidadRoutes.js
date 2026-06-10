import express from "express";
import {EspecialidadController} from "../../controllers/servicios/EspecialidadController.js";

export default function especialidadRoutes(getController) {
    const router = express.Router();
    const especialidadController = getController(EspecialidadController);

    router.post('/', especialidadController.crear);

    router.get('/', especialidadController.obtenerTodas);

    router.delete('/:especialidadId', especialidadController.eliminar);

    return router;
}
