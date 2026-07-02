import express from "express";
import {AdminController} from "../../controllers/interno/AdminController.js";
import {authMiddleware} from "../../middlewares/authMiddleware.js";

export default function adminRoutes(getController){
    const router = express.Router();
    const adminController = getController(AdminController);

    router.post("/batch/turnos", authMiddleware, adminController.ejecutarBatchTurnos);

    router.post("/medicos/:medicoId/regenerar-agenda", authMiddleware, adminController.regenerarAgendaMedico);

    return router;
}