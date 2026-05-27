import {getDay} from "date-fns";

export class DiaSemana {
    constructor(nombre) {
        this.nombre = nombre;
    }

    toString() {
        return this.nombre.toUpperCase();
    }

    _nombreDiaSemanaES(fecha) {
        const numeroDia = getDay(fecha);
        const mapa = {
            0: new DiaSemana('Domingo'),
            1: new DiaSemana('Lunes'),
            2: new DiaSemana('Martes'),
            3: new DiaSemana('Miercoles'),
            4: new DiaSemana('Jueves'),
            5: new DiaSemana('Viernes'),
            6: new DiaSemana('Sabado'),
        };
        return mapa[numeroDia];
    }
}
