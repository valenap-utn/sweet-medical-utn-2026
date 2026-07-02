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
 *     summary: Agregar una disponibilidad al médico autenticado
 *     description: Registra una disponibilidad horaria asociada a una sede y a un servicio (especialidad o práctica). La agenda podrá generar turnos a partir de estas disponibilidades.
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
 *                 required:
 *                   - diaSemana
 *                   - horaDesde
 *                   - horaHasta
 *                   - sede
 *                   - tipoServicio
 *                   - servicio
 *                 properties:
 *                   diaSemana:
 *                     type: string
 *                     example: "Lunes"
 *                   horaDesde:
 *                     type: string
 *                     example: "09:00"
 *                   horaHasta:
 *                     type: string
 *                     example: "13:00"
 *                   sede:
 *                     type: string
 *                     example: "682f1c2f7c4d2f0012345678"
 *                   tipoServicio:
 *                     type: string
 *                     enum:
 *                       - ESPECIALIDAD
 *                       - PRACTICA
 *                   servicio:
 *                     type: string
 *                     example: "682f1c2f7c4d2f0012349999"
 *           example:
 *             disponibilidad:
 *               diaSemana: "Lunes"
 *               horaDesde: "09:00"
 *               horaHasta: "13:00"
 *               sede: "682f1c2f7c4d2f0012345678"
 *               tipoServicio: "ESPECIALIDAD"
 *               servicio: "682f1c2f7c4d2f0012349999"
 *     responses:
 *       200:
 *         description: Disponibilidad agregada correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Médico, sede o servicio no encontrados
 */

/**
 * @swagger
 * /api/medicos/disponibilidades:
 *   delete:
 *     summary: Quitar una disponibilidad del médico autenticado
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             disponibilidad:
 *               diaSemana: "Lunes"
 *               horaDesde: "09:00"
 *               horaHasta: "13:00"
 *               sede: "682f1c2f7c4d2f0012345678"
 *               tipoServicio: "ESPECIALIDAD"
 *               servicio: "682f1c2f7c4d2f0012349999"
 *     responses:
 *       200:
 *         description: Disponibilidad eliminada correctamente
 *       404:
 *         description: Disponibilidad no encontrada
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

/**
 * @swagger
 * /api/medicos/sedes:
 *   get:
 *     summary: Obtener las sedes asociadas al médico autenticado
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sedes obtenida correctamente
 *       401:
 *         description: No autenticado
 */

/**
 * @swagger
 * /api/medicos/sedes/{sedeId}:
 *   post:
 *     summary: Asociar una sede al médico autenticado
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sedeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sede agregada correctamente
 *       404:
 *         description: Médico o sede no encontrados
 */

/**
 * @swagger
 * /api/medicos/sedes/{sedeId}:
 *   delete:
 *     summary: Quitar una sede del médico autenticado
 *     description: Elimina también las disponibilidades asociadas a dicha sede.
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sedeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sede eliminada correctamente
 *       404:
 *         description: Médico o sede no encontrados
 */

/**
 * @swagger
 * /api/medicos/disponibilidades:
 *   get:
 *     summary: Obtener las disponibilidades del médico autenticado
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Disponibilidades obtenidas correctamente
 *       401:
 *         description: No autenticado
 */
