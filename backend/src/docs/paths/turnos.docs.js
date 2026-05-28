/**
 * @swagger
 * tags:
 *   - name: Turnos
 *     description: Gestión y búsqueda de turnos médicos
 */

/**
 * @swagger
 * /turnos:
 *   post:
 *     tags:
 *       - Turnos
 *     summary: Crear un turno disponible
 *     description: Crea un turno en estado Disponible.
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
 *                 example: "665f1a2b3c4d5e6f78901234"
 *               sede:
 *                 type: string
 *                 example: "665f1a2b3c4d5e6f78905678"
 *               tipoServicio:
 *                 type: string
 *                 enum: [ESPECIALIDAD, PRACTICA]
 *                 example: "ESPECIALIDAD"
 *               especialidad:
 *                 type: string
 *                 nullable: true
 *                 example: "665f1a2b3c4d5e6f78909999"
 *               practica:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               fechaHoraInicio:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-10T15:00:00.000Z"
 *               fechaHoraFin:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-10T15:30:00.000Z"
 *     responses:
 *       201:
 *         description: Turno creado correctamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /turnos/disponibles:
 *   get:
 *     tags:
 *       - Turnos
 *     summary: Buscar turnos disponibles
 *     description: Busca turnos disponibles aplicando filtros y calcula cobertura/costo según el paciente.
 *     parameters:
 *       - in: query
 *         name: pacienteId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f78901111"
 *       - in: query
 *         name: medicoId
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f78901234"
 *       - in: query
 *         name: sedeId
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f78905678"
 *       - in: query
 *         name: tipoServicio
 *         schema:
 *           type: string
 *           enum: [ESPECIALIDAD, PRACTICA]
 *         example: "ESPECIALIDAD"
 *       - in: query
 *         name: especialidadId
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f78909999"
 *       - in: query
 *         name: practicaId
 *         schema:
 *           type: string
 *         example: null
 *       - in: query
 *         name: fechaDesde
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2026-06-01T00:00:00.000Z"
 *       - in: query
 *         name: fechaHasta
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2026-06-30T23:59:59.000Z"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         example: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [fechaHoraInicio, costo]
 *           default: fechaHoraInicio
 *         example: "fechaHoraInicio"
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         example: "asc"
 *     responses:
 *       200:
 *         description: Turnos disponibles encontrados
 *       400:
 *         description: Filtros inválidos o pacienteId faltante
 *       404:
 *         description: Paciente no encontrado
 */

/**
 * @swagger
 * /turnos/medicos-disponibles:
 *   get:
 *     tags:
 *       - Turnos
 *     summary: Obtener médicos disponibles
 *     description: Devuelve médicos con turnos disponibles según filtros de sede y servicio.
 *     parameters:
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
 *     responses:
 *       200:
 *         description: Lista de IDs de médicos disponibles
 */

/**
 * @swagger
 * /turnos/opciones-servicio:
 *   get:
 *     tags:
 *       - Turnos
 *     summary: Obtener opciones de servicio disponibles
 *     description: Devuelve especialidades o prácticas disponibles según el tipo de servicio.
 *     parameters:
 *       - in: query
 *         name: tipoServicio
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ESPECIALIDAD, PRACTICA]
 *         example: "ESPECIALIDAD"
 *       - in: query
 *         name: sedeId
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f78905678"
 *     responses:
 *       200:
 *         description: Lista de IDs de especialidades o prácticas disponibles
 *       400:
 *         description: tipoServicio faltante o inválido
 */
