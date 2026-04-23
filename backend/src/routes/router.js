import express from "express";
import healthRoutes from "./healthcheckRoute.js";
import planRoutes from "./planRoutes.js";

const router = express.Router();

router.use("/healthcheck", healthRoutes);
router.use("/plan", planRoutes);

export default router;
