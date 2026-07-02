import express from "express";
import { requireRole } from "../middlewares/roleMiddleware.js";
import { RolUsuario } from "../domain/enums/RolUsuario.js";
import {TurnoController} from "../controllers/TurnoController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";

export default function turnoRoutes(getController) {
    const router = express.Router();
    const turnoController = getController(TurnoController);

    // Endpoints
    router.post("/", turnoController.crearTurno);

    // Generales
    router.patch("/:turnoId/cancelacion", authMiddleware, turnoController.cancelarTurno);

    router.patch("/:turnoId/confirmacion", authMiddleware, turnoController.confirmarTurno);

    router.patch("/:turnoId/confirmacion-cambio-fecha", authMiddleware, turnoController.confirmarCambioFecha);

    // Solo médicos
    router.patch("/:turnoId/realizacion", authMiddleware, requireRole(RolUsuario.MEDICO), turnoController.marcarTurnoRealizado);

    router.patch("/:turnoId/propuesta-cambio-fecha", authMiddleware, requireRole(RolUsuario.MEDICO), turnoController.proponerCambioFecha);

    // Solo pacientes
    router.patch("/:turnoId/reserva", authMiddleware, requireRole(RolUsuario.PACIENTE), turnoController.reservarTurno);

    router.patch("/:turnoId/solicitud-cambio-fecha", authMiddleware, requireRole(RolUsuario.PACIENTE), turnoController.solicitarCambioFecha);

    router.get("/:turnoId/cotizacion", authMiddleware, requireRole(RolUsuario.PACIENTE), turnoController.obtenerCotizacionTurno);

    router.get("/disponibles", authMiddleware, requireRole(RolUsuario.PACIENTE), turnoController.buscarTurnosDisponibles);

    return router;
}