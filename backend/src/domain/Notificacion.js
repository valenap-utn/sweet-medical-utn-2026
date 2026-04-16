import {NotificacionInvalida} from "../exceptions/NotificacionInvalida.js";
import {LocalDateTime} from "@js-joda/core";

export class Notificacion {
    id;
    destinatario;
    remitente;
    mensaje;
    fechaHoraCreacion;
    fechaHoraLeida;
    leida;

    constructor(id, destinatario, remitente, mensaje, fechaHoraLeida) {
        this.validarParametros(id, destinatario, remitente, mensaje, fechaHoraLeida);
        this.id = id;
        this.destinatario = destinatario;
        this.remitente = remitente;
        this.mensaje = mensaje;
        this.fechaHoraCreacion = LocalDateTime.now();
        this.leida = false;
    }

    validarParametros(id, destinatario, remitente, mensaje) {
        if ([id, destinatario, remitente, mensaje].some(v => !v)) {
            throw new NotificacionInvalida(`La notificación id, destinatario, remitente, mensaje.\n
                Se recibió destinatario: ${destinatario}, remitente: ${remitente}, mensaje: ${mensaje}`);
        }
    }

    marcarComoLeida(){
        this.fechaHoraLeida = LocalDateTime.now();
        this.leida = true;
    }
}