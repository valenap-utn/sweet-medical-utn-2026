import { Turno } from "./Turno.js";
import { EstadoTurno } from "./enums/EstadoTurno.js";
import { TipoServicio } from "./enums/TipoServicio.js";
import { addDays, addMinutes, isBefore, isAfter } from "date-fns";

export class Agenda {
    constructor(medico) {
        if (!medico) {
            throw new Error("La agenda debe estar asociada a un Médico (Relación 1 a 1).");
        }
        this.medico = medico;
        this.turnos = []; // Relación 1 a * con Turno (Estado interno protegido)
    }

    //Refresca la agenda basándose en cambios de disponibilidad
    //Elimina turnos futuros DISPONIBLES que ya no coincidan con la nueva disponibilidad.
    refrescarTurnos() {
        const ahora = new Date();

        this.turnos = this.turnos.filter(turno => {
            const esPasado = isBefore(turno.fechaHoraInicio, ahora);
            const estaReservadoOConfirmado = turno.estado !== EstadoTurno.DISPONIBLE;

            if (esPasado || estaReservadoOConfirmado) {
                return true; // REGLA 1 y 2: Se mantienen intactos
            }

            const sigueSiendoValido = this._verificarSiCoincideConDisponibilidad(turno);

            return sigueSiendoValido; // Si ya no coincide, devuelve false y se "limpia" (elimina)
        });
    }

    //Crea bloques nuevos donde haya espacio vacio
    generarTurnos(fechaDesde, fechaHasta, servicio) {
        let fechaActual = new Date(fechaDesde);
        const finRango = new Date(fechaHasta);
        const diasSemana = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];

        while (!isAfter(fechaActual, finRango)) {
            const nombreDia = diasSemana[fechaActual.getDay()];
            const disponibilidadesHoy = this.medico.disponibilidades?.filter(
                disp => disp.diaSemana.toString() === nombreDia
            ) || [];

            for (const disp of disponibilidadesHoy) {
                const duracionMins = servicio.duracionTurnoEnMins;
                const bloques = this.generarBloques(fechaActual, disp.horaDesde, disp.horaHasta, duracionMins);

                for (const bloque of bloques) {
                    const nuevoTurno = this._crearInstanciaTurno(bloque, servicio);

                    if (!this.existeSolapamiento(nuevoTurno)) {
                        this.turnos.push(nuevoTurno);
                    }
                }
            }
            fechaActual = addDays(fechaActual, 1);
        }
    }

    generarBloques(fechaAGenerar, horaDesde, horaHasta, duracionMins) {
        const bloques = [];
        const [hDesde, mDesde] = horaDesde.split(':').map(Number);
        const [hHasta, mHasta] = horaHasta.split(':').map(Number);

        let inicioBloque = new Date(fechaAGenerar);
        inicioBloque.setHours(hDesde, mDesde, 0, 0);

        const finDisponibilidad = new Date(fechaAGenerar);
        finDisponibilidad.setHours(hHasta, mHasta, 0, 0);

        while (isBefore(inicioBloque, finDisponibilidad)) {
            const finBloque = addMinutes(inicioBloque, duracionMins);

            if (isAfter(finBloque, finDisponibilidad)) break;

            bloques.push({
                inicio: inicioBloque,
                fin: finBloque
            });

            inicioBloque = finBloque;
        }

        return bloques;
    }

    existeSolapamiento(nuevoTurno) {
        return this.turnos.some(turnoExistente => {
            const inicioA = nuevoTurno.fechaHoraInicio.getTime();
            const finA = nuevoTurno.fechaHoraFin.getTime();
            const inicioB = turnoExistente.fechaHoraInicio.getTime();
            const finB = turnoExistente.fechaHoraFin.getTime();

            return inicioA < finB && finA > inicioB;
        });
    }
}