/**
 * @swagger
 * tags:
 *   - name: Médicos
 *     description: Operaciones realizadas por médicos sobre turnos, disponibilidades y servicios
 */

/**
 * @swagger
 * /medicos/{medicoId}/pacientes/{pacienteId}/turnos:
 *   get:
 *     tags:
 *       - Médicos
 *
 *     summary: Obtener historial de turnos de un paciente
 *
 *     parameters:
 *       - in: path
 *         name: medicoId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f78901111"
 *
 *       - in: path
 *         name: pacienteId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f78902222"
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
 * /medicos/{medicoId}/turnos/{turnoId}/cancelar:
 *   patch:
 *     tags:
 *       - Médicos
 *
 *     summary: Cancelar un turno
 *
 *     parameters:
 *       - in: path
 *         name: medicoId
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
 *         example: "665f1a2b3c4d5e6f78903333"
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               motivo:
 *                 type: string
 *
 *             example:
 *               motivo: "Emergencia médica"
 *
 *     responses:
 *       200:
 *         description: Turno cancelado correctamente
 *
 *       400:
 *         description: Error de validación
 *
 *       404:
 *         description: Turno no encontrado
 */

/**
 * @swagger
 * /medicos/{medicoId}/turnos/{turnoId}/realizado:
 *   patch:
 *     tags:
 *       - Médicos
 *
 *     summary: Marcar un turno como realizado
 *
 *     parameters:
 *       - in: path
 *         name: medicoId
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
 *         example: "665f1a2b3c4d5e6f78903333"
 *
 *     responses:
 *       200:
 *         description: Turno marcado como realizado correctamente
 *
 *       400:
 *         description: El turno no puede marcarse como realizado
 *
 *       404:
 *         description: Turno no encontrado
 */

/**
 * @swagger
 * /medicos/{medicoId}/turnos/{turnoId}/proponer-cambio:
 *   patch:
 *     tags:
 *       - Médicos
 *
 *     summary: Proponer una nueva fecha para un turno
 *
 *     parameters:
 *       - in: path
 *         name: medicoId
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
 *         example: "665f1a2b3c4d5e6f78903333"
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               nuevaFechaHora:
 *                 type: string
 *                 format: date-time
 *
 *             example:
 *               nuevaFechaHora: "2026-06-10T15:30:00"
 *
 *     responses:
 *       200:
 *         description: Nueva fecha propuesta correctamente
 *
 *       400:
 *         description: Fecha inválida
 *
 *       404:
 *         description: Turno no encontrado
 */

/**
 * @swagger
 * /medicos/{medicoId}/turnos/{turnoId}/confirmacion:
 *   patch:
 *     tags:
 *       - Médicos
 *
 *     summary: Confirmar modificación de fecha de un turno
 *
 *     parameters:
 *       - in: path
 *         name: medicoId
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
 *         example: "665f1a2b3c4d5e6f78903333"
 *
 *     responses:
 *       200:
 *         description: Cambio de fecha confirmado correctamente
 *
 *       400:
 *         description: No existe una propuesta pendiente
 *
 *       404:
 *         description: Turno no encontrado
 */

/**
 * @swagger
 * /medicos/{medicoId}/disponibilidades:
 *   post:
 *     tags:
 *       - Médicos
 *
 *     summary: Agregar disponibilidad horaria
 *
 *     parameters:
 *       - in: path
 *         name: medicoId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f78901111"
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               disponibilidad:
 *                 $ref: '#/components/schemas/DisponibilidadHoraria'
 *
 *     responses:
 *       200:
 *         description: Disponibilidad agregada correctamente
 *
 *       400:
 *         description: Disponibilidad inválida
 *
 *       404:
 *         description: Médico no encontrado
 */

/**
 * @swagger
 * /medicos/{medicoId}/disponibilidades:
 *   delete:
 *     tags:
 *       - Médicos
 *
 *     summary: Quitar disponibilidad horaria
 *
 *     parameters:
 *       - in: path
 *         name: medicoId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f78901111"
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               disponibilidad:
 *                 $ref: '#/components/schemas/DisponibilidadHoraria'
 *
 *     responses:
 *       200:
 *         description: Disponibilidad eliminada correctamente
 *
 *       404:
 *         description: Disponibilidad no encontrada
 */

/**
 * @swagger
 * /medicos/{medicoId}/practicas/{practicaId}:
 *   post:
 *     tags:
 *       - Médicos
 *
 *     summary: Agregar práctica al médico
 *
 *     parameters:
 *       - in: path
 *         name: medicoId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f78901111"
 *
 *       - in: path
 *         name: practicaId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f78904444"
 *
 *     responses:
 *       200:
 *         description: Práctica agregada correctamente
 *
 *       404:
 *         description: Médico o práctica no encontrada
 */

/**
 * @swagger
 * /medicos/{medicoId}/practicas/{practicaId}:
 *   delete:
 *     tags:
 *       - Médicos
 *
 *     summary: Quitar práctica del médico
 *
 *     parameters:
 *       - in: path
 *         name: medicoId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f78901111"
 *
 *       - in: path
 *         name: practicaId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f78904444"
 *
 *     responses:
 *       200:
 *         description: Práctica eliminada correctamente
 *
 *       404:
 *         description: Médico o práctica no encontrada
 */

/**
 * @swagger
 * /medicos/{medicoId}/especialidades/{especialidadId}:
 *   post:
 *     tags:
 *       - Médicos
 *
 *     summary: Agregar especialidad al médico
 *
 *     parameters:
 *       - in: path
 *         name: medicoId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f78901111"
 *
 *       - in: path
 *         name: especialidadId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f78905555"
 *
 *     responses:
 *       200:
 *         description: Especialidad agregada correctamente
 *
 *       404:
 *         description: Médico o especialidad no encontrada
 */

/**
 * @swagger
 * /medicos/{medicoId}/especialidades/{especialidadId}:
 *   delete:
 *     tags:
 *       - Médicos
 *
 *     summary: Quitar especialidad del médico
 *
 *     parameters:
 *       - in: path
 *         name: medicoId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f78901111"
 *
 *       - in: path
 *         name: especialidadId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f78905555"
 *
 *     responses:
 *       200:
 *         description: Especialidad eliminada correctamente
 *
 *       404:
 *         description: Médico o especialidad no encontrada
 */