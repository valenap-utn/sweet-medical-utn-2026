import {PlanInvalido} from "../../exceptions/PlanInvalido.js";
import {NivelCobertura} from "../enums/NivelCobertura.js";
import {CoberturaEspecialidad} from "./CoberturaEspecialidad.js";
import {CoberturaPractica} from "./CoberturaPractica.js";
import {CoberturaInvalida} from "../../exceptions/CoberturaInvalida.js";

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

    obtenerCobertura(tipoCobertura){
        let cobertura;
        if(tipoCobertura instanceof CoberturaEspecialidad){
            cobertura = this.coberturasEspecialidad.find(c => c.especialidad === tipoCobertura);
        }else if(tipoCobertura instanceof CoberturaPractica){
            cobertura = this.coberturasPractica.find(c => c.practica === tipoCobertura);
        }else throw new CoberturaInvalida(`La cobertura para ${tipoCobertura} no pudo ser encontrada`);

        return cobertura ? cobertura.nivel : NivelCobertura.NO_CUBIERTA;
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
