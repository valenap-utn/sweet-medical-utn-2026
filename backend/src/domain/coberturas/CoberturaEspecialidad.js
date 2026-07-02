import {EspecialidadInvalida} from "../../exceptions/EspecialidadInvalida.js";

export class CoberturaEspecialidad {
    especialidad;
    nivel;

    constructor(especialidad, nivel) {
        this.validarParametros(especialidad, nivel);
        this.especialidad = especialidad;
        this.nivel = nivel;
    }

    validarParametros(especialidad, nivel) {
        if ([especialidad, nivel].some(v => !v)) {
            throw new EspecialidadInvalida(`La cobertura necesita especialidad y nivel.\n
                Se recibió especialidad: ${especialidad}, nivel: ${nivel}`);
        }
    }

}
