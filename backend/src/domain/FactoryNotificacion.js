import { Notificacion } from "./Notificacion.js";

export class FactoryNotificacion {
    crearSegunEstadoTurno(turno){
        //TODO
        const notificacion = new Notificacion();

        switch(turno.estado){
            case 'RESERVADO':
                notificacion.destinatario = turno.medico;
                notificacion.remitente = turno.paciente;
                notificacion.mensaje = `Recibiste una reserva de ${turno.practica.nombre} para el ${turno.fechaHora}`;
                break;
            case 'CONFIRMADO':
                notificacion.destinatario = turno.paciente;
                notificacion.remitente = turno.medico;
                notificacion.mensaje = `Tu reserva de ${turno.practica.nombre} para el ${turno.fechaHora} fue recibida`;
                break;
            case 'CANCELADO':
                notificacion.remitente = turno.historialEstados[turno.historialEstados.length - 1].usuario;
                turno.historialEstados[turno.historialEstados.length - 1].usuario == turno.medico ? notificacion.destinatario = turno.paciente : notificacion.destinatario = turno.medico;
                notificacion.mensaje = `Tu reserva de ${turno.practica.nombre} para el ${turno.fechaHora} fue cancelada`;
                break;
            default://Si es DISPONIBLE o REALIZADO no enviamos notificacion
                return null;
        }

        return notificacion;
    }
}
