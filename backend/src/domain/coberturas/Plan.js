import {PlanInvalido} from "../../exceptions/PlanInvalido.js";
import {NivelCobertura} from "../enums/NivelCobertura.js";
import {CoberturaInvalida} from "../../exceptions/CoberturaInvalida.js";
export class Plan {
    id;
    nombre;
    coberturasEspecialidad = [];
    coberturasPractica = [];
    constructor(id, nombre) {
        this.validarParametros(id, nombre);
        this.id = id;
        this.nombre = nombre;
    }
    validarParametros(id, nombre) {
        if (!id || !nombre) {
            throw new PlanInvalido(`El plan necesita un ID y un nombre.\n
                Se recibió ID: ${id}, nombre: ${nombre}`);
        }
    }
    obtenerCobertura(servicio) {
        if (!servicio) {
            return NivelCobertura.NO_CUBIERTA;
        }
        // Si tiene codigo, es una Practica; si no, es una Especialidad.
        // También chequeamos el nombre de la clase como fallback.
        const esPractica = (servicio.codigo !== undefined) || 
                           (servicio.constructor && servicio.constructor.name === 'Practica');
        
        if (esPractica) {
            return this.obtenerCoberturaPractica(servicio);
        } else {
            return this.obtenerCoberturaEspecialidad(servicio);
        }
    }
    obtenerCoberturaEspecialidad(especialidad) {
        const targetId = especialidad.id || especialidad._id || especialidad.toString();
        if (!targetId) {
            throw new CoberturaInvalida(`La cobertura para ${especialidad} no pudo ser encontrada`);
        }
        const tipoCobertura = this.coberturasEspecialidad.find(c => {
            const cId = c.especialidad.id || c.especialidad._id || c.especialidad.toString();
            return cId.toString() === targetId.toString();
        });
        return tipoCobertura ? (typeof tipoCobertura.nivel === 'string' ? NivelCobertura.fromString(tipoCobertura.nivel) : tipoCobertura.nivel) : NivelCobertura.NO_CUBIERTA;
    }
    obtenerCoberturaPractica(practica) {
        const targetId = practica.id || practica._id || practica.toString();
        if (!targetId) {
            throw new CoberturaInvalida(`La cobertura para ${practica} no pudo ser encontrada`);
        }
        const tipoCobertura = this.coberturasPractica.find(c => {
            const cId = c.practica.id || c.practica._id || c.practica.toString();
            return cId.toString() === targetId.toString();
        });
        return tipoCobertura ? (typeof tipoCobertura.nivel === 'string' ? NivelCobertura.fromString(tipoCobertura.nivel) : tipoCobertura.nivel) : NivelCobertura.NO_CUBIERTA;
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
