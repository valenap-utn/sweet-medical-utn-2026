import {PracticaInvalida} from "../../exceptions/PracticaInvalida.js";

export class Practica {
    id;
    codigo;
    nombre;
    duracionTurnoEnMins;
    costo;

    constructor(id,codigo,nombre, duracionTurnoEnMins, costo) {
        this.validarParametros(id,codigo,nombre, duracionTurnoEnMins, costo);
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.duracionTurnoEnMins = duracionTurnoEnMins;
        this.costo = costo;
    }

    validarParametros(id,codigo,nombre, duracionTurnoEnMins, costo){
        if([id,codigo,nombre, duracionTurnoEnMins, costo].some(v=>!v)){
            throw new PracticaInvalida(`La practica necesita id, codigo, nombre, duracion en minutos del turno, costo.\n
                Se recibió codigo: ${codigo}, nombre: ${nombre}, duracion: ${duracionTurnoEnMins}, 
                costo: ${costo}`);
        }
    }
}