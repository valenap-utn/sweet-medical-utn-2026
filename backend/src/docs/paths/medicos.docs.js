/**
 * @swagger
 * tags:
 *   name: Médicos
 *   description: Gestión de médicos
 */

/**
 * @swagger
 * /api/medicos/pacientes/{pacienteId}/turnos:
 *   get:
 *     summary: Obtener historial de turnos de un paciente atendido por el médico autenticado
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pacienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del paciente
 *     responses:
 *       200:
 *         description: Historial obtenido correctamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Médico no autorizado
 */

/**
 * @swagger
 * /api/medicos/especialidades/{especialidadId}/turnos:
 *   get:
 *     summary: Consultar disponibilidad del médico autenticado para una especialidad
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: especialidadId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Disponibilidad obtenida correctamente
 */

/**
 * @swagger
 * /api/medicos/practicas/{practicaId}/turnos:
 *   get:
 *     summary: Consultar disponibilidad del médico autenticado para una práctica
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: practicaId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Disponibilidad obtenida correctamente
 */

/**
 * @swagger
 * /api/medicos/disponibilidades:
 *   post:
 *     summary: Agregar disponibilidad al médico autenticado
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - disponibilidad
 *             properties:
 *               disponibilidad:
 *                 type: object
 *                 properties:
 *                   diaSemana:
 *                     type: string
 *                     example: "LUNES"
 *                   horaDesde:
 *                     type: string
 *                     example: "09:00"
 *                   horaHasta:
 *                     type: string
 *                     example: "13:00"
 *     responses:
 *       200:
 *         description: Disponibilidad agregada correctamente
 */

/**
 * @swagger
 * /api/medicos/disponibilidades:
 *   delete:
 *     summary: Quitar disponibilidad del médico autenticado
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - disponibilidad
 *             properties:
 *               disponibilidad:
 *                 type: object
 *                 properties:
 *                   diaSemana:
 *                     type: string
 *                     example: "LUNES"
 *                   horaDesde:
 *                     type: string
 *                     example: "09:00"
 *                   horaHasta:
 *                     type: string
 *                     example: "13:00"
 *     responses:
 *       200:
 *         description: Disponibilidad eliminada correctamente
 */

/**
 * @swagger
 * /api/medicos/practicas/{practicaId}:
 *   post:
 *     summary: Agregar práctica al médico autenticado
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: practicaId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Práctica agregada correctamente
 */

/**
 * @swagger
 * /api/medicos/practicas/{practicaId}:
 *   delete:
 *     summary: Quitar práctica del médico autenticado
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: practicaId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Práctica eliminada correctamente
 */

/**
 * @swagger
 * /api/medicos/especialidades/{especialidadId}:
 *   post:
 *     summary: Agregar especialidad al médico autenticado
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: especialidadId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Especialidad agregada correctamente
 */

/**
 * @swagger
 * /api/medicos/especialidades/{especialidadId}:
 *   delete:
 *     summary: Quitar especialidad del médico autenticado
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: especialidadId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Especialidad eliminada correctamente
 */