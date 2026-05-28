import {PracticaInvalida} from "../../exceptions/PracticaInvalida.js";

export class Practica {
    id;
    codigo;
    nombre;
    duracionTurnoEnMins;
    costo;

    constructor(codigo,nombre, duracionTurnoEnMins, costo) {
        this.validarParametros(codigo,nombre, duracionTurnoEnMins, costo);
        this.codigo = codigo;
        this.nombre = nombre;
        this.duracionTurnoEnMins = duracionTurnoEnMins;
        this.costo = costo;
    }

    validarParametros(id, codigo, nombre, duracionTurnoEnMins, costo){
        if(!id || !codigo || !nombre || !duracionTurnoEnMins || !costo){
            throw new PracticaInvalida(`La practica necesita ID, codigo, nombre, duracion en minutos del turno, costo.\n
                Se recibió ID: ${id}, codigo: ${codigo}, nombre: ${nombre}, duracion: ${duracionTurnoEnMins}, 
                costo: ${costo}`);
        }
    }
}
