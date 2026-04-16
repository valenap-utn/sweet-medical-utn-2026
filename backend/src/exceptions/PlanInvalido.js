import {AppException} from "./AppException.js";

export class PlanInvalido extends AppException {
    constructor(mensaje) {
        super(`Plan inválido: ${mensaje}`, "Plan creado inválido");
    }
}