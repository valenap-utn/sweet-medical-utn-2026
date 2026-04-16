import {AppException} from "./AppException.js";

export class CoberturaInvalida extends AppException{
    constructor(mensaje) {
        super(`Cobertura inválida: ${mensaje}`, "Cobertura no encontrada");
    }
}