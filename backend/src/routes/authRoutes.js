import express from "express";
import {authMiddleware} from "../middlewares/authMiddleware.js";

export default function authRoutes(authController) {
    const router = express.Router();

    router.post("/login", authController.login);

    router.post("/refresh", authController.refresh);

    router.post("/logout", authController.logout);

    router.get("/me", authMiddleware, authController.me);

    return router;
}
