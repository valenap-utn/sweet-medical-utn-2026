
export class DiaSemana {
    constructor(nombre) {
        this.nombre = nombre;
    }

    toString() {
        return this.nombre.toUpperCase();
    }
}

DiaSemana.LUNES = new DiaSemana("Lunes");
DiaSemana.MARTES = new DiaSemana("Martes");
DiaSemana.MIERCOLES = new DiaSemana("Miercoles");
DiaSemana.JUEVES = new DiaSemana("Jueves");
DiaSemana.VIERNES = new DiaSemana("Viernes");
DiaSemana.SABADO = new DiaSemana("Sabado");
DiaSemana.DOMINGO = new DiaSemana("Domingo");

