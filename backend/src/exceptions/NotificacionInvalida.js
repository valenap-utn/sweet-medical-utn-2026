import {AppException} from "./AppException.js";

export class NotificacionInvalida extends AppException {
    constructor(mensaje) {
        super(`Notificación inválida: ${mensaje}`, "Notificación creada inválida");
    }
}