import {UsuarioInvalido} from "../../exceptions/UsuarioInvalido";
import {validarPassword} from "../../utils/auxFunctions.js";

export class Usuario {
    id;
    nombreUsuario;
    password;

    constructor(id, nombreUsuario, password ) {
        this.validarDatosIngresados(nombreUsuario,password);
        this.nombreUsuario = nombreUsuario;
        this.password  = password;
    }

    validarDatosIngresados(nombreUsuario, password) {
        if(!nombreUsuario || !password){
            throw new UsuarioInvalido(`El nombre de usuario y contraseña son obligatorios, se recibio nombre: ${nombreUsuario}, y password: ${password}`);
        }
        if(!validarPassword(password)){
            throw new UsuarioInvalido(`La contraseña ingresada tiene un formato inválido, debe contener al menos 8 caracteres, una letra mayúscula y una minúscula.`)
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
