import {PracticaInvalida} from "../../exceptions/PracticaInvalida.js";

export class CoberturaPractica{
    practica;
    nivel;

    constructor(practica, nivel) {
        this.validarParametros(practica, nivel);
        this.practica = practica;
        this.nivel = nivel;
    }

    validarParametros(practica, nivel) {
        if ([practica, nivel].some(v => !v)) {
            throw new PracticaInvalida(`La cobertura necesita práctica y nivel.\n
                Se recibió práctica: ${practica}, nivel: ${nivel}`);
        }
    }

}
