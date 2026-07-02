import express from "express";
import {authMiddleware} from "../middlewares/authMiddleware.js";
import {AuthController} from "../controllers/AuthController.js";

export default function authRoutes(getController) {
    const router = express.Router();
    const authController = getController(AuthController);

    router.post('/register/paciente', authController.registrarPaciente);

    router.post('/register/medico', authController.registrarMedico);

    router.post("/login", authController.login);

    router.post("/refresh", authController.refresh);

    router.post("/logout", authController.logout);

    router.get("/me", authMiddleware, authController.me);

    router.get("/perfil", authMiddleware, authController.obtenerPerfil);

    return router;
}
