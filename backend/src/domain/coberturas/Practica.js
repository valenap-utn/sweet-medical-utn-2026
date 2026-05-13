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

    validarParametros(codigo,nombre, duracionTurnoEnMins, costo){
        if([codigo,nombre, duracionTurnoEnMins, costo].some(v=>!v)){
            throw new PracticaInvalida(`La practica necesita codigo, nombre, duracion en minutos del turno, costo.\n
                Se recibió codigo: ${codigo}, nombre: ${nombre}, duracion: ${duracionTurnoEnMins}, 
                costo: ${costo}`);
        }
    }
}