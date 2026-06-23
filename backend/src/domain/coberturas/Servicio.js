import {ServicioInvalido} from "../../exceptions/ServicioInvalido.js";

export class Servicio {
    id;
    codigo;
    nombre;
    tipoServicio;
    duracionTurnoEnMins;
    costo;

    constructor(id, codigo, nombre, tipoServicio, duracionTurnoEnMins, costo) {
        this.validarParametros(id, codigo, nombre, tipoServicio, duracionTurnoEnMins, costo);
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.tipoServicio = tipoServicio;
        this.duracionTurnoEnMins = duracionTurnoEnMins;
        this.costo = costo;
    }

    validarParametros(id, codigo, nombre, tipoServicio, duracionTurnoEnMins, costo) {
        if ([id, codigo, nombre, tipoServicio, duracionTurnoEnMins, costo].some(v => !v)) {
            throw new ServicioInvalido(
                `El servicio necesita id, codigo, nombre, tipo de servicio, duracion en minutos del turno, costo.\n` +
                `Se recibió id: ${id}, codigo: ${codigo}, nombre: ${nombre}, servicio: ${tipoServicio}, duracion: ${duracionTurnoEnMins}, costo: ${costo}`
            );
        }
    }

    establecerNuevoNombre(nuevoNombre) {
        if (nuevoNombre !== undefined) this.nombre = nuevoNombre;
    }

    establecerNuevaDuracion(nuevaDuracion) {
        if (nuevaDuracion !== undefined) this.duracionTurnoEnMins = nuevaDuracion;
    }

    establecerNuevoCosto(nuevoCosto) {
        if (nuevoCosto !== undefined) this.costo = nuevoCosto;
    }
}
