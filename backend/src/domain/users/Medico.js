import {UsuarioInvalido} from "../../exceptions/UsuarioInvalido.js";

export class Medico {
    id;
    usuario;
    matricula;
    nombre;
    servicios;
    disponibilidades;

    constructor(id, usuario, nombre, matricula) {
        this.validarParametros(usuario, nombre, matricula)
        this.id = id;
        this.usuario = usuario;
        this.matricula = matricula;
        this.nombre = nombre;
        this.servicios = [];
        this.disponibilidades = [];
    }

    validarParametros(usuario, nombre, matricula) {
        if ([usuario, nombre, matricula].some(v => !v)) {
            throw new UsuarioInvalido(`El médico necesita usuario y matricula.\n
                Se recibió usuario: ${usuario.id}, nombre: ${nombre}, matricula: ${matricula}}`);
        }
    }

    definirDisponibilidad(disponibilidadHoraria) {
        const existe = this.disponibilidades.some(d =>
            disponibilidadHoraria.diaSemana === d.diaSemana &&
            disponibilidadHoraria.horaDesde === d.horaDesde &&
            disponibilidadHoraria.horaHasta === d.horaHasta
        );

        // Si no está en la lista
        if (!existe) {
            // => lo agregamos
            this.disponibilidades.push(disponibilidadHoraria);
        } else {
            console.log(`Ese horario ya figura disponible para el médico`);
        }

    }

    agregarServicio(servicio) {
        if (!this.servicios.includes(servicio)) {
            this.servicios.push(servicio);
        }
    }

    quitarServicio(servicio) {
        if(this.servicios.includes(servicio)) {
            this.servicios.splice(this.servicios.indexOf(servicio), 1);
        }
    }


}