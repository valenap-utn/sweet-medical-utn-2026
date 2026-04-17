
export class ObraSocial {
    id;
    nombre;
    planes;

    constructor(id,nombre) {
        this.id = id;
        this.nombre = nombre;
        this.planes = [];
    }

    agregarPlan(nuevoPlan){
        this.planes.push(nuevoPlan);
    }
}
