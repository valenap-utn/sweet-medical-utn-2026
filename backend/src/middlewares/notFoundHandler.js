import {NotFoundError} from "../error/AppError.js";

export function notFoundHandler(req, res, next){
    next(new NotFoundError(`Ruta ${req.originalUrl} no encontrada`))
}
