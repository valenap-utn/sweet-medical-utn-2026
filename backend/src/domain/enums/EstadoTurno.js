export class EstadoTurno {
    constructor(nombre){
        this.nombre = nombre;
    }

    toString(){
        return this.nombre.toUpperCase();
    }

    // Convierte un string proveniente de Mongo en una instancia de NivelCobertura
    static fromString(valor){
        return Object.values(EstadoTurno)
            .filter(v => v instanceof EstadoTurno)
            .find(v => v.nombre === valor);
    }

}

EstadoTurno.DISPONIBLE = new EstadoTurno("Disponible");
EstadoTurno.RESERVADO = new EstadoTurno("Reservado");
EstadoTurno.CONFIRMADO = new EstadoTurno("Confirmado");
EstadoTurno.CANCELADO = new EstadoTurno("Cancelado");
EstadoTurno.REALIZADO = new EstadoTurno("Realizado");
