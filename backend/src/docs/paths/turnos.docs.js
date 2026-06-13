// src/docs/turnos.docs.js

/**
 * @swagger
 * tags:
 *   name: Turnos
 *   description: Gestión de turnos médicos
 */

/**
 * @swagger
 * /api/turnos:
 *   post:
 *     summary: Crear un turno disponible
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - medico
 *               - sede
 *               - tipoServicio
 *               - fechaHoraInicio
 *               - fechaHoraFin
 *             properties:
 *               medico:
 *                 type: string
 *               sede:
 *                 type: string
 *               tipoServicio:
 *                 type: string
 *                 enum: [ESPECIALIDAD, PRACTICA]
 *               especialidad:
 *                 type: string
 *                 nullable: true
 *               practica:
 *                 type: string
 *                 nullable: true
 *               fechaHoraInicio:
 *                 type: string
 *                 format: date-time
 *               fechaHoraFin:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Turno creado correctamente
 */

/**
 * @swagger
 * /api/turnos/disponibles:
 *   get:
 *     summary: Buscar turnos disponibles
 *     tags: [Turnos]
 *     parameters:
 *       - in: query
 *         name: medicoId
 *         schema:
 *           type: string
 *       - in: query
 *         name: sedeId
 *         schema:
 *           type: string
 *       - in: query
 *         name: tipoServicio
 *         schema:
 *           type: string
 *           enum: [ESPECIALIDAD, PRACTICA]
 *       - in: query
 *         name: especialidadId
 *         schema:
 *           type: string
 *       - in: query
 *         name: practicaId
 *         schema:
 *           type: string
 *       - in: query
 *         name: fechaDesde
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fechaHasta
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [fechaHoraInicio, costo]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Turnos disponibles encontrados
 */

/**
 * @swagger
 * /api/turnos/{turnoId}/cotizacion:
 *   get:
 *     summary: Obtener la cotización de un turno para el paciente autenticado
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turnoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cotización obtenida correctamente
 *         content:
 *           application/json:
 *             example:
 *               turno:
 *                 id: "682f1c2f7c4d2f0012345678"
 *                 tipoServicio: "PRACTICA"
 *                 estado: "Disponible"
 *               cobertura: "PARCIAL"
 *               costo: 10000
 *       403:
 *         description: Usuario no autorizado
 *       404:
 *         description: Turno o paciente no encontrado
 */

/**
 * @swagger
 * /api/turnos/{turnoId}/reserva:
 *   patch:
 *     summary: Reservar un turno disponible
 *     description: Asigna el paciente al turno, calcula la cobertura del plan y guarda el costo final del turno.
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turnoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Turno reservado correctamente
 *       403:
 *         description: Solo un paciente puede reservar turnos
 *       404:
 *         description: Turno no encontrado
 *       409:
 *         description: El turno no se encuentra disponible
 */

/**
 * @swagger
 * /api/turnos/{turnoId}/cancelacion:
 *   patch:
 *     summary: Cancelar un turno
 *     description: Registra la cancelación en el historial y libera nuevamente el turno para que pueda ser reservado por otro paciente.
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turnoId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - motivo
 *             properties:
 *               motivo:
 *                 type: string
 *                 example: "No podré asistir al turno."
 *     responses:
 *       200:
 *         description: Turno cancelado y liberado correctamente
 *       400:
 *         description: Debe indicar un motivo
 *       403:
 *         description: Usuario no autorizado para cancelar el turno
 *       404:
 *         description: Turno no encontrado
 *       409:
 *         description: El turno no puede cancelarse por su estado actual o por falta de anticipación
 */

/**
 * @swagger
 * /api/turnos/{turnoId}/solicitud-cambio-fecha:
 *   patch:
 *     summary: Solicitar cambio de fecha de un turno como paciente
 *     description: Registra una nueva fecha solicitada sin modificar todavía la fecha real del turno. Requiere confirmación posterior.
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turnoId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nuevaFechaHora
 *             properties:
 *               nuevaFechaHora:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Solicitud de cambio registrada correctamente
 */

/**
 * @swagger
 * /api/turnos/{turnoId}/propuesta-cambio-fecha:
 *   patch:
 *     summary: Proponer cambio de fecha de un turno como médico
 *     description: Registra una nueva fecha propuesta sin modificar todavía la fecha real del turno. Requiere confirmación posterior.
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turnoId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nuevaFechaHora
 *             properties:
 *               nuevaFechaHora:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Propuesta de cambio registrada correctamente
 */

/**
 * @swagger
 * /api/turnos/{turnoId}/confirmacion:
 *   patch:
 *     summary: Confirmar una propuesta o solicitud de cambio de fecha
 *     description: Aplica la fecha propuesta al turno, recalcula la fecha de fin según la duración del servicio y elimina la fecha temporal pendiente.
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turnoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cambio de fecha confirmado correctamente
 *       403:
 *         description: Usuario no autorizado
 *       404:
 *         description: Turno no encontrado
 *       409:
 *         description: No existe una propuesta de cambio pendiente
 */

/**
 * @swagger
 * /api/turnos/{turnoId}/realizacion:
 *   patch:
 *     summary: Marcar un turno como realizado
 *     description: Solo el médico del turno puede realizar esta acción. El turno debe encontrarse en estado Reservado o Confirmado.
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turnoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Turno marcado como realizado
 *       403:
 *         description: Solo el médico del turno puede marcarlo como realizado
 *       404:
 *         description: Turno no encontrado
 *       409:
 *         description: El turno no se encuentra en un estado válido para ser realizado
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */