import {PlanInvalido} from "../../exceptions/PlanInvalido.js";
import {NivelCobertura} from "../enums/NivelCobertura.js";
import {CoberturaInvalida} from "../../exceptions/CoberturaInvalida.js";

export class Plan {
    id;
    nombre;
    coberturas = [];

    constructor(id, nombre) {
        this.validarParametros(id, nombre);
        this.id = id;
        this.nombre = nombre;
    }

    validarParametros(id, nombre) {
        if ([id, nombre].some(v => !v)) {
            throw new PlanInvalido(
                `El plan necesita id y nombre.\n                Se recibió id: ${id}, nombre: ${nombre}`
            );
        }
    }

    obtenerCobertura(servicio) {
        const servicioId = servicio.id ?? servicio._id;
        if (!servicioId) {
            throw new CoberturaInvalida(`La cobertura para ${servicio} no pudo ser encontrada`);
        }
        const tipoCobertura = this.coberturas.find(c => {
            const coberturaId = c.servicio.id ?? c.servicio._id ?? c.servicio;
            return String(coberturaId) === String(servicioId);
        });
        return tipoCobertura ? tipoCobertura.nivel : NivelCobertura.NO_CUBIERTA;
    }

    agregarServicio(cobertura) {
        if (!this.coberturas.includes(cobertura)) {
            this.coberturas.push(cobertura);
        } else {
            console.log(`El servicio ${cobertura.servicio} ya pertenece al plan ${this.nombre}`);
        }
    }

}
