import {AppException} from "./AppException.js";

export class TurnoInvalido extends AppException {
    constructor(mensaje) {
        super(`Turno inválido: ${mensaje}`, "Turno creado inválido");
    }
}
