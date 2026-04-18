import {UsuarioInvalido} from "../../exceptions/UsuarioInvalido";

export class Usuario {
    id;
    nombreUsuario;
    password;

    constructor(id, nombreUsuario, password ) {
        this.validarDatosIngresados(nombreUsuario,password);
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.password  = password;
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
}
