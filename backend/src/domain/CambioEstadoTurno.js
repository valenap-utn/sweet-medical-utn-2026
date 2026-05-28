export class CambioEstadoTurno {
    fechaHoraIngreso;
    estado;
    turno;
    usuario;
    motivo;

    constructor({fechaHoraIngreso, estado, turno, usuario, motivo}) {
        this.fechaHoraIngreso = fechaHoraIngreso;
        this.estado = estado;
        this.turno = turno; //id del turno
        this.usuario = usuario;
        this.motivo = motivo;
    }
}