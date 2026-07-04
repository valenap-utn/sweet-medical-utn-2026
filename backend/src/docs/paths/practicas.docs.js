/**
 * @swagger
 * tags:
 *   name: Prácticas
 *   description: Gestión de prácticas médicas
 */

/**
 * @swagger
 * /api/practicas:
 *   post:
 *     summary: Crear una práctica médica
 *     tags: [Prácticas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - nombre
 *               - duracionTurnoEnMins
 *               - costo
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: ECG001
 *               nombre:
 *                 type: string
 *                 example: Electrocardiograma
 *               duracionTurnoEnMins:
 *                 type: integer
 *                 example: 15
 *               costo:
 *                 type: number
 *                 example: 20000
 *     responses:
 *       201:
 *         description: Práctica creada correctamente
 */

/**
 * @swagger
 * /api/practicas:
 *   get:
 *     summary: Obtener todas las prácticas
 *     tags: [Prácticas]
 *     responses:
 *       200:
 *         description: Lista de prácticas obtenida correctamente
 */

/**
 * @swagger
 * /api/practicas/{practicaId}:
 *   delete:
 *     summary: Eliminar una práctica
 *     tags: [Prácticas]
 *     parameters:
 *       - in: path
 *         name: practicaId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Práctica eliminada correctamente
 *       404:
 *         description: Práctica no encontrada
 */
