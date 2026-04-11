export class Notificacion {
    id;
    destinatario;
    remitente;
    mensaje;
    fechaHoraCreacion;
    fechaHoraLeida;
    leida;

    constructor(id, destinatario, remitente, mensaje, fechaHoraCreacion, fechaHoraLeida, leida) {
        //TODO
    }

    marcarComoLeida(){
        //TODO
        this.leida = true;
    }
}