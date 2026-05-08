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

    obtenerCoberturaEspecialidad(especialidad) {
        if(!especialidad.id){
            throw new CoberturaInvalida(`La cobertura para ${especialidad} no pudo ser encontrada`);
        }
        const tipoCobertura = this.coberturasEspecialidad.find(c => c.especialidad.id === especialidad.id);
        return tipoCobertura ? tipoCobertura.nivel : NivelCobertura.NO_CUBIERTA;
    }

    obtenerCoberturaPractica(practica) {
        if(!practica.id){
            throw new CoberturaInvalida(`La cobertura para ${practica} no pudo ser encontrada`);
        }
        const tipoCobertura = this.coberturasPractica.find(c => c.practica.id === practica.id);
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
