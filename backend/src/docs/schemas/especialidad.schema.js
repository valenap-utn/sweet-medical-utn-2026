/**
 * @swagger
 * components:
 *   schemas:
 *
 *     Especialidad:
 *       type: object
 *
 *       properties:
 *         _id:
 *           type: string
 *           example: "665f1a2b3c4d5e6f78905555"
 *
 *         nombre:
 *           type: string
 *           example: "Cardiología"
 *
 *         duracionTurnoEnMins:
 *           type: number
 *           example: 30
 *
 *         costo:
 *           type: number
 *           example: 15000
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *       required:
 *         - nombre
 *         - duracionTurnoEnMins
 *         - costo
 */