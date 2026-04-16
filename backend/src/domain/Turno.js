import {TurnoInvalido} from "../exceptions/TurnoInvalido";

export class Turno {
    id;
    medico;
    paciente;
    fechaHora;
    sede;
    practica;
    estado;
    historialEstados;
    costo;

    constructor({id, medico, paciente, fechaHora, sede, practica, estado, costo, sinParametros}) {
        if(!sinParametros){
            this.validarParametros(id,medico,paciente, fechaHora, sede, practica, estado, costo);

            this.id = id;
            this.medico = medico;
            this.paciente = paciente;
            this.fechaHora = fechaHora;
            this.sede = sede;
            this.practica = practica;
            this.estado = estado;
            this.costo = estado;
            this.historialEstados = [];
        }
    }

    static build(){
        return new Turno({sinParametros:true});
    }

    validarParametros(id, medico, paciente, fechaHora, sede, practica, estado, costo) {
        if (
            [id, medico, paciente, fechaHora, sede, practica, estado, costo]
                .some(v => !v)) {
            throw new TurnoInvalido(`El turno necesita id, medico, paciente, fechaHora, sede, practica, estado, costo.\n
                Se recibió medico: ${medico}, paciente: ${paciente}, fechaHora: ${fechaHora}, 
                sede: ${sede}, practica: ${practica}, estado: ${estado}, costo: ${costo}`);
        }
    }

    actualizarEstado(nuevoEstado, usuario, motivo){
        const updateEstado = {
            estadoAnterior: this.estado,
            nuevoEstado,
            usuario, //quien
            motivo,
            fecha: new Date(),
        }
        this.historialEstados.push(updateEstado); // trazabilidad
        this.estado = nuevoEstado;
    }
}
