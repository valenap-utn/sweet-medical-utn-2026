import jwt from "jsonwebtoken";
import {UnauthorizedError} from "../error/AppError.js";

// Identificamos al usuario autenticado
export function authMiddleware(req, res, next) {
    try {
        const token = req.cookies?.accessToken;
        if(!token) {
            throw new UnauthorizedError("No hay sessión activa.");
        }

        req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        next();
    } catch (e) {
        next(new UnauthorizedError("El token es inválido o expiró."));
    }
}
