import {EspecialidadInvalida} from "../../exceptions/EspecialidadInvalida.js";

export class Especialidad {
    id;
    nombre;
    duracionTurnoEnMins;
    costoConsulta;

    constructor(id, nombre, duracionTurnoEnMins, costoConsulta) {
        this.validarParametros(id, nombre, duracionTurnoEnMins, costoConsulta);
        this.id = id;
        this.nombre = nombre;
        this.duracionTurnoEnMins = duracionTurnoEnMins;
        this.costoConsulta = costoConsulta;
    }

    validarParametros(id, nombre, duracionTurnoEnMins, costoConsulta) {
        if ([id, nombre, duracionTurnoEnMins, costoConsulta].some(v => !v)) {
            throw new EspecialidadInvalida(
                `La especialidad necesita id, nombre, duracion en minutos del turno, costo de la consulta.\n` +
                `Se recibió id: ${id}, nombre: ${nombre}, duracion: ${duracionTurnoEnMins}, costo: ${costoConsulta}`
            );
        }
    }

    establecerNuevoNombre(nuevoNombre) {
        if (nuevoNombre !== undefined) this.nombre = nuevoNombre;
    }

    establecerNuevaDuracion(nuevaDuracion) {
        if (nuevaDuracion !== undefined) this.duracionTurnoEnMins = nuevaDuracion;
    }

    establecerNuevoCosto(nuevoCosto) {
        if (nuevoCosto !== undefined) this.costoConsulta = nuevoCosto;
    }
}
