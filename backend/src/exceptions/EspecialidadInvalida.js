import {AppException} from "./AppException.js";


export class EspecialidadInvalida extends AppException {
    constructor(mensaje) {
        super(`Especialidad inválida: ${mensaje}`, "Especialidad creada inválida");
    }
}