/**
 * @swagger
 * tags:
 *   - name: Pacientes
 *     description: Operaciones realizadas por pacientes sobre turnos
 */

/**
 * @swagger
 * /pacientes/{pacienteId}/turnos:
 *   get:
 *     tags:
 *       - Pacientes
 *
 *     summary: Obtener historial de turnos de un paciente
 *
 *     parameters:
 *       - in: path
 *         name: pacienteId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f78901111"
 *
 *     responses:
 *       200:
 *         description: Historial obtenido correctamente
 *
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Turno'
 *
 *       404:
 *         description: Paciente no encontrado
 */

/**
 * @swagger
 * /pacientes/{pacienteId}/turnos/{turnoId}/reservar:
 *   post:
 *     tags:
 *       - Pacientes
 *
 *     summary: Reservar un turno
 *
 *     parameters:
 *       - in: path
 *         name: pacienteId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f78901111"
 *
 *       - in: path
 *         name: turnoId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f78909999"
 *
 *     responses:
 *       200:
 *         description: Turno reservado correctamente
 *
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turno'
 *
 *       400:
 *         description: El turno no puede reservarse
 *
 *       404:
 *         description: Paciente o turno inexistente
 */

/**
 * @swagger
 * /pacientes/{pacienteId}/turnos/{turnoId}/cancelar:
 *   patch:
 *     tags:
 *       - Pacientes
 *
 *     summary: Cancelar un turno reservado
 *
 *     parameters:
 *       - in: path
 *         name: pacienteId
 *         required: true
 *         schema:
 *           type: string
 *
 *       - in: path
 *         name: turnoId
 *         required: true
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - motivo
 *
 *             properties:
 *               motivo:
 *                 type: string
 *                 example: "No podré asistir"
 *
 *     responses:
 *       200:
 *         description: Turno cancelado correctamente
 *
 *       400:
 *         description: El turno no puede cancelarse
 *
 *       404:
 *         description: Paciente o turno inexistente
 */

/**
 * @swagger
 * /pacientes/{pacienteId}/turnos/{turnoId}/solicitar-cambio:
 *   patch:
 *     tags:
 *       - Pacientes
 *
 *     summary: Solicitar cambio de fecha de un turno
 *
 *     parameters:
 *       - in: path
 *         name: pacienteId
 *         required: true
 *         schema:
 *           type: string
 *
 *       - in: path
 *         name: turnoId
 *         required: true
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - fechaHoraSolicitada
 *
 *             properties:
 *               fechaHoraSolicitada:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-20T18:00:00.000Z"
 *
 *     responses:
 *       200:
 *         description: Solicitud de cambio enviada correctamente
 *
 *       400:
 *         description: La solicitud es inválida
 *
 *       404:
 *         description: Paciente o turno inexistente
 */
