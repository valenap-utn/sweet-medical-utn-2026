import express from "express";
import {PlanController} from "../controllers/PlanController.js";

export default function planRoutes(getController) {
    const router = express.Router();
    const planController = getController(PlanController);

    router.post("/", planController.crear);

    // GET /api/planes
    router.get("/", planController.obtenerTodos);

    // GET /api/planes/:id
    router.get("/:id", planController.obtenerPorId);

    // Coberturas
    router.patch("/:id/coberturas/especialidades", planController.agregarCoberturaEspecialidad);

    router.patch("/:id/coberturas/practicas", planController.agregarCoberturaPractica);

    router.delete("/:id/coberturas/especialidades/:especialidadId", planController.quitarCoberturaEspecialidad);

    router.delete("/:id/coberturas/practicas/:practicaId", planController.quitarCoberturaPractica);

    router.delete('/:id', planController.eliminar);

    return router;
}
