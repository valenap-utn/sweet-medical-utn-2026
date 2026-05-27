import express from "express";
import { MedicoController } from "../controllers/MedicoController.js";

export default function medicoRoutes(getController) {
    const router = express.Router();
    const medicoController = getController(MedicoController);

    // Endpoints
    router.get('/:medicoId/pacientes/:pacienteId/turnos', medicoController.obtenerHistorial);

    router.patch('/:medicoId/turnos/:turnoId/cancelar', medicoController.cancelarTurno);

    router.patch('/:medicoId/turnos/:turnoId/realizado', medicoController.marcarTurnoRealizado);

    router.patch('/:medicoId/turnos/:turnoId/proponer-cambio', medicoController.proponerCambioFecha);

    router.patch('/:medicoId/turnos/:turnoId/confirmar-cambio', medicoController.confirmarModificacionFecha);

    router.post('/:medicoId/disponibilidades', medicoController.agregarDisponibilidad);

    router.delete('/:medicoId/disponibilidades', medicoController.quitarDisponibilidad);

    return router;
}