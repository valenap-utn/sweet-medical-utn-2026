import { UsuarioInvalido } from '../../exceptions/UsuarioInvalido.js';

export class Usuario {
    id;
    nombreUsuario;
    password;

    constructor(id, nombreUsuario, password) {
        this.validarDatosIngresados(nombreUsuario, password);
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.password = password;
    }

    validarPassword(password) {
        // Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
        const exp_reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return exp_reg.test(password);
    }

    validarDatosIngresados(nombreUsuario, password) {
        if (!nombreUsuario || !password) {
            throw new UsuarioInvalido(
                `El nombre de usuario y contraseña son obligatorios. ` +
                `Se recibió nombre: ${nombreUsuario}, password: ${password}`
            );
        }
        if (!this.validarPassword(password)) {
            throw new UsuarioInvalido(
                `La contraseña tiene formato inválido. ` +
                `Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.`
            );
        }
    }
}
