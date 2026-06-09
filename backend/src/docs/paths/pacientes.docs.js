/**
 * @swagger
 * tags:
 *   name: Pacientes
 *   description: Gestión de pacientes
 */

/**
 * @swagger
 * /api/pacientes/turnos:
 *   get:
 *     summary: Obtener historial de turnos del paciente autenticado
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial obtenido correctamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Usuario no autorizado
 */