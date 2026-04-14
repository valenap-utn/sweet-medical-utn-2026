import {UsuarioInvalido} from "../../exceptions/UsuarioInvalido.js";

export class Medico {
    id;
    usuario;
    matricula;
    nombre;
    especialidades;
    practicas;
    sedes;
    disponibilidades;

    constructor({id, usuario, matricula, nombre, sinParametros}) {
        if(!sinParametros) {
            this.validarParametros(id, usuario, matricula, nombre)
            this.id = id;
            this.usuario = usuario;
            this.matricula = matricula;
            this.nombre = nombre;
            this.especialidades = [];
            this.practicas = [];
            this.sedes = [];
            this.disponibilidades = [];
        }
    }

    validarParametros(id, usuario, matricula, nombre) {
        if ([id, usuario, matricula, nombre].some(v => !v)) {
            throw new UsuarioInvalido(`El médico necesita id, usuario, matricula, nombre.\n
                Se recibió usuario: ${usuario}, matricula: ${matricula}, nombre: ${nombre}`);
        }
    }

    definirDisponibilidad(disponibilidadHoraria) {
        // Si no está en la lista
        if(!this.disponibilidades.includes(disponibilidadHoraria)) {
            // => lo agregamos
            this.disponibilidades.push(disponibilidadHoraria);
        }else{
            console.log(`Ese horario ya figura disponible para el médico`);
        }

    }

    agregarEspecialidad(especialidad) {
        if(!this.especialidades.includes(especialidad)) {
            this.especialidades.push(especialidad);
        }
    }

    agregarPractica(practica) {
        if(!this.practicas.includes(practica)) {
            this.practicas.push(practica);
        }
    }

    agregarSede(sede) {
        if(!this.sedes.includes(sede)) {
            this.sedes.push(sede);
        }
    }


}