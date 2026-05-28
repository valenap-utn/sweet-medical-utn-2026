import express from "express";
import healthRoutes from "./healthcheckRoute.js";
import medicoRoutes from "./medicoRoutes.js";
import pacienteRoutes from "./pacienteRoutes.js";
import turnoRoutes from "./turnoRoutes.js";

// Acá agrupamos las rutas principales !
export default function createRouter(getController) {
    const router = express.Router();

    router.use("/healthcheck", healthRoutes);
    // router.use("/plan", planRoutes);

    const medicoRouter = medicoRoutes(getController);
    router.use("/medicos", medicoRouter);

    const pacientesRouter = pacienteRoutes(getController);
    router.use("/pacientes", pacientesRouter);

    const turnosRouter = turnoRoutes(getController);
    router.use("/turnos", turnosRouter);

    return router;
}
