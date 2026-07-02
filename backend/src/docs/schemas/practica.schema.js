/**
 * @swagger
 * components:
 *   schemas:
 *
 *     Practica:
 *       type: object
 *
 *       properties:
 *         _id:
 *           type: string
 *           example: "665f1a2b3c4d5e6f78904444"
 *
 *         codigo:
 *           type: string
 *           example: "ECO001"
 *
 *         nombre:
 *           type: string
 *           example: "Ecografía Doppler"
 *
 *         duracionTurnoEnMins:
 *           type: number
 *           example: 45
 *
 *         costo:
 *           type: number
 *           example: 25000
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
 *         - codigo
 *         - nombre
 *         - duracionTurnoEnMins
 *         - costo
 */