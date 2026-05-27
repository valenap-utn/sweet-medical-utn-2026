
export class ObraSocial {
    id;
    nombre;
    planes = [];

    constructor(nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    agregarPlan(nuevoPlan){
        this.planes.push(nuevoPlan);
    }
}
