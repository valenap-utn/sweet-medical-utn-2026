import express from "express";
import {
    crearPlan,
    obtenerPlanPorId,
    listarPlanes,
    agregarCoberturaEspecialidad,
    agregarCoberturaPractica,
    quitarCoberturaEspecialidad,
    quitarCoberturaPractica
} from "../controllers/PlanController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Planes
 *   description: API para la gestión de Planes de Cobertura y Obra Social
 */

/**
 * @swagger
 * /api/plan:
 *   post:
 *     summary: Crear un nuevo plan de cobertura
 *     tags: [Planes]
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
 *                 example: Plan Platinum 410
 *               obraSocialId:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c85
 *     responses:
 *       201:
 *         description: Plan creado con éxito
 *       400:
 *         description: Error en los parámetros enviados
 *   get:
 *     summary: Listar todos los planes
 *     tags: [Planes]
 *     parameters:
 *       - in: query
 *         name: obraSocialId
 *         schema:
 *           type: string
 *         description: Filtrar planes asociados a una obra social específica
 *     responses:
 *       200:
 *         description: Listado de planes obtenido
 */
router.post("/", crearPlan);
router.get("/", listarPlanes);

/**
 * @swagger
 * /api/plan/{id}:
 *   get:
 *     summary: Obtener un plan por su ID
 *     tags: [Planes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del plan
 *       404:
 *         description: Plan no encontrado
 */
router.get("/:id", obtenerPlanPorId);

/**
 * @swagger
 * /api/plan/{id}/especialidades:
 *   patch:
 *     summary: Agregar o actualizar cobertura de una especialidad en el plan
 *     tags: [Planes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - especialidadId
 *               - nivel
 *             properties:
 *               especialidadId:
 *                 type: string
 *               nivel:
 *                 type: string
 *                 enum: [TOTAL, PARCIAL, NO_CUBIERTA]
 *     responses:
 *       200:
 *         description: Cobertura agregada/actualizada con éxito
 */
router.patch("/:id/especialidades", agregarCoberturaEspecialidad);

/**
 * @swagger
 * /api/plan/{id}/practicas:
 *   patch:
 *     summary: Agregar o actualizar cobertura de una práctica en el plan
 *     tags: [Planes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - practicaId
 *               - nivel
 *             properties:
 *               practicaId:
 *                 type: string
 *               nivel:
 *                 type: string
 *                 enum: [TOTAL, PARCIAL, NO_CUBIERTA]
 *     responses:
 *       200:
 *         description: Cobertura agregada/actualizada con éxito
 */
router.patch("/:id/practicas", agregarCoberturaPractica);

/**
 * @swagger
 * /api/plan/{id}/especialidades/{especialidadId}:
 *   delete:
 *     summary: Remover cobertura de especialidad del plan
 *     tags: [Planes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: especialidadId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cobertura removida con éxito
 */
router.delete("/:id/especialidades/:especialidadId", quitarCoberturaEspecialidad);

/**
 * @swagger
 * /api/plan/{id}/practicas/{practicaId}:
 *   delete:
 *     summary: Remover cobertura de práctica del plan
 *     tags: [Planes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: practicaId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cobertura removida con éxito
 */
router.delete("/:id/practicas/:practicaId", quitarCoberturaPractica);

export default router;

