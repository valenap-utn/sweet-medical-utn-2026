import {PracticaInvalida} from "../../exceptions/PracticaInvalida.js";

export class Practica {
    id;
    codigo;
    nombre;
    duracionTurnoEnMins;
    costo;

    constructor(id, codigo, nombre, duracionTurnoEnMins, costo) {
        this.validarParametros(id, codigo, nombre, duracionTurnoEnMins, costo);
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.duracionTurnoEnMins = duracionTurnoEnMins;
        this.costo = costo;
    }

    validarParametros(id, codigo, nombre, duracionTurnoEnMins, costo) {
        if ([id, codigo, nombre, duracionTurnoEnMins, costo].some(v => !v)) {
            throw new PracticaInvalida(
                `La practica necesita id, codigo, nombre, duracion en minutos del turno, costo.\n` +
                `Se recibió id: ${id}, codigo: ${codigo}, nombre: ${nombre}, duracion: ${duracionTurnoEnMins}, costo: ${costo}`
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
