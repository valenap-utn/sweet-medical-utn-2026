import {AppException} from "./AppException.js";

export class ServicioInvalido extends AppException {
    constructor(mensaje) {
        super(`Servicio inválido: ${mensaje}`, "Servicio creado inválido");
    }
}