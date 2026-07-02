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

    // Disponibilidades
    router.get('/especialidades/:especialidadId/turnos', authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.consultarDisponibilidadEspecialidad);

    router.get('/practicas/:practicaId/turnos', authMiddleware,requireRole(RolUsuario.MEDICO), medicoController.consultarDisponibilidadPractica);

    router.get('/disponibilidades', authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.obtenerDisponibilidades);

    router.post('/disponibilidades', authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.agregarDisponibilidad);

    router.delete('/disponibilidades', authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.quitarDisponibilidad);

    // Practicas
    router.get('/practicas', authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.obtenerPracticas);

    router.post('/practicas/:practicaId', authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.agregarPractica);

    router.delete('/practicas/:practicaId', authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.quitarPractica);

    // Especialidades
    router.get('/especialidades', authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.obtenerEspecialidades);

    router.post('/especialidades/:especialidadId', authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.agregarEspecialidad);

    router.delete('/especialidades/:especialidadId', authMiddleware, requireRole(RolUsuario.MEDICO), medicoController.quitarEspecialidad);

    return router;
}