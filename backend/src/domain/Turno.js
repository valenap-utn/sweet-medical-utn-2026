import {TurnoInvalido} from "../exceptions/TurnoInvalido";
import {CambioEstadoTurno} from "./CambioEstadoTurno.js";
import {LocalDateTime} from "@js-joda/core";
// import {EstadoTurno} from "./enums/EstadoTurno.js";

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

    constructor(id, medico, paciente, fechaHora, sede, practica, estado, costo, sinParametros) {
        if(!sinParametros){
            this.validarParametros(medico,paciente, fechaHora, sede, practica, estado, costo);
            this.id = id;
            this.medico = medico;
            this.paciente = paciente;
            this.fechaHora = fechaHora;
            this.sede = sede;
            this.practica = practica;
            this.estado = estado; // o  debería ser tipo: EstadoTurno.RESERVADO || EstadoTurno.DISPONIBLE ???
            this.costo = costo;
            this.historialEstados = [];
        }
    }

    static build(){
        return new Turno({sinParametros:true});
    }

    validarParametros(medico, paciente, fechaHora, sede, practica, estado, costo) {
        if (
            [medico, paciente, fechaHora, sede, practica, estado, costo]
                .some(v => !v)) {
            throw new TurnoInvalido(`El turno necesita medico, paciente, fechaHora, sede, practica, estado, costo.\n
                Se recibió medico: ${medico}, paciente: ${paciente}, fechaHora: ${fechaHora}, 
                sede: ${sede}, practica: ${practica}, estado: ${estado}, costo: ${costo}`);
        }
    }

    actualizarEstado(nuevoEstado, usuario, motivo){
        this.estado = nuevoEstado;
        const updateEstado = new CambioEstadoTurno(LocalDateTime.now(),this.estado, this.id, usuario, motivo);
        this.historialEstados.push(updateEstado); // trazabilidad
    }
}
