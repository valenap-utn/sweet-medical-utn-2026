
export class DiaSemana {
    constructor(nombre) {
        this.nombre = nombre;
    }

    toString() {
        return this.nombre.toUpperCase();
    }
}

_nombreDiaSemanaES(getDay) {
    const mapa = {
         0: 'Domingo',
         1: 'Lunes',
         2: 'Martes',
         3: 'Miercoles',
         4: 'Jueves',
         5: 'Viernes',
         6: 'Sabado',
     };
     return mapa[getDay] ?? '';
}

