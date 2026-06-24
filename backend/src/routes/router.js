import express from "express";
import healthRoutes from "./healthcheckRoute.js";
import medicoRoutes from "./medicoRoutes.js";
import pacienteRoutes from "./pacienteRoutes.js";
import turnoRoutes from "./turnoRoutes.js";
import planRoutes from "./planRoutes.js";
import notificacionRoutes from "./notificacionRoutes.js";
import authRoutes from "./authRoutes.js";
import obraSocialRoutes from "./obraSocialRoutes.js";
import sedeRoutes from "./sedeRoutes.js";
import adminRoutes from "./interno/adminRoutes.js";
import servicioRoutes from "./servicioRoutes.js";

// Acá agrupamos las rutas principales !
export default function createRouter(getController) {
    const router = express.Router();

    router.use("/healthcheck", healthRoutes);

    const adminRouter = adminRoutes(getController);
    router.use("/admin", adminRouter);

    const authRouter = authRoutes(getController);
    router.use("/auth", authRouter);

    const medicoRouter = medicoRoutes(getController);
    router.use("/medicos", medicoRouter);

    const servicioRouter = servicioRoutes(getController);
    router.use("/servicios", servicioRouter);

    const pacientesRouter = pacienteRoutes(getController);
    router.use("/pacientes", pacientesRouter);

    const turnosRouter = turnoRoutes(getController);
    router.use("/turnos", turnosRouter);

    const planesRouter = planRoutes(getController);
    router.use("/planes", planesRouter);

    const notificacionRouter = notificacionRoutes(getController);
    router.use("/notificaciones", notificacionRouter);

    const obraSocialRouter = obraSocialRoutes(getController);
    router.use('/obras-sociales', obraSocialRouter);

    const sedeRouter = sedeRoutes(getController);
    router.use('/sedes', sedeRouter);

    return router;
}
