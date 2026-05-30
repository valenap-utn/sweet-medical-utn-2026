import {EspecialidadInvalida} from "../../exceptions/EspecialidadInvalida.js";

export class Especialidad {
    id;
    nombre;
    duracionTurnoEnMins;
    costoConsulta;

    constructor(nombre, duracionTurnoEnMins, costoConsulta) {
        this.validarParametros(nombre, duracionTurnoEnMins, costoConsulta);
        this.nombre = nombre;
        this.duracionTurnoEnMins = duracionTurnoEnMins;
        this.costoConsulta = costoConsulta;
    }

    validarParametros(nombre, duracionTurnoEnMins, costoConsulta) {
        if ([nombre, duracionTurnoEnMins, costoConsulta].some(v => !v)) {
            throw new EspecialidadInvalida(`La especialidad necesita nombre, duracion en minutos del turno, costo de la consulta.\n
                Se recibió nombre: ${nombre}, duracion: ${duracionTurnoEnMins}, costo: ${costoConsulta}`);
        }
    }

    establecerNuevoNombre(nuevoNombre){
        if(nuevoNombre !== undefined) {
            this.nombre = nuevoNombre;
        }
    }

    establecerNuevaDuracion(nuevaDuracion){
        if(nuevaDuracion !== undefined) {
            this.duracionTurnoEnMins = nuevaDuracion;
        }
    }

    establecerNuevoCosto(nuevoCosto){
        if(nuevoCosto !== undefined) {
            this.costoConsulta = nuevoCosto;
        }
    }

}
