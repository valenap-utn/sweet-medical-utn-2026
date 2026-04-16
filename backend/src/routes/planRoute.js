import express from "express";
import {obtenerEspecialidades, obtenerPracticas} from "../controllers/planController.js";

const planRouter = express.Router();

// planRouter.get('/especialidades', obtenerEspecialidades);
// planRouter.get('/practicas', obtenerPracticas);

export default planRouter;