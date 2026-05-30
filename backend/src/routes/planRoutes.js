import express from "express";
import {PlanController} from "../controllers/PlanController.js";

export default function planRoutes(getController) {
    const router = express.Router();
    const planController = getController(PlanController);

    // GET /api/planes
    router.get("/", planController.obtenerTodos);

    // GET /api/planes/:id
    router.get("/:id", planController.obtenerPorId);

    return router;
}
