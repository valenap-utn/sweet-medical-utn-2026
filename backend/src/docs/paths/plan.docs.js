/**
 * @swagger
 * tags:
 *   name: Planes
 *   description: Gestión de planes y coberturas
 */

/**
 * @swagger
 * /api/planes:
 *   post:
 *     summary: Crear un plan
 *     tags: [Planes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Plan 210
 *     responses:
 *       201:
 *         description: Plan creado correctamente
 */

/**
 * @swagger
 * /api/planes:
 *   get:
 *     summary: Obtener todos los planes
 *     tags: [Planes]
 *     responses:
 *       200:
 *         description: Lista de planes
 */

/**
 * @swagger
 * /api/planes/{id}:
 *   get:
 *     summary: Obtener un plan por id
 *     tags: [Planes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plan encontrado
 *       404:
 *         description: Plan no encontrado
 */

/**
 * @swagger
 * /api/planes/{id}:
 *   delete:
 *     summary: Eliminar un plan
 *     tags: [Planes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plan eliminado correctamente
 *       404:
 *         description: Plan no encontrado
 */

/**
 * @swagger
 * /api/planes/{id}/coberturas/especialidades:
 *   patch:
 *     summary: Agregar cobertura para una especialidad
 *     tags: [Planes]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - especialidadId
 *               - nivel
 *             properties:
 *               especialidadId:
 *                 type: string
 *               nivel:
 *                 type: string
 *                 enum:
 *                   - TOTAL
 *                   - PARCIAL
 *                   - NO_CUBIERTA
 *     responses:
 *       200:
 *         description: Cobertura agregada correctamente
 */

/**
 * @swagger
 * /api/planes/{id}/coberturas/practicas:
 *   patch:
 *     summary: Agregar cobertura para una práctica
 *     tags: [Planes]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - practicaId
 *               - nivel
 *             properties:
 *               practicaId:
 *                 type: string
 *               nivel:
 *                 type: string
 *                 enum:
 *                   - TOTAL
 *                   - PARCIAL
 *                   - NO_CUBIERTA
 *     responses:
 *       200:
 *         description: Cobertura agregada correctamente
 */

/**
 * @swagger
 * /api/planes/{id}/coberturas/especialidades/{especialidadId}:
 *   delete:
 *     summary: Quitar cobertura de una especialidad
 *     tags: [Planes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: especialidadId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cobertura eliminada correctamente
 */

/**
 * @swagger
 * /api/planes/{id}/coberturas/practicas/{practicaId}:
 *   delete:
 *     summary: Quitar cobertura de una práctica
 *     tags: [Planes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: practicaId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cobertura eliminada correctamente
 */