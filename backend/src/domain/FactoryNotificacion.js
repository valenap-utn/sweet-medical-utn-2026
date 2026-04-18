import { Notificacion } from "./Notificacion.js";

/**
 * FactoryNotificacion: crea la notificación correcta según el estado actual del turno.
 *
 * Reglas del Tech Lead:
 *  - RESERVADO  → se notifica al MÉDICO (paciente reservó)
 *  - CONFIRMADO → se notifica al PACIENTE (médico aceptó)
 *  - CANCELADO  → se notifica a la CONTRAPARTE (quien canceló notifica al otro)
 *  - Recordatorio (se llama explícitamente) → se notifica a ambos
 */
export class FactoryNotificacion {

    crearSegunEstadoTurno(turno) {
        const estadoNombre = turno.estado?.nombre?.toUpperCase() ?? turno.estado;

        switch (estadoNombre) {
            case 'RESERVADO':
                return this._notificacionReservado(turno);

            case 'CONFIRMADO':
                return this._notificacionConfirmado(turno);

            case 'CANCELADO':
                return this._notificacionCancelado(turno);

            default:
                return null;
        }
    }

    /**
     * Recordatorio del día previo: se envían DOS notificaciones (paciente y médico).
     * @returns {Notificacion[]}
     */
    crearRecordatorios(turno) {
        const servicio = turno.practica?.nombre ?? 'consulta';
        const fechaFormateada = this._formatearFecha(turno.fechaHora);

        const aPaciente = new Notificacion(
            `rec-pac-${turno.id}`,
            turno.paciente.usuario,
            turno.medico.usuario,
            `Recordatorio: mañana tenés turno de ${servicio} a las ${fechaFormateada}.`
        );

        const aMedico = new Notificacion(
            `rec-med-${turno.id}`,
            turno.medico.usuario,
            turno.paciente.usuario,
            `Recordatorio: mañana tenés turno con ${turno.paciente.nombre} — ${servicio} a las ${fechaFormateada}.`
        );

        return [aPaciente, aMedico];
    }

    // ─── privados ─────────────────────────────────────────────────────────────

    _notificacionReservado(turno) {
        const servicio = turno.practica?.nombre ?? 'consulta';
        const fechaFormateada = this._formatearFecha(turno.fechaHora);

        return new Notificacion(
            `notif-${Date.now()}`,
            turno.medico.usuario,          // destinatario: el médico
            turno.paciente.usuario,        // remitente: el paciente
            `Nueva reserva: ${turno.paciente.nombre} solicitó un turno de ${servicio} para el ${fechaFormateada}.`
        );
    }

    _notificacionConfirmado(turno) {
        const servicio = turno.practica?.nombre ?? 'consulta';
        const fechaFormateada = this._formatearFecha(turno.fechaHora);

        return new Notificacion(
            `notif-${Date.now()}`,
            turno.paciente.usuario,        // destinatario: el paciente
            turno.medico.usuario,          // remitente: el médico
            `Tu turno de ${servicio} para el ${fechaFormateada} fue confirmado por el Dr. ${turno.medico.nombre}.`
        );
    }

    _notificacionCancelado(turno) {
        // El último cambio de estado nos dice quién canceló
        const ultimoCambio = turno.historialEstados?.[turno.historialEstados.length - 1];
        const quienCancelo = ultimoCambio?.usuario ?? null;

        const servicio = turno.practica?.nombre ?? 'consulta';
        const fechaFormateada = this._formatearFecha(turno.fechaHora);

        // La notificación va a la contraparte
        const esMedicoQuienCancela =
            quienCancelo &&
            turno.medico.usuario &&
            quienCancelo === turno.medico.usuario;

        const destinatario = esMedicoQuienCancela
            ? turno.paciente.usuario
            : turno.medico.usuario;

        const remitente = esMedicoQuienCancela
            ? turno.medico.usuario
            : turno.paciente.usuario;

        const motivo = ultimoCambio?.motivo ? ` Motivo: ${ultimoCambio.motivo}.` : '';

        return new Notificacion(
            `notif-${Date.now()}`,
            destinatario,
            remitente,
            `El turno de ${servicio} del ${fechaFormateada} fue cancelado.${motivo}`
        );
    }

    _formatearFecha(fechaHora) {
        if (!fechaHora) return 'fecha a confirmar';
        const d = new Date(fechaHora);
        return d.toLocaleString('es-AR', {
            dateStyle: 'short',
            timeStyle: 'short',
        });
    }
}
