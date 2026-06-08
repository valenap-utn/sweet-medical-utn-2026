export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.status = statusCode >= 500 ? "error" : "fail";
        this.timeStamp = new Date().toISOString();
    }
}

// Errors

// 400 - Bad Request - Cuando el cliente envió datos inválidos
export class BadRequestError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}

// 401 - Unauthorized - Cuando el cliente no está autorizado
export class UnauthorizedError extends AppError {
    constructor(message) {
        super(message, 401);
    }
}

// 403 - Forbidden - Cuando existe pero no tiene permiso
export class ForbiddenError extends AppError {
    constructor(message) {
        super(message, 403);
    }
}

// 404 - Not Found - Cuando el recurso no existe
export class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}

// 409 - Conflict - Cuando el estado actual no permite la operación
export class ConflictError extends AppError {
    constructor(message) {
        super(message, 409);
    }
}

export class UnprocessableEntityError extends AppError {
    constructor(message) {
        super(message, 422);
    }
}
