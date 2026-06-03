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

    turnosExistentes; // para 'Agenda'

    constructor(id, usuario, nombre, matricula) {
        this.validarParametros(usuario, nombre, matricula)
        this.id = id;
        this.usuario = usuario;
        this.matricula = matricula;
        this.nombre = nombre;
        this.especialidades = [];
        this.practicas = [];
        this.sedes = [];
        this.disponibilidades = [];

        this.turnosExistentes = [];
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

    agregarEspecialidad(especialidad) {
        if (!this.especialidades.includes(especialidad)) {
            this.especialidades.push(especialidad);
        }
    }

    agregarPractica(practica) {
        if (!this.practicas.includes(practica)) {
            this.practicas.push(practica);
        }
    }

    agregarSede(sede) {
        if (!this.sedes.includes(sede)) {
            this.sedes.push(sede);
        }
    }


}