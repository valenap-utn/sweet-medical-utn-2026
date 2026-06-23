import {Turno} from "./Turno.js";
import {EstadoTurno} from "./enums/EstadoTurno.js";
import {addDays, addMinutes, getDay, isAfter, isBefore, set} from "date-fns";
import {DiaSemana} from "./enums/DiaSemana.js";

export class Agenda {
    constructor(medico) {
        this.medico = medico;
        this.turnos = [];
    }

    //Refresca la agenda basándose en cambios de disponibilidad
    //Elimina turnos futuros DISPONIBLES que ya no coincidan con la nueva disponibilidad.
    regenerarTurnos() {
        const hoy = new Date();
        const ultimaFecha = [...this.turnos].sort((a, b) => new Date(a.fechaHoraFin) - new Date(b.fechaHoraFin)).at(-1)?.fechaHoraFin;
        const fechaHasta = ultimaFecha ? new Date(ultimaFecha) : addDays(hoy, 7);


        this.turnos = this.turnos.filter(turno => {

            const esPasado = isBefore(turno.fechaHoraInicio, hoy);

            const debeConservarse =
                turno.estado === EstadoTurno.RESERVADO.nombre ||
                turno.estado === EstadoTurno.CONFIRMADO.nombre ||
                turno.estado === EstadoTurno.REALIZADO.nombre;

            return esPasado || debeConservarse;
        });

        return this.generarTurnos(hoy, fechaHasta);
    }

    //Crea bloques nuevos donde haya espacio vacio
    generarTurnos() {
        const turnos= [];
        const fechaDesde = new Date();
        const fechaHasta = addDays(fechaDesde, 15);

        const dias = [
            DiaSemana.DOMINGO,
            DiaSemana.LUNES,
            DiaSemana.MARTES,
            DiaSemana.MIERCOLES,
            DiaSemana.JUEVES,
            DiaSemana.VIERNES,
            DiaSemana.SABADO
        ];
        let fechaActual = fechaDesde;

        while (!isAfter(fechaActual, fechaHasta)) {

            const disponibilidadesDelDia = this.medico.disponibilidades.filter(d => d.diaSemana === dias[getDay(fechaActual)]);

            disponibilidadesDelDia.forEach(disponibilidad => {

                const bloques = this.generarBloques(fechaActual, disponibilidad);

                bloques.forEach(bloque => {
                    if (!this.existeTurno(bloque.inicio, bloque.fin)) {
                        const turno = this.crearTurno(bloque, disponibilidad);
                        turnos.push(turno);
                    }
                });

            });

            fechaActual = addDays(fechaActual, 1);
        }

        return turnos;
    }

    generarBloques(fecha, disponibilidad) {
        const duracion = disponibilidad.servicio.duracionTurnoEnMins;

        const bloques = [];

        const [horaDesde, minutoDesde] = disponibilidad.horaDesde.split(":").map(Number);
        const [horaHasta, minutoHasta] = disponibilidad.horaHasta.split(":").map(Number);

        let inicio = set(fecha, {hours: horaDesde, minutes: minutoDesde, seconds: 0, milliseconds: 0});
        const finDisponibilidad = set(fecha, {hours: horaHasta, minutes: minutoHasta, seconds: 0, milliseconds: 0});

        while (true) {

            const fin = addMinutes(inicio, duracion);

            if (fin > finDisponibilidad) {
                break;
            }

            bloques.push({inicio: inicio, fin});
            inicio = fin;
        }

        return bloques;
    }

    existeTurno(inicio, fin) {
        return this.turnos.some(turno =>
            turno.fechaHoraInicio.getTime() === inicio.getTime() && turno.fechaHoraFin.getTime() === fin.getTime()
        );
    }

    // Buscar si el médico atiende ese día, y verificar que el horario del turno esté
    // dentro de la franja horaria de la nueva disponibilidad.
    verificarSiCoincideConDisponibilidad(turno) {
        const diasSemana = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
        const nombreDiaTurno = diasSemana[turno.fechaHoraInicio.getDay()];

        const disponibilidadesEseDia = this.medico.disponibilidades?.filter(
            disp => disp.diaSemana.toString() === nombreDiaTurno
        ) || [];

        if (disponibilidadesEseDia.length === 0) return false;

        for (const disp of disponibilidadesEseDia) {
            const [hDesde, mDesde] = disp.horaDesde.split(':').map(Number);
            const [hHasta, mHasta] = disp.horaHasta.split(':').map(Number);

            const inicioDisponibilidad = new Date(turno.fechaHoraInicio);
            inicioDisponibilidad.setHours(hDesde, mDesde, 0, 0);

            const finDisponibilidad = new Date(turno.fechaHoraInicio);
            finDisponibilidad.setHours(hHasta, mHasta, 0, 0);

            const empiezaDentro = turno.fechaHoraInicio.getTime() >= inicioDisponibilidad.getTime();
            const terminaDentro = turno.fechaHoraFin.getTime() <= finDisponibilidad.getTime();

            if (empiezaDentro && terminaDentro) {
                return true; // Encontramos una franja horaria que cubre este turno
            }
        }

        return false; // El turno no encajó en ninguna franja horaria válida para ese día
    }

    crearTurno(bloque, disponibilidad) {
        return new Turno({
            medico: this.medico._id,
            paciente: null,
            sede: disponibilidad.sede._id,
            servicio: disponibilidad.servicio._id,
            fechaHoraInicio: bloque.inicio,
            fechaHoraFin: bloque.fin,
            estado: EstadoTurno.DISPONIBLE.nombre,
            costo: disponibilidad.servicio.costo
        });
    }
}