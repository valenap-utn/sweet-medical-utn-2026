
export class AppException extends Error {
    nombreError
    constructor(mensaje, nombreError) {
        super(`Error: ${mensaje}`);
        this.nombreError = nombreError;
    }
}
