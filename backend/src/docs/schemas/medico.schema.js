/**
 * @swagger
 * components:
 *   schemas:
 *
 *     Medico:
 *       type: object
 *
 *       properties:
 *         _id:
 *           type: string
 *           example: "665f1a2b3c4d5e6f78901111"
 *
 *         usuario:
 *           type: string
 *           example: "665f1a2b3c4d5e6f78909999"
 *
 *         nombre:
 *           type: string
 *           example: "Dr. Juan Pérez"
 *
 *         matricula:
 *           type: string
 *           example: "MN 123456"
 *
 *         especialidades:
 *           type: array
 *
 *           items:
 *             $ref: '#/components/schemas/Especialidad'
 *
 *         practicas:
 *           type: array
 *
 *           items:
 *             $ref: '#/components/schemas/Practica'
 *
 *         sedes:
 *           type: array
 *
 *           items:
 *             type: string
 *             example: "665f1a2b3c4d5e6f78907777"
 *
 *         disponibilidades:
 *           type: array
 *
 *           items:
 *             $ref: '#/components/schemas/DisponibilidadHoraria'
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
 *         - usuario
 *         - nombre
 *         - matricula
 */