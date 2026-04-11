export class EstadoTurno {
    constructor(nombre){
        this.nombre = nombre;
    }

    toString(){
        return this.nombre.toUpperCase();
    }

}

EstadoTurno.DISPONIBLE = new EstadoTurno("Disponible");
EstadoTurno.RESERVADO = new EstadoTurno("Reservado");
EstadoTurno.CONFIRMADO = new EstadoTurno("Confirmado");
EstadoTurno.CANCELADO = new EstadoTurno("Cancelado");
EstadoTurno.REALIZADO = new EstadoTurno("Realizado");
