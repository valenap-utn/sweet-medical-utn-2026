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

    /**
     * Refresca y genera los turnos en un rango de fechas.
     * @param {Date} fechaDesde
     * @param {Date} fechaHasta
     * @param {Array} servicios - Lista de Especialidades o Prácticas a generar
     */
    generarYRefrescarTurnos(fechaDesde, fechaHasta, servicios) {
        const ahora = new Date();

        // 1. Limpieza: Mantener solo los turnos pasados u ocupados (RESERVADOS/CONFIRMADOS)
        this.turnos = this.turnos.filter(turno => {
            const esPasado = isBefore(turno.fechaHoraInicio, ahora);
            const estaOcupado = turno.estado !== EstadoTurno.DISPONIBLE;
            return esPasado || estaOcupado;
        });

        // 2. Recorrer el rango de fechas día por día usando date-fns
        let fechaActual = new Date(fechaDesde);
        const finRango = new Date(fechaHasta);

        const diasSemana = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];

        while (!isAfter(fechaActual, finRango)) {
            // Sacamos lo que no va: se resuelve el nombre del día directamente indexando el array
            const nombreDia = diasSemana[fechaActual.getDay()];

            // Filtrar las disponibilidades del médico para el día actual
            const disponibilidadesHoy = this.medico.disponibilidades?.filter(
                disp => disp.diaSemana.toString() === nombreDia
            ) || [];

            for (const disp of disponibilidadesHoy) {
                for (const servicio of servicios) {

                    // Identificar dinámicamente si es Práctica o Especialidad
                    const esPractica = servicio.codigo !== undefined;
                    const tipoServicio = esPractica ? TipoServicio.PRACTICA : TipoServicio.ESPECIALIDAD;
                    const duracionMins = servicio.duracionTurnoEnMins;
                    const costo = esPractica ? servicio.costo : servicio.costoConsulta;

                    // Generar bloques horarios para la jornada
                    const bloques = this._generarBloques(fechaActual, disp.horaDesde, disp.horaHasta, duracionMins);

                    for (const bloque of bloques) {
                        const nuevoTurno = new Turno({
                            medico: this.medico,
                            paciente: null,
                            sede: this.medico.sedes?.[0] || null,
                            tipoServicio: tipoServicio,
                            especialidad: !esPractica ? servicio : null,
                            practica: esPractica ? servicio : null,
                            fechaHoraInicio: bloque.inicio,
                            fechaHoraFin: bloque.fin,
                            estado: EstadoTurno.DISPONIBLE,
                            costo: costo
                        });

                        // Control de solapamientos antes de insertar
                        if (!this._existeSolapamiento(nuevoTurno)) {
                            this.turnos.push(nuevoTurno);
                        }
                    }
                }
            }

            // Avanzar al siguiente día de forma funcional
            fechaActual = addDays(fechaActual, 1);
        }
    }

    _generarBloques(fechaBase, horaDesde, horaHasta, duracionMins) {
        const bloques = [];
        const [hDesde, mDesde] = horaDesde.split(':').map(Number);
        const [hHasta, mHasta] = horaHasta.split(':').map(Number);

        let inicioBloque = new Date(fechaBase);
        inicioBloque.setHours(hDesde, mDesde, 0, 0);

        const finDisponibilidad = new Date(fechaBase);
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

    _existeSolapamiento(nuevoTurno) {
        return this.turnos.some(turnoExistente => {
            const inicioA = nuevoTurno.fechaHoraInicio.getTime();
            const finA = nuevoTurno.fechaHoraFin.getTime();
            const inicioB = turnoExistente.fechaHoraInicio.getTime();
            const finB = turnoExistente.fechaHoraFin.getTime();

            return inicioA < finB && finA > inicioB;
        });
    }
}