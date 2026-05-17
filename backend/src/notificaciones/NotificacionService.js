import { Notificacion } from "../domain/Notificacion.js";
import { NotificacionInvalida } from "../exceptions/NotificacionInvalida.js";
import { NotFoundError, BadRequestError } from "../error/AppError.js";
import { randomUUID } from "crypto";

export class NotificacionService {

    /** @param {import("../repositories/NotificacionRepository.js").NotificacionRepository} notificacionRepository */
    constructor(notificacionRepository) {
        this.notificacionRepository = notificacionRepository;
    }

    /**
     * Crea y persiste una notificación para un usuario.
     * @param {string} usuarioDestinatarioId
     * @param {string} mensaje
     * @param {string} tipo - ver TipoNotificacion
     * @returns {Promise<object>}
     */
    async crearNotificacion(usuarioDestinatarioId, mensaje, tipo) {
        try {
            const notificacion = new Notificacion(
                randomUUID(),
                usuarioDestinatarioId,
                mensaje,
                tipo
            );
            return await this.notificacionRepository.guardar(notificacion);
        } catch (e) {
            if (e instanceof NotificacionInvalida) {
                throw new BadRequestError(e.message);
            }
            throw e;
        }
    }

    /**
     * Devuelve las notificaciones no leídas de un usuario.
     * @param {string} usuarioId
     * @returns {Promise<object[]>}
     */
    async obtenerNoLeidas(usuarioId) {
        this.#validarUsuarioId(usuarioId);
        return this.notificacionRepository.obtenerNoLeidasPorUsuario(usuarioId);
    }

    /**
     * Devuelve las notificaciones leídas de un usuario.
     * @param {string} usuarioId
     * @returns {Promise<object[]>}
     */
    async obtenerLeidas(usuarioId) {
        this.#validarUsuarioId(usuarioId);
        return this.notificacionRepository.obtenerLeidasPorUsuario(usuarioId);
    }

    /**
     * Marca una notificación como leída. Solo el destinatario puede hacerlo.
     * @param {string} notificacionId
     * @param {string} usuarioId - quien hace el request (para autorización)
     * @returns {Promise<object>}
     */
    async marcarComoLeida(notificacionId, usuarioId) {
        if (!notificacionId) throw new BadRequestError("El id de la notificación es obligatorio.");
        this.#validarUsuarioId(usuarioId);

        const notificacion = await this.notificacionRepository.obtenerPorId(notificacionId);
        if (!notificacion) {
            throw new NotFoundError(`Notificación con id ${notificacionId} no encontrada.`);
        }
        if (notificacion.usuarioDestinatarioId !== usuarioId) {
            throw new BadRequestError("No podés marcar como leída una notificación que no te pertenece.");
        }
        if (notificacion.leida) {
            return notificacion; // idempotente: ya estaba leída
        }

        return this.notificacionRepository.marcarComoLeida(notificacionId);
    }

    // ─── privados ─────────────────────────────────────────────────────────────

    #validarUsuarioId(usuarioId) {
        if (!usuarioId) throw new BadRequestError("El id de usuario es obligatorio.");
    }
}
