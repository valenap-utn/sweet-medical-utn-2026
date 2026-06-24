import express from "express";
import { requireRole } from "../middlewares/roleMiddleware.js";
import { RolUsuario } from "../domain/enums/RolUsuario.js";
import {MedicoController} from "../controllers/MedicoController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";

export default function medicoRoutes(getController) {
    const router = express.Router();
    const medicoController = getController(MedicoController);

    // Endpoints
    router.get('/pacientes/:pacienteId/turnos', authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.obtenerHistorial);

    // Agenda
    router.get("/agenda", authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.obtenerAgenda);

    // Sedes
    router.get('/sedes', authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.obtenerSedes);

    router.post('/sedes/:sedeId', authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.agregarSede);

    router.delete('/sedes/:sedeId', authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.quitarSede);

    router.get('/servicios/:servicioId/turnos', authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.consultarDisponibilidad);

    router.get('/disponibilidades', authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.obtenerDisponibilidades);

    router.post('/disponibilidades', authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.agregarDisponibilidad);

    router.delete('/disponibilidades', authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.quitarDisponibilidad);

    router.get('/servicios', authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.obtenerServicios);

    router.post('/servicios/:servicioId', authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.agregarServicio);

    router.delete('/servicios/:servicioId', authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.quitarServicio);

    return router;
}