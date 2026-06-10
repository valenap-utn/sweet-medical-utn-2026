import express from "express";
import {PracticaController} from "../../controllers/servicios/PracticaController.js";

export default function practicaRoutes(getController) {
    const router = express.Router();
    const practicaController = getController(PracticaController);

    router.post('/', practicaController.crear);

    router.get('/', practicaController.obtenerTodas);

    router.delete('/:practicaId', practicaController.eliminar);

    return router;
}
