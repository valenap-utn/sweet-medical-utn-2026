import express from "express";
import {ServiciosMedicoController} from "../controllers/ServiciosMedicoController.js";

export default function serviciosMedicoRoutes(getController) {
    const router = express.Router();
    const serviciosMedicoController = getController(ServiciosMedicoController);

    // Endpoints

    // Especialidades

    router.post("/especialidades", serviciosMedicoController.crearEspecialidad);

    router.patch("/especialidades/:especialidadId", serviciosMedicoController.modificarEspecialidad);

    router.delete("/especialidades/:especialidadId", serviciosMedicoController.borrarEspecialidad);

    // Prácticas

    router.post("/practicas", serviciosMedicoController.crearPractica);

    router.patch("/practicas/:practicaId", serviciosMedicoController.modificarPractica);

    router.delete("/practicas/:practicaId", serviciosMedicoController.borrarPractica);

    return router;
}