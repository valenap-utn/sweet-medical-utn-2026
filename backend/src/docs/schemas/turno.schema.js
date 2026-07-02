/**
 * @swagger
 * components:
 *   schemas:
 *     Turno:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "665f1a2b3c4d5e6f78901234"
 *
 *         medico:
 *           type: string
 *           description: ObjectId del médico asignado al turno
 *           example: "665f1a2b3c4d5e6f78900001"
 *
 *         paciente:
 *           type: string
 *           nullable: true
 *           description: ObjectId del paciente asociado. Es null si el turno está disponible.
 *           example: null
 *
 *         sede:
 *           type: string
 *           description: ObjectId de la sede donde se realiza el turno
 *           example: "665f1a2b3c4d5e6f78900002"
 *
 *         tipoServicio:
 *           type: string
 *           enum:
 *             - ESPECIALIDAD
 *             - PRACTICA
 *           example: "ESPECIALIDAD"
 *
 *         especialidad:
 *           type: string
 *           nullable: true
 *           description: ObjectId de la especialidad, si el turno corresponde a una especialidad
 *           example: "665f1a2b3c4d5e6f78900003"
 *
 *         practica:
 *           type: string
 *           nullable: true
 *           description: ObjectId de la práctica, si el turno corresponde a una práctica
 *           example: null
 *
 *         fechaHoraInicio:
 *           type: string
 *           format: date-time
 *           example: "2026-06-10T15:00:00.000Z"
 *
 *         fechaHoraFin:
 *           type: string
 *           format: date-time
 *           example: "2026-06-10T15:30:00.000Z"
 *
 *         estado:
 *           type: string
 *           enum:
 *             - DISPONIBLE
 *             - RESERVADO
 *             - CONFIRMADO
 *             - CANCELADO
 *             - REALIZADO
 *           example: "DISPONIBLE"
 *
 *         fechaHoraSolicitada:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *
 *         costo:
 *           type: number
 *           nullable: true
 *           example: null
 *
 *         historialEstados:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 example: "DISPONIBLE"
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-01T10:00:00.000Z"
 *               motivo:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
