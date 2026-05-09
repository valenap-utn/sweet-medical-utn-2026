import {PlanInvalido} from "../../exceptions/PlanInvalido.js";
import {NivelCobertura} from "../enums/NivelCobertura.js";
import {CoberturaInvalida} from "../../exceptions/CoberturaInvalida.js";

export class Plan {
    id;
    nombre;
    coberturasEspecialidad;
    coberturasPractica;

    constructor(nombre) {
        this.validarParametros(nombre);
        this.id = null;
        this.nombre = nombre;
        this.coberturasEspecialidad = [];
        this.coberturasPractica = [];
    }

    validarParametros(nombre) {
        if (typeof nombre !== "string" || nombre.trim().length < 3) {
            throw new PlanInvalido(`El plan necesita un nombre válido.\n
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
        const existe = this.coberturasEspecialidad.some(c => c.especialidad.id === coberturaEspecialidad.especialidad.id);
        if(!existe) {
            this.coberturasEspecialidad.push(coberturaEspecialidad);
        }else{
            console.log(`La especialidad ${coberturaEspecialidad} ya pertenece al plan ${this.nombre}`);
        }
    }

    agregarPractica(coberturaPractica){
        const existe = this.coberturasPractica.some(c => c.practica.id === coberturaPractica.practica.id);
        if(!existe){
            this.coberturasPractica.push(coberturaPractica);
        }else{
            console.log(`La practica ${coberturaPractica} ya pertenece al plan ${this.nombre}`);
        }
    }
}
