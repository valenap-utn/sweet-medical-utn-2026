import {AppException} from "./AppException.js";

export class PracticaInvalida extends AppException {
    constructor(mensaje) {
        super(`Práctica inválida: ${mensaje}`, "Práctica creada inválida");
    }
}