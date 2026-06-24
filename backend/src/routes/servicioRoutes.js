import express from "express";
import {ServicioController} from "../controllers/ServicioController.js";

export default function servicioRoutes(getController) {
    const router = express.Router();
    const servicioController = getController(ServicioController);

    router.post('/', servicioController.crear);

    router.get('/', servicioController.obtenerTodos);

    router.patch('/:servicioId', servicioController.modificar);

    router.delete('/:servicioId', servicioController.eliminar);

    return router;
}
