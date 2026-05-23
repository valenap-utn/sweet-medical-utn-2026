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
     * Crea y persiste una notificación.
     * Usado internamente por otros servicios (TurnoService, etc.) al disparar eventos.
     *
     * @param {string} destinatarioId  - id del Usuario destinatario
     * @param {string} remitenteId     - id del Usuario que origina el evento
     * @param {string} mensaje
     * @param {string} tipo            - ver TipoNotificacion
     * @returns {Promise<object>}
     */
    async crearNotificacion(destinatarioId, remitenteId, mensaje, tipo) {
        try {
            const notificacion = new Notificacion(
                randomUUID(),
                destinatarioId,
                remitenteId,
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
     * Devuelve las notificaciones NO leídas de un usuario, más recientes primero.
     * @param {string} usuarioId
     * @returns {Promise<object[]>}
     */
    async obtenerNoLeidas(usuarioId) {
        this.#validarUsuarioId(usuarioId);
        return this.notificacionRepository.obtenerNoLeidasPorUsuario(usuarioId);
    }

    /**
     * Devuelve las notificaciones YA leídas de un usuario, más recientemente leídas primero.
     * @param {string} usuarioId
     * @returns {Promise<object[]>}
     */
    async obtenerLeidas(usuarioId) {
        this.#validarUsuarioId(usuarioId);
        return this.notificacionRepository.obtenerLeidasPorUsuario(usuarioId);
    }

    /**
     * Marca una notificación como leída.
     * Solo el destinatario puede hacerla — se valida antes de delegar al repo.
     * La operación es idempotente: si ya estaba leída devuelve el documento sin tocar el repo.
     *
     * @param {string} notificacionId
     * @param {string} usuarioId  - quien realiza la acción (para autorización)
     * @returns {Promise<object>}
     */
    async marcarComoLeida(notificacionId, usuarioId) {
        if (!notificacionId) throw new BadRequestError("El id de la notificación es obligatorio.");
        this.#validarUsuarioId(usuarioId);

        const notificacion = await this.notificacionRepository.obtenerPorId(notificacionId);

        if (!notificacion) {
            throw new NotFoundError(`Notificación con id "${notificacionId}" no encontrada.`);
        }
        if (notificacion.destinatario !== usuarioId) {
            throw new BadRequestError("No podés marcar como leída una notificación que no te pertenece.");
        }
        if (notificacion.leida) {
            return notificacion; // ya estaba leída, no se modifica
        }

        return this.notificacionRepository.marcarComoLeida(notificacionId);
    }

    // ─── private ──────────────────────────────────────────────────────────────

    #validarUsuarioId(usuarioId) {
        if (!usuarioId) throw new BadRequestError("El id de usuario es obligatorio.");
    }
}
