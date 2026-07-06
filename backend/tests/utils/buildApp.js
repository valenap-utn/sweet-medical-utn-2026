import express from "express";
import cookieParser from "cookie-parser";

import { AuthService } from "../../src/services/AuthService.js";
import { AuthController } from "../../src/controllers/AuthController.js";
import authRoutes from "../../src/routes/authRoutes.js";
import { errorHandler } from "../../src/middlewares/errorHandler.js";
import { notFoundHandler } from "../../src/middlewares/notFoundHandler.js";

export function buildTestApp({ usuarioRepository, pacienteRepository, medicoRepository }) {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());

    const authService = new AuthService(usuarioRepository, pacienteRepository, medicoRepository);
    const authController = new AuthController(authService);

    const getController = (ControllerClass) => {
        if (ControllerClass === AuthController) return authController;
        throw new Error(`Controller no registrado en el test: ${ControllerClass.name}`);
    };

    app.use(authRoutes(getController));

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}