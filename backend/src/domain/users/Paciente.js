import {UsuarioInvalido} from "../../exceptions/UsuarioInvalido.js";

export class Paciente {
    id;
    usuario;
    dni;
    nombre;
    obraSocial;
    plan;

    constructor({id,usuario,dni, nombre,obraSocial,plan}) {
        this.validarParametros(id,usuario,dni, nombre,obraSocial,plan)
        this.id = id;
        this.usuario = usuario;
        this.dni = dni;
        this.nombre = nombre;
        this.obraSocial = obraSocial;
        this.plan = plan;
    }

    static build

    validarParametros(id,usuario,dni, nombre,obraSocial,plan) {
        if ([id,usuario,dni, nombre,obraSocial,plan].some(v => !v)) {
            throw new UsuarioInvalido(`El paciente necesita id, usuario, dni, nombre, obra social y plan.\n
                Se recibió usuario: ${usuario}, dni: ${dni}, nombre: ${nombre}, obra social: ${obraSocial}, plan: ${plan}`);
        }
    }

}
