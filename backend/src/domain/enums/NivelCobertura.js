
export class NivelCobertura {
    constructor(nombre){
        this.nombre = nombre;
    }

    toString(){
        return this.nombre.toUpperCase();
    }
}

NivelCobertura.TOTAL = new NivelCobertura("Total");
NivelCobertura.PARCIAL = new NivelCobertura("Parcial");
NivelCobertura.NO_CUBIERTA = new NivelCobertura("No cubierta");
