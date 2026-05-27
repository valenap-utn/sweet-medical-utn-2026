import express from "express";
import healthRoutes from "./healthcheckRoute.js";
//import planRoutes from "./planRoutes.js";
import medicoRoutes from "./medicoRoutes.js";

// Acá agrupamos las rutas principales !
export default function createRouter(getController) {
    const router = express.Router();

    router.use("/healthcheck", healthRoutes);
    // router.use("/plan", planRoutes);

    const medicoRouter = medicoRoutes(getController);
    router.use("/medicos", medicoRouter);

    return router;
}
