
export class ObraSocial {
    id;
    nombre;
    planes = [];

    constructor(nombre) {
        this.nombre = nombre;
    }

    agregarPlan(nuevoPlan){
        this.planes.push(nuevoPlan);
    }
}
