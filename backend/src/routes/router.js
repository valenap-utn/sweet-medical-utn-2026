import express from "express";
import healthRoutes from "./healthcheckRoute.js";
// import planRoutes from "./planRoutes.js";
import pacienteRoutes from "./pacienteRoutes.js";
import turnoRoutes from "./turnoRoutes.js";

// Acá agrupamos las rutas principales !
export default function createRouter(getController) {
    const router = express.Router();

    router.use("/healthcheck", healthRoutes);
    // router.use("/plan", planRoutes);

    const pacientesRouter = pacienteRoutes(getController);
    router.use("/pacientes", pacientesRouter);

    const turnosRouter = turnoRoutes(getController);
    router.use("/turnos", turnosRouter);

    return router;
}