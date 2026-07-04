import { ForbiddenError } from "../error/AppError.js";

export function requireRole(...rolesPermitidos) {
    return (req, res, next) => {
        if (!req.user) {
            return next(
                new ForbiddenError(
                    "No se pudo identificar al usuario."
                )
            );
        }

        if (!rolesPermitidos.includes(req.user.rol)) {
            return next(
                new ForbiddenError(
                    "No tenés permisos para realizar esta operación."
                )
            );
        }

        next();
    };
}