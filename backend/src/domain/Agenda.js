import {Turno} from "./Turno.js";
import {EstadoTurno} from "./enums/EstadoTurno.js";
import {TipoServicio} from "./enums/TipoServicio.js";
import {addMinutes, isBefore, isEqual} from "date-fns";
import {BadRequestError} from "../error/AppError.js";

export class Agenda {
    constructor(medico) {
        if (!medico) {
            throw new Error("La agenda debe estar asociada a un Médico");
        }
        this.medico = medico;
        this.turnos = [];
    }

    //Refresca la agenda basándose en cambios de disponibilidad
    //Elimina turnos futuros DISPONIBLES que ya no coincidan con la nueva disponibilidad.
    refrescarTurnos() {
        const ahora = new Date();

        this.turnos = this.turnos.filter(turno => {
            const esPasado = isBefore(turno.fechaHoraInicio, ahora);
            const noEstaDisponible = turno.estado !== EstadoTurno.DISPONIBLE.nombre;

            if (esPasado || noEstaDisponible) {
                return true;
            }

            return this.verificarSiCoincideConDisponibilidad(turno); // Si ya no coincide, devuelve false y se elimina
        });
    }

    //Recorre todas las fechas del rango que coinciden con el día de la disponibilidad
    // Genera turnos para todos los días 'X' comprendidos entre fechaDesde y fechaHasta
    generarTurnos(fechaDesde, fechaHasta, disponibilidad, servicio) {
        const fechas = this.obtenerFechasDelDiaSemana(fechaDesde, fechaHasta, disponibilidad.diaSemana);

        /*console.log("Disponibilidad:", disponibilidad);
        console.log("Servicio:", servicio);
        console.log("Fechas encontradas:", fechas);*/

        for (const fecha of fechas) {
            this.generarTurnosParaFecha(fecha, disponibilidad, servicio);
        }
    }

    // Genera los turnos de una fecha específica
    // Si sobra tiempo que no alcanza para completar otro turno
    // => el espacio queda libre y NO se genera un turno parcial
    generarTurnosParaFecha(fecha, disponibilidad, servicio) {
        const duracionTurnoEnMins = servicio.duracionTurnoEnMins;
        if (!duracionTurnoEnMins) throw new BadRequestError("El servicio debe tener duración de turno en minutos.");

        /*console.log("Servicio en Agenda:", servicio);
        console.log("Duración:", servicio?.duracionTurnoEnMins);*/

        let inicio = this.combinarFechaYHora(fecha, disponibilidad.horaDesde);
        const finDisponibilidad = this.combinarFechaYHora(fecha, disponibilidad.horaHasta);

        // Mientras el próximo turno entre completamente dentro de la disponibilidad
        while (isBefore(addMinutes(inicio, duracionTurnoEnMins), finDisponibilidad) ||
        isEqual(addMinutes(inicio, duracionTurnoEnMins), finDisponibilidad)) {

            const fin = addMinutes(inicio, duracionTurnoEnMins);

            if (!this.existeTurnoEnEseHorario(inicio, fin)) {
                this.turnos.push(this.crearTurnoDesdeDisponibilidad({
                    disponibilidad,
                    servicio,
                    fechaHoraInicio: inicio,
                    fechaHoraFin: fin,
                }));
            }
            inicio = fin;
        }
    }
    // Ejemplo: Disponibilidad: 10:00 a 12:00 && Duración del servicio en mins.: 30
    // => Se generan turnos para ese servicio 'X': 10:00-10:30 && 10:30-11:00 && 11:00-11:30 && 11:30-12:00



    // Utilizado durante la regeneración de la agenda
    // Determina si un turno DISPO. existente sigue siendo válido según disponibilidades del médico
    // Si una disponibilidad fue eliminada o modificada, los turnos futuros que ya no encajan serán eliminados
    verificarSiCoincideConDisponibilidad(turno) {
        const nombreDiaTurno = this.obtenerNombreDiaSemana(turno.fechaHoraInicio);

        const disponibilidadesEseDia = this.medico.disponibilidades?.filter(
            disp => disp.diaSemana === nombreDiaTurno
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


    /* ===== FUNCIONES AUXILIARES =================================================================================== */


    // Convierte una disponibilidad concreta en un Turno
    // Cada disponibilidad genera únicamente turnos para su propio servicio
    crearTurnoDesdeDisponibilidad({disponibilidad, servicio, fechaHoraInicio, fechaHoraFin}) {
        const turno = new Turno({
            medico: this.medico._id ?? this.medico.id,
            paciente: null,
            sede: disponibilidad.sede,
            tipoServicio: disponibilidad.tipoServicio,
            especialidad: disponibilidad.tipoServicio === TipoServicio.ESPECIALIDAD ? servicio : null,
            practica: disponibilidad.tipoServicio === TipoServicio.PRACTICA ? servicio : null,
            fechaHoraInicio: fechaHoraInicio,
            fechaHoraFin: fechaHoraFin,
            estado: EstadoTurno.DISPONIBLE.nombre,
            costo: null,
            historialEstados: []
        });
        turno.esNuevo = true;
        return turno;
    }

    combinarFechaYHora(fecha, horaDesde) {
        const [horas, minutos] = horaDesde.split(":").map(Number);

        const fechaConHora = new Date(fecha);
        fechaConHora.setHours(horas, minutos, 0, 0);

        return fechaConHora;
    }

    // Evita generar turnos duplicados o superpuestos
    existeTurnoEnEseHorario(inicio, fin) {
        return this.turnos.some(t => {
            const inicioExistente = new Date(t.fechaHoraInicio);
            const finExistente = new Date(t.fechaHoraFin);

            return inicio < finExistente && inicioExistente < fin;
        });
    }

    obtenerFechasDelDiaSemana(fechaDesde, fechaHasta, diaSemana) {
        const fechas = [];
        let fechaActual = new Date(fechaDesde);

        while (isBefore(fechaActual, fechaHasta) || isEqual(fechaActual, fechaHasta)) {
            if (this.obtenerNombreDiaSemana(fechaActual) === diaSemana) {
                fechas.push(new Date(fechaActual));
            }
            fechaActual.setDate(fechaActual.getDate() + 1);
        }
        return fechas;
    }

    // Devuelve todas las fechas del rango que coinciden con el día solicitado
    obtenerNombreDiaSemana(fecha) {
        const diasSemana = [
            "Domingo",
            "Lunes",
            "Martes",
            "Miercoles",
            "Jueves",
            "Viernes",
            "Sabado"
        ];
        return diasSemana[fecha.getDay()];
    }
}