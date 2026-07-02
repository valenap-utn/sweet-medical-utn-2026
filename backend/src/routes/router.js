import express from "express";
import healthRoutes from "./healthcheckRoute.js";
import medicoRoutes from "./medicoRoutes.js";
import serviciosMedicoRoutes from "./serviciosMedicoRoutes.js";
import pacienteRoutes from "./pacienteRoutes.js";
import turnoRoutes from "./turnoRoutes.js";
import planRoutes from "./planRoutes.js";
import notificacionRoutes from "./notificacionRoutes.js";
import authRoutes from "./authRoutes.js";
import especialidadRoutes from "./servicios/especialidadRoutes.js";
import practicaRoutes from "./servicios/practicaRoutes.js";
import obraSocialRoutes from "./obraSocialRoutes.js";
import sedeRoutes from "./sedeRoutes.js";
import adminRoutes from "./interno/adminRoutes.js";

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

    const pacientesRouter = pacienteRoutes(getController);
    router.use("/pacientes", pacientesRouter);

    const turnosRouter = turnoRoutes(getController);
    router.use("/turnos", turnosRouter);

    const serviciosMedicoRouter = serviciosMedicoRoutes(getController);
    router.use("/servicios-medicos", serviciosMedicoRouter);

    const planesRouter = planRoutes(getController);
    router.use("/planes", planesRouter);

    const notificacionRouter = notificacionRoutes(getController);
    router.use("/notificaciones", notificacionRouter);

    const especialidadRouter = especialidadRoutes(getController);
    router.use('/especialidades', especialidadRouter);

    const practicaRouter = practicaRoutes(getController);
    router.use('/practicas', practicaRouter);

    const obraSocialRouter = obraSocialRoutes(getController);
    router.use('/obras-sociales', obraSocialRouter);

    const sedeRouter = sedeRoutes(getController);
    router.use('/sedes', sedeRouter);

    return router;
}
