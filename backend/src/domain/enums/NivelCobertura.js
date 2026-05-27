
export class NivelCobertura {
    constructor(nombre){
        this.nombre = nombre;
    }

    toString(){
        return this.nombre.toUpperCase();
    }

    // Convierte un string proveniente de Mongo en una instancia de NivelCobertura
    static fromString(valor){
        return Object.values(NivelCobertura)
            .filter(n => n instanceof NivelCobertura)
            .find(n => n.nombre === valor);
    }
}

NivelCobertura.TOTAL = new NivelCobertura("TOTAL");
NivelCobertura.PARCIAL = new NivelCobertura("PARCIAL");
NivelCobertura.NO_CUBIERTA = new NivelCobertura("NO_CUBIERTA");
