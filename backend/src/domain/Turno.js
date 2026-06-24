import {TurnoInvalido} from "../exceptions/TurnoInvalido.js";
import {CambioEstadoTurno} from "./CambioEstadoTurno.js";
import {EstadoTurno} from "./enums/EstadoTurno.js";
import {TipoServicio} from "./enums/TipoServicio.js";

export class Turno {
    medico;
    paciente; // null si está dispo.

    sede;
    tipoServicio;
    servicio;

    fechaHoraInicio;
    fechaHoraFin;
    estado; // DISPONIBLE, RESERVADO, CANCELADO, REALIZADO
    historialEstados;

    fechaHoraSolicitada; // por si solicitan cambio de horario
    costo; // costo final calculado al momento de reservar

    constructor({
                    id = null, // Se agrega para soportar la asignación delegada a Mongo
                    medico, paciente = null, sede, servicio = null,
                    fechaHoraInicio, fechaHoraFin, fechaHoraSolicitada = null,
                    estado = EstadoTurno.DISPONIBLE.nombre, costo = null, historialEstados = []
                } = {}) {

        this.validarParametros({
            medico,
            sede,
            servicio,
            fechaHoraInicio,
            fechaHoraFin,
            estado
        });

        this.id = id; // Si viene de la base de datos tendrá valor; si viene de la Agenda será null
        this.medico = medico;
        this.paciente = paciente;
        this.sede = sede;
        this.servicio = servicio
        this.fechaHoraInicio = fechaHoraInicio;
        this.fechaHoraFin = fechaHoraFin;
        this.estado = estado;
        this.fechaHoraSolicitada = fechaHoraSolicitada;
        this.costo = costo;
        this.historialEstados = Array.isArray(historialEstados) ? historialEstados : [];
    }

    validarParametros({medico, sede, tipoServicio, servicio, fechaHoraInicio, fechaHoraFin, estado}) {
        if (!medico || !sede || !fechaHoraInicio || !fechaHoraFin || !estado || !servicio) {
            throw new TurnoInvalido("El turno necesita médico, sede, servicio, fechaHoraInicio, fechaHoraFin y estado.");
        }
    }

    reservar({paciente, costo, turnoId = null}) {
        if (this.estado !== EstadoTurno.DISPONIBLE.nombre) throw new TurnoInvalido("Solo se pueden reservar turnos disponibles.");
        if (!paciente) throw new TurnoInvalido("Para reservar un turno se necesita un paciente.")

        this.paciente = paciente;
        this.costo = costo;
        this.actualizarEstado({
            nuevoEstado: EstadoTurno.RESERVADO.nombre,
            usuario: paciente,
            motivo: "Reserva de Turno",
            turnoId,
        });
    }

    actualizarEstado({nuevoEstado, usuario, motivo, turnoId = null}) {
        this.estado = nuevoEstado;
        const updateEstado = new CambioEstadoTurno({
            fechaHoraIngreso: new Date(),
            estado: nuevoEstado,
            turno: turnoId || this.id, // Si no se pasa explícitamente, usa el de la propia instancia
            usuario: usuario,
            motivo: motivo
        });
        this.historialEstados.push(updateEstado); // Trazabilidad completa
    }
}
