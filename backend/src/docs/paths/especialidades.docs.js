/**
 * @swagger
 * tags:
 *   name: Especialidades
 *   description: Gestión de especialidades médicas
 */

/**
 * @swagger
 * /api/especialidades:
 *   post:
 *     summary: Crear una especialidad
 *     tags: [Especialidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - duracionTurnoEnMins
 *               - costo
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Cardiología
 *               duracionTurnoEnMins:
 *                 type: integer
 *                 example: 30
 *               costo:
 *                 type: number
 *                 example: 40000
 *     responses:
 *       201:
 *         description: Especialidad creada correctamente
 */

/**
 * @swagger
 * /api/especialidades:
 *   get:
 *     summary: Obtener todas las especialidades
 *     tags: [Especialidades]
 *     responses:
 *       200:
 *         description: Lista de especialidades obtenida correctamente
 */

/**
 * @swagger
 * /api/especialidades/{especialidadId}:
 *   delete:
 *     summary: Eliminar una especialidad
 *     tags: [Especialidades]
 *     parameters:
 *       - in: path
 *         name: especialidadId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Especialidad eliminada correctamente
 *       404:
 *         description: Especialidad no encontrada
 */
