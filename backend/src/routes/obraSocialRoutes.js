import express from "express";
import {ObraSocialController} from "../controllers/ObraSocialController.js";

export default function obraSocialRoutes(getController){
    const router = express.Router();
    const obraSocialController = getController(ObraSocialController);

    router.post('/', obraSocialController.crear);

    router.get('/', obraSocialController.obtenerTodas);

    router.patch('/:obraSocialId/planes/:planId', obraSocialController.agregarPlan);

    router.get('/:obraSocialId/planes', obraSocialController.obtenerPlanes);

    router.delete('/:obraSocialId/planes/:planId', obraSocialController.quitarPlan);

    router.delete('/:obraSocialId', obraSocialController.eliminar);

    return router;
}
