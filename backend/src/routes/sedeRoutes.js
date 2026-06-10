import express from "express";
import {SedeController} from "../controllers/SedeController.js";

export default function sedeRoutes(getController) {
    const router = express.Router();
    const sedeController = getController(SedeController);

    router.post('/', sedeController.create);

    router.get('/', sedeController.findAll);

    router.delete('/:sedeId', sedeController.delete);

    return router;
}
