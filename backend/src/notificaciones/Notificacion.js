import { NotificacionInvalida } from "../exceptions/NotificacionInvalida.js";
import { LocalDateTime } from "@js-joda/core";

export const TipoNotificacion = Object.freeze({
    DONACION_ASIGNADA:              "DONACION_ASIGNADA",
    MISION_COMPLETADA:              "MISION_COMPLETADA",
    CATEGORIA_SUBIDA:               "CATEGORIA_SUBIDA",
    DONACION_ENTREGADA:             "DONACION_ENTREGADA",
    DONACION_ASIGNADA_BENEFICIARIA: "DONACION_ASIGNADA_BENEFICIARIA",
    ENTREGA_CONFIRMADA:             "ENTREGA_CONFIRMADA",
});

export class Notificacion {
    id;
    usuarioDestinatarioId;
    mensaje;
    tipo;
    fechaHoraCreacion;
    fechaHoraLeida;
    leida;

    /**
     * @param {string} id
     * @param {string} usuarioDestinatarioId
     * @param {string} mensaje
     * @param {string} tipo - ver TipoNotificacion
     */
    constructor(id, usuarioDestinatarioId, mensaje, tipo) {
        this.validarParametros(id, usuarioDestinatarioId, mensaje, tipo);
        this.id = id;
        this.usuarioDestinatarioId = usuarioDestinatarioId;
        this.mensaje = mensaje;
        this.tipo = tipo;
        this.fechaHoraCreacion = LocalDateTime.now();
        this.leida = false;
        this.fechaHoraLeida = null;
    }

    validarParametros(id, usuarioDestinatarioId, mensaje, tipo) {
        if ([id, usuarioDestinatarioId, mensaje, tipo].some(v => !v)) {
            throw new NotificacionInvalida(
                `Los campos id, usuarioDestinatarioId, mensaje y tipo son obligatorios. ` +
                `Se recibió: id=${id}, destinatario=${usuarioDestinatarioId}, mensaje=${mensaje}, tipo=${tipo}`
            );
        }
        if (!Object.values(TipoNotificacion).includes(tipo)) {
            throw new NotificacionInvalida(`Tipo de notificación inválido: ${tipo}`);
        }
    }

    marcarComoLeida() {
        if (this.leida) return;
        this.fechaHoraLeida = LocalDateTime.now();
        this.leida = true;
    }
}