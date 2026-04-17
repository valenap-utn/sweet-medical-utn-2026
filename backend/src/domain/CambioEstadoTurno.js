export class CambioEstadoTurno {
    fechaHoraIngreso;
    estado;
    turno;
    usuario;
    motivo;

    constructor(fechaHora, estado, turno, usuario, motivo) {
        this.fechaHora = fechaHora;
        this.estado = estado;
        this.turno = turno;
        this.usuario = usuario;
        this.motivo = motivo;
    }
}