import express from "express";
import { healthcheck } from "../controllers/HealthcheckController.js";

const healthcheckRouter = express.Router();

healthcheckRouter.get('/healthcheck', healthcheck);

export default healthcheckRouter;