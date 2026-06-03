import express from "express";
import {PacienteController} from "../controllers/PacienteController.js";

export default function pacienteRoutes(getController) {
    const router = express.Router();
    const pacienteController = getController(PacienteController);

    // Endpoints
    router.get('/:pacienteId/turnos', pacienteController.obtenerHistorial);

    router.post('/:pacienteId/turnos/:turnoId/reservar', pacienteController.reservarTurno)

    router.patch('/:pacienteId/turnos/:turnoId/cancelar', pacienteController.cancelarTurno);

    router.patch('/:pacienteId/turnos/:turnoId/solicitar-cambio', pacienteController.solicitarCambioFecha);

    router.patch('/pacienteId/turnos/turnoId/confirmacion', pacienteController.confirmarCambioFechaPropuestoPorMedico)

    return router;
}
