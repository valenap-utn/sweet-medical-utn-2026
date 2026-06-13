/**
 * @swagger
 * tags:
 *   name: Obras Sociales
 *   description: Gestión de obras sociales y planes
 */

/**
 * @swagger
 * /api/obras-sociales:
 *   post:
 *     summary: Crear una obra social
 *     tags: [Obras Sociales]
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
 *                 example: OSDE
 *     responses:
 *       201:
 *         description: Obra social creada correctamente
 */

/**
 * @swagger
 * /api/obras-sociales:
 *   get:
 *     summary: Obtener todas las obras sociales
 *     tags: [Obras Sociales]
 *     responses:
 *       200:
 *         description: Lista de obras sociales
 */

/**
 * @swagger
 * /api/obras-sociales/{obraSocialId}/planes:
 *   get:
 *     summary: Obtener los planes de una obra social
 *     tags: [Obras Sociales]
 *     parameters:
 *       - in: path
 *         name: obraSocialId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de planes de la obra social
 */

/**
 * @swagger
 * /api/obras-sociales/{obraSocialId}/planes/{planId}:
 *   patch:
 *     summary: Asociar un plan a una obra social
 *     tags: [Obras Sociales]
 *     parameters:
 *       - in: path
 *         name: obraSocialId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plan asociado correctamente
 *       404:
 *         description: Obra social o plan no encontrados
 */

/**
 * @swagger
 * /api/obras-sociales/{obraSocialId}/planes/{planId}:
 *   delete:
 *     summary: Quitar un plan de una obra social
 *     tags: [Obras Sociales]
 *     parameters:
 *       - in: path
 *         name: obraSocialId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plan removido correctamente
 *       404:
 *         description: Obra social o plan no encontrados
 */

/**
 * @swagger
 * /api/obras-sociales/{obraSocialId}:
 *   delete:
 *     summary: Eliminar una obra social
 *     tags: [Obras Sociales]
 *     parameters:
 *       - in: path
 *         name: obraSocialId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Obra social eliminada correctamente
 *       404:
 *         description: Obra social no encontrada
 */