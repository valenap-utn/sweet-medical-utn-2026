import {ServicioInvalido} from "../../exceptions/ServicioInvalido.js";

export class Cobertura{
    servicio;
    nivel;

    constructor(servicio, nivel) {
        this.validarParametros(servicio, nivel);
        this.servicio = servicio;
        this.nivel = nivel;
    }

    validarParametros(servicio, nivel) {
        if ([servicio, nivel].some(v => !v)) {
            throw new ServicioInvalido(`La cobertura necesita servicio y nivel.\n
                Se recibió servicio: ${servicio}, nivel: ${nivel}`);
        }
    }
}
