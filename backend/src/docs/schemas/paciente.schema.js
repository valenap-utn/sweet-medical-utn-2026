/**
 * @swagger
 * components:
 *   schemas:
 *     Paciente:
 *       type: object
 *
 *       properties:
 *         _id:
 *           type: string
 *           example: "665f1a2b3c4d5e6f78901111"
 *
 *         usuario:
 *           type: string
 *           description: ObjectId del usuario asociado
 *           example: "665f1a2b3c4d5e6f78900001"
 *
 *         dni:
 *           type: string
 *           example: "40111222"
 *
 *         nombre:
 *           type: string
 *           example: "Juan Pérez"
 *
 *         obraSocial:
 *           type: string
 *           description: ObjectId de la obra social
 *           example: "665f1a2b3c4d5e6f78900002"
 *
 *         plan:
 *           type: string
 *           description: ObjectId del plan del paciente
 *           example: "665f1a2b3c4d5e6f78900003"
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 */