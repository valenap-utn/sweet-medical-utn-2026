/**
 * @swagger
 * tags:
 *   name: Sedes
 *   description: Gestión de sedes médicas
 */

/**
 * @swagger
 * /api/sedes:
 *   post:
 *     summary: Crear una sede
 *     tags: [Sedes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: Sede Caballito
 *             direccion: Av. Rivadavia 5500
 *     responses:
 *       201:
 *         description: Sede creada correctamente
 */

/**
 * @swagger
 * /api/sedes:
 *   get:
 *     summary: Obtener todas las sedes
 *     tags: [Sedes]
 *     responses:
 *       200:
 *         description: Lista de sedes obtenida correctamente
 */

/**
 * @swagger
 * /api/sedes/{sedeId}:
 *   delete:
 *     summary: Eliminar una sede
 *     tags: [Sedes]
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
 *         description: Sede no encontrada
 */
