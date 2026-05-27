import { PlanService } from "../services/PlanService.js";

const planService = new PlanService();

export async function crearPlan(req, res, next) {
    try {
        const { nombre, obraSocialId } = req.body;
        const plan = await planService.crearPlan(nombre, obraSocialId);
        res.status(201).json(plan);
    } catch (err) {
        next(err);
    }
}

export async function obtenerPlanPorId(req, res, next) {
    try {
        const plan = await planService.obtenerPlanPorId(req.params.id);
        res.json(plan);
    } catch (err) {
        next(err);
    }
}

export async function listarPlanes(req, res, next) {
    try {
        const { obraSocialId } = req.query;
        const planes = await planService.listarPlanes(obraSocialId);
        res.json(planes);
    } catch (err) {
        next(err);
    }
}

export async function agregarCoberturaEspecialidad(req, res, next) {
    try {
        const { especialidadId, nivel } = req.body;
        const plan = await planService.agregarCoberturaEspecialidad(req.params.id, especialidadId, nivel);
        res.json(plan);
    } catch (err) {
        next(err);
    }
}

export async function agregarCoberturaPractica(req, res, next) {
    try {
        const { practicaId, nivel } = req.body;
        const plan = await planService.agregarCoberturaPractica(req.params.id, practicaId, nivel);
        res.json(plan);
    } catch (err) {
        next(err);
    }
}

export async function quitarCoberturaEspecialidad(req, res, next) {
    try {
        const { id, especialidadId } = req.params;
        const plan = await planService.quitarCoberturaEspecialidad(id, especialidadId);
        res.json(plan);
    } catch (err) {
        next(err);
    }
}

export async function quitarCoberturaPractica(req, res, next) {
    try {
        const { id, practicaId } = req.params;
        const plan = await planService.quitarCoberturaPractica(id, practicaId);
        res.json(plan);
    } catch (err) {
        next(err);
    }
}
