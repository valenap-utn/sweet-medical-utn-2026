export class UsuarioInvalido extends Error {
    constructor(mensaje) {
        super(`Usuario inválido: ${mensaje}`);
    }
}