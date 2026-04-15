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
            throw new EspecialidadInvalida(`La especialidad necesita id, nombre, duracion en minutos del turno, costo de la consulta.\n
                Se recibió nombre: ${nombre}, duracion: ${duracionTurnoEnMins}, costo: ${costoConsulta}`);
        }
    }

    establecerNuevoCosto(nuevoCosto){
        this.costoConsulta = nuevoCosto;
    }
}
