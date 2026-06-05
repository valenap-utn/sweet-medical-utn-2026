import {EspecialidadInvalida} from "../../exceptions/EspecialidadInvalida.js";

export class Especialidad {
    id;
    nombre;
    duracionTurnoEnMins;
    costo;

    constructor(id, nombre, duracionTurnoEnMins, costo) {
        this.validarParametros(id, nombre, duracionTurnoEnMins, costo);
        this.id = id;
        this.nombre = nombre;
        this.duracionTurnoEnMins = duracionTurnoEnMins;
        this.costo = costo;
    }

    validarParametros(id, nombre, duracionTurnoEnMins, costo) {
        if ([id, nombre, duracionTurnoEnMins, costo].some(v => !v)) {
            throw new EspecialidadInvalida(
                `La especialidad necesita id, nombre, duracion en minutos del turno, costo de la consulta.\n` +
                `Se recibió id: ${id}, nombre: ${nombre}, duracion: ${duracionTurnoEnMins}, costo: ${costo}`
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
        if (nuevoCosto !== undefined) this.costo = nuevoCosto;
    }
}
