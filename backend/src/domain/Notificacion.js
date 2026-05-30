import {NotificacionInvalida} from "../exceptions/NotificacionInvalida.js";

// Tipos de notificación según el ciclo de vida de un turno (Sweet Medical).
export const TipoNotificacion = Object.freeze({
    TURNO_RESERVADO: "TURNO_RESERVADO",          // al médico: paciente reservó
    TURNO_CONFIRMADO: "TURNO_CONFIRMADO",         // al paciente: médico aceptó
    TURNO_CANCELADO: "TURNO_CANCELADO",          // a la contraparte
    RECORDATORIO_TURNO: "RECORDATORIO_TURNO",       // a ambos, día previo
    CAMBIO_FECHA_PROPUESTO: "CAMBIO_FECHA_PROPUESTO",   // a la contraparte (requiere confirmación)
    TURNO_REALIZADO: "TURNO_REALIZADO",          // al paciente: turno marcado como realizado
});

export class Notificacion {
    id;
    destinatario;   // Usuario (quien recibe)
    remitente;      // Usuario (quien origina el evento)
    mensaje;
    tipo;
    fechaHoraCreacion;
    fechaHoraLeida;
    leida;

    constructor({id, destinatario, remitente, mensaje, tipo}) {
        this.validarParametros({id, destinatario, remitente, mensaje, tipo});
        this.id = id;
        this.destinatario = destinatario;
        this.remitente = remitente;
        this.mensaje = mensaje;
        this.tipo = tipo;
        this.fechaHoraCreacion = new Date();
        this.leida = false;
        this.fechaHoraLeida = null;
    }

    validarParametros({id, destinatario, remitente, mensaje, tipo}) {
        if ([id, destinatario, remitente, mensaje, tipo].some(v => !v)) {
            throw new NotificacionInvalida(
                `Los campos id, destinatario, remitente, mensaje y tipo son obligatorios. ` +
                `Se recibió: id=${id}, destinatario=${destinatario}, remitente=${remitente}, mensaje=${mensaje}, tipo=${tipo}`
            );
        }
        if (!Object.values(TipoNotificacion).includes(tipo)) {
            throw new NotificacionInvalida(`Tipo de notificación inválido: "${tipo}". Valores válidos: ${Object.values(TipoNotificacion).join(", ")}`);
        }
    }

    marcarComoLeida() {
        if (this.leida) return; // idempotente
        this.fechaHoraLeida = new Date();
        this.leida = true;
    }
}
