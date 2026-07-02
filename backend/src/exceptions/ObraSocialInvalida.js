import {AppException} from "./AppException.js";

export class ObraSocialInvalida extends AppException {
    constructor(mensaje) {
        super(`Obra social inválida: ${mensaje}`, "Obra social creada inválida");
    }
}