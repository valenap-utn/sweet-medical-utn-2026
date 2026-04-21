import { Turno } from '../Turno.js';
import { EstadoTurno } from '../enums/EstadoTurno.js';
import { DiaSemana } from '../enums/DiaSemana.js';

/**
 * Agenda: genera y refresca turnos disponibles para un médico.
 *
 * Reglas de generación:
 *  - Se generan turnos desde HOY hasta 30 días hacia adelante.
 *  - Se respeta la disponibilidad horaria (DiaSemana, horaDesde, horaHasta).
 *  - La duración de cada slot se toma de la especialidad/práctica.
 *  - Los turnos generados quedan en estado DISPONIBLE.
 */
export class Agenda {

    /**
     * Genera turnos para una especialidad y un médico.
     * @param {Especialidad} especialidad
     * @param {Medico} medico
     * @returns {Turno[]}
     */
    generarTurnosPara(especialidad, medico) {
        return this._generarTurnos({
            servicio: especialidad,
            duracionMins: especialidad.duracionTurnoEnMins,
            costo: especialidad.costoConsulta,
            medico,
        });
    }


     //Genera turnos para una práctica y un médico.
    generarTurnosPara(practica, medico) {
        return this._generarTurnos({
            servicio: practica,
            duracionMins: practica.duracionTurnoEnMins,
            costo: practica.costo,
            medico,
        });
    }

     //Refresca la lista de turnos de un médico según su disponibilidad actual.
    refrescarTurnosSegunDisponibilidadDe(medico) {
        const ahora = new Date();

        // Separamos los turnos que no se pueden tocar
        const turnosAMantener = medico.turnosExistentes?.filter(turno => {
            const esPasado = new Date(turno.fechaHora) < ahora;
            const esFuturoReservado =
                new Date(turno.fechaHora) >= ahora &&
                turno.estado.nombre !== EstadoTurno.DISPONIBLE.nombre;
            return esPasado || esFuturoReservado;
        }) ?? [];

        const turnosAEliminar = medico.turnosExistentes?.filter(turno => {
            const esFuturo = new Date(turno.fechaHora) >= ahora;
            return esFuturo && turno.estado.nombre === EstadoTurno.DISPONIBLE.nombre;
        }) ?? [];

        // Regeneramos los turnos futuros según la nueva disponibilidad
        const turnosNuevos = [];
        for (const especialidad of medico.especialidades) {
            turnosNuevos.push(...this.generarTurnosPara(especialidad, medico));
        }
        for (const practica of medico.practicas) {
            turnosNuevos.push(...this.generarTurnosPara(practica, medico));
        }

        // Filtramos los nuevos para no duplicar los que ya se mantienen
        const fechasMantenidas = new Set(
            turnosAMantener.map(t => `${t.fechaHora}-${t.practica?.id ?? 'esp'}`)
        );
        const turnosACrear = turnosNuevos.filter(
            t => !fechasMantenidas.has(`${t.fechaHora}-${t.practica?.id ?? 'esp'}`)
        );

        return { eliminar: turnosAEliminar, crear: turnosACrear };
    }

    // ─── privados ────────────────────────────────────────────────────────────

    /**
     * Núcleo de la generación de turnos.
     * Itera 30 días hacia adelante y, por cada día que coincide con alguna
     * DisponibilidadHoraria del médico, crea slots del tamaño indicado.
     */
    _generarTurnos({ servicio, duracionMins, costo, medico }) {
        const turnos = [];
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const DIAS_ANTICIPACION = 30;

        for (let i = 0; i <= DIAS_ANTICIPACION; i++) {
            const fecha = new Date(hoy);
            fecha.setDate(hoy.getDate() + i);
            
            const nombreDia = this._nombreDiaSemanaES(fecha.getDay());

            // Buscar disponibilidades que apliquen a este día
            const disponibilidadesDelDia = medico.disponibilidades.filter(
                d => d.diaSemana.toString().toUpperCase() === nombreDia.toUpperCase()
            );

            for (const disponibilidad of disponibilidadesDelDia) {
                const slots = this._generarSlots(
                    fecha,
                    disponibilidad.horaDesde,
                    disponibilidad.horaHasta,
                    duracionMins
                );

                for (const slotFecha of slots) {
                    const turno = Turno.build();
                    turno.medico = medico;
                    turno.paciente = null;
                    turno.fechaHora = slotFecha;
                    turno.sede = medico.sedes[0] ?? null; 
                    turno.practica = servicio;
                    turno.estado = EstadoTurno.DISPONIBLE;
                    turno.costo = costo;
                    turno.historialEstados = [];
                    turnos.push(turno);
                }
            }
        }

        return turnos;
    }

     // Genera los datetime de inicio de cada turno dentro de un bloque horario.
    _generarSlots(fecha, horaDesde, horaHasta, duracionMins) {
        const slots = [];

        const [hDesde, mDesde] = horaDesde.split(':').map(Number);
        const [hHasta, mHasta] = horaHasta.split(':').map(Number);

        let actual = new Date(fecha);
        actual.setHours(hDesde, mDesde, 0, 0);

        const fin = new Date(fecha);
        fin.setHours(hHasta, mHasta, 0, 0);

        while (actual < fin) {
            const siguiente = new Date(actual.getTime() + duracionMins * 60_000);
            if (siguiente > fin) break;
            slots.push(new Date(actual));
            actual = siguiente;
        }

        return slots;
    }
}
