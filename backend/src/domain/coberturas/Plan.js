import {PlanInvalido} from "../../exceptions/PlanInvalido.js";
import {NivelCobertura} from "../enums/NivelCobertura.js";
import {CoberturaInvalida} from "../../exceptions/CoberturaInvalida.js";

export class Plan {
    id;
    nombre;
    coberturasEspecialidad = [];
    coberturasPractica = [];

    constructor(nombre) {
        this.validarParametros(nombre);
        this.nombre = nombre;
    }

    validarParametros(nombre) {
        if ([nombre].some(v => !v)) {
            throw new PlanInvalido(`El plan necesita un nombre.\n
                Se recibió nombre: ${nombre}`);
        }
    }

    obtenerCoberturaEspecialidad(especialidad) {
        const especialidadId = especialidad.id ?? especialidad._id;
        if (!especialidadId) {
            throw new CoberturaInvalida(`La cobertura para ${especialidad} no pudo ser encontrada`);
        }
        const tipoCobertura = this.coberturasEspecialidad.find(c => {
            const coberturaEspecialidadId = c.especialidad.id ?? c.especialidad._id ?? c.especialidad;
            return String(coberturaEspecialidadId) === String(especialidadId);
        })
        return tipoCobertura ? tipoCobertura.nivel : NivelCobertura.NO_CUBIERTA;
    }

    obtenerCoberturaPractica(practica) {
        const practicaId = practica.id ?? practica._id;
        if (!practicaId) {
            throw new CoberturaInvalida(`La cobertura para ${practica} no pudo ser encontrada`);
        }
        const tipoCobertura = this.coberturasPractica.find(c => {
            const coberturaPracticaId = c.practica.id ?? c.practica._id ?? c.practica;
            return String(coberturaPracticaId) === String(practicaId)
        });
        return tipoCobertura ? tipoCobertura.nivel : NivelCobertura.NO_CUBIERTA;
    }

    agregarEspecialidad(coberturaEspecialidad) {
        if (!this.coberturasEspecialidad.includes(coberturaEspecialidad)) {
            this.coberturasEspecialidad.push(coberturaEspecialidad);
        } else {
            console.log(`La especialidad ${coberturaEspecialidad} ya pertenece al plan ${this.nombre}`);
        }
    }

    agregarPractica(coberturaPractica) {
        if (!this.coberturasPractica.includes(coberturaPractica)) {
            this.coberturasPractica.push(coberturaPractica);
        } else {
            console.log(`La practica ${coberturaPractica} ya pertenece al plan ${this.nombre}`);
        }
    }
}
