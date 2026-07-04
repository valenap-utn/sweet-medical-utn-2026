import {ConflictError} from "../error/AppError.js";

export class ObraSocial {
    id;
    nombre;
    planes;

    constructor(id,nombre) {
        this.id = id;
        this.nombre = nombre;
        this.planes = [];
    }

    agregarPlan(planId){
        const yaExiste = this.planes.some(p => {
            const id = p._id ?? p.id ?? p;
            return String(id) === String(planId);
        });
        if(yaExiste) throw new ConflictError(`El plan ${planId} ya pertenece a la obra social ${this.nombre}.`)
        this.planes.push(planId);
    }
}
