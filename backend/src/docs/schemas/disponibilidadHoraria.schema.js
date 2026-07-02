/**
 * @swagger
 * components:
 *   schemas:
 *
 *     DisponibilidadHoraria:
 *       type: object
 *
 *       properties:
 *         diaSemana:
 *           type: string
 *           enum:
 *             - LUNES
 *             - MARTES
 *             - MIERCOLES
 *             - JUEVES
 *             - VIERNES
 *             - SABADO
 *             - DOMINGO
 *
 *         horaDesde:
 *           type: string
 *           example: "08:00"
 *
 *         horaHasta:
 *           type: string
 *           example: "12:00"
 *
 *       required:
 *         - diaSemana
 *         - horaDesde
 *         - horaHasta
 */