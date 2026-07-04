import {UsuarioInvalido} from "../../exceptions/UsuarioInvalido.js";
import {validarPassword} from "../../utils/auxFunctions.js";
import { RolUsuario } from "../enums/RolUsuario.js";

export class Usuario {
    id;
    nombreUsuario;
    password;
    rol;

    constructor(id, nombreUsuario, password, rol) {
        this.validarDatosIngresados(nombreUsuario,password);
        this.validarRol(rol);

        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.password = password;
        this.rol = rol;
    }

    validarPassword(password) {
        const exp_reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
        return exp_reg.test(password);
    }

    validarDatosIngresados(nombreUsuario, password) {
        if(!nombreUsuario || !password){
            throw new UsuarioInvalido(`El nombre de usuario y contraseña son obligatorios, se recibio nombre: ${nombreUsuario}, y password: ${password}`);
        }
        if(!this.validarPassword(password)){
            throw new UsuarioInvalido(`La contraseña ingresada tiene un formato inválido, debe contener al menos 8 caracteres, una letra mayúscula y una minúscula.`)
        }
    }

    validarRol(rol) {
        if (!rol) {
            throw new UsuarioInvalido(
                "El rol del usuario es obligatorio."
            );
        }

        if (!Object.values(RolUsuario).includes(rol)) {
            throw new UsuarioInvalido(
                `El rol "${rol}" no es válido. Roles permitidos: ${Object.values(RolUsuario).join(", ")}.`
            );
        }
    }
    
    static validarNombreDisponible(nombreUsuario, usuariosExistentes = []) {
        const yaExiste = usuariosExistentes.some(
            u => u.nombreUsuario.toLowerCase() === nombreUsuario.toLowerCase()
        );
        if (yaExiste) {
            throw new UsuarioInvalido(
                `El nombre de usuario '${nombreUsuario}' ya está en uso. Elegí otro.`
            );
        }
    }
}
