import {PlanInvalido} from "../../exceptions/PlanInvalido.js";
import {NivelCobertura} from "../enums/NivelCobertura.js";
import {CoberturaInvalida} from "../../exceptions/CoberturaInvalida.js";
import {Especialidad} from "./Especialidad.js";
import {Practica} from "./Practica.js";

export class Plan {
    id;
    nombre;
    coberturasEspecialidad;
    coberturasPractica;

    constructor(id,nombre) {
        this.validarParametros(id, nombre);
        this.id = id;
        this.nombre = nombre;
        this.coberturasEspecialidad = [];
        this.coberturasPractica = [];
    }

    validarParametros(id, nombre) {
        if ([id, nombre].some(v => !v)) {
            throw new PlanInvalido(`El plan necesita id y nombre.\n
                Se recibió nombre: ${nombre}`);
        }
    }

    obtenerCobertura(cobertura){
        let tipoCobertura;
        if(cobertura instanceof Especialidad){
            tipoCobertura = this.coberturasEspecialidad.find(c => c.especialidad === cobertura);
        }else if(cobertura instanceof Practica){
            tipoCobertura = this.coberturasPractica.find(c => c.practica === cobertura);
        }else throw new CoberturaInvalida(`La cobertura para ${cobertura} no pudo ser encontrada`);

        return tipoCobertura ? tipoCobertura.nivel : NivelCobertura.NO_CUBIERTA;
    }

    agregarEspecialidad(coberturaEspecialidad) {
        if(!this.coberturasEspecialidad.includes(coberturaEspecialidad)) {
            this.coberturasEspecialidad.push(coberturaEspecialidad);
        }else{
            console.log(`La especialidad ${coberturaEspecialidad} ya pertenece al plan ${this.nombre}`);
        }
    }

    agregarPractica(coberturaPractica){
        if(!this.coberturasPractica.includes(coberturaPractica)){
            this.coberturasPractica.push(coberturaPractica);
        }else{
            console.log(`La practica ${coberturaPractica} ya pertenece al plan ${this.nombre}`);
        }
    }
}
