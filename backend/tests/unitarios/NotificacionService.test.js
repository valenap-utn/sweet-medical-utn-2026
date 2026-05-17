import { jest } from "@jest/globals";
import { NotificacionService } from "../../src/services/NotificacionService.js";
import { TipoNotificacion } from "../../src/domain/Notificacion.js";
import { NotFoundError, BadRequestError } from "../../src/error/AppError.js";

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Crea un mock del repositorio con todas las funciones espiadas.
 * Por defecto cada función resuelve con undefined; cada test pisa lo que necesite.
 */
function buildRepoMock() {
    return {
        guardar:                    jest.fn(),
        obtenerNoLeidasPorUsuario:  jest.fn(),
        obtenerLeidasPorUsuario:    jest.fn(),
        obtenerPorId:               jest.fn(),
        marcarComoLeida:            jest.fn(),
    };
}

const USUARIO_ID   = "user-123";
const NOTIF_ID     = "notif-abc";
const TIPO_VALIDO  = TipoNotificacion.DONACION_ASIGNADA;
const MENSAJE      = "Tu donación fue asignada a un comedor.";

// ─── suite ────────────────────────────────────────────────────────────────────

describe("NotificacionService", () => {

    // ── crearNotificacion ────────────────────────────────────────────────────

    describe("crearNotificacion", () => {

        test("crea y persiste una notificación válida", async () => {
            const repo = buildRepoMock();
            const savedDoc = { _id: NOTIF_ID, usuarioDestinatarioId: USUARIO_ID, mensaje: MENSAJE, tipo: TIPO_VALIDO, leida: false };
            repo.guardar.mockResolvedValue(savedDoc);

            const service = new NotificacionService(repo);
            const result  = await service.crearNotificacion(USUARIO_ID, MENSAJE, TIPO_VALIDO);

            expect(repo.guardar).toHaveBeenCalledTimes(1);
            expect(result).toBe(savedDoc);
        });

        test("lanza BadRequestError si el tipo es inválido", async () => {
            const repo    = buildRepoMock();
            const service = new NotificacionService(repo);

            await expect(
                service.crearNotificacion(USUARIO_ID, MENSAJE, "TIPO_INEXISTENTE")
            ).rejects.toBeInstanceOf(BadRequestError);

            expect(repo.guardar).not.toHaveBeenCalled();
        });

        test("lanza BadRequestError si falta el mensaje", async () => {
            const repo    = buildRepoMock();
            const service = new NotificacionService(repo);

            await expect(
                service.crearNotificacion(USUARIO_ID, "", TIPO_VALIDO)
            ).rejects.toBeInstanceOf(BadRequestError);
        });

        test("lanza BadRequestError si falta el destinatario", async () => {
            const repo    = buildRepoMock();
            const service = new NotificacionService(repo);

            await expect(
                service.crearNotificacion(null, MENSAJE, TIPO_VALIDO)
            ).rejects.toBeInstanceOf(BadRequestError);
        });
    });

    // ── obtenerNoLeidas ──────────────────────────────────────────────────────

    describe("obtenerNoLeidas", () => {

        test("delega al repositorio y retorna el listado", async () => {
            const repo = buildRepoMock();
            const lista = [
                { _id: "n1", usuarioDestinatarioId: USUARIO_ID, leida: false, mensaje: "msg1", tipo: TIPO_VALIDO },
                { _id: "n2", usuarioDestinatarioId: USUARIO_ID, leida: false, mensaje: "msg2", tipo: TIPO_VALIDO },
            ];
            repo.obtenerNoLeidasPorUsuario.mockResolvedValue(lista);

            const service = new NotificacionService(repo);
            const result  = await service.obtenerNoLeidas(USUARIO_ID);

            expect(repo.obtenerNoLeidasPorUsuario).toHaveBeenCalledWith(USUARIO_ID);
            expect(result).toHaveLength(2);
            expect(result.every(n => !n.leida)).toBe(true);
        });

        test("retorna array vacío si no hay notificaciones sin leer", async () => {
            const repo = buildRepoMock();
            repo.obtenerNoLeidasPorUsuario.mockResolvedValue([]);

            const service = new NotificacionService(repo);
            const result  = await service.obtenerNoLeidas(USUARIO_ID);

            expect(result).toEqual([]);
        });

        test("lanza BadRequestError si usuarioId es nulo", async () => {
            const repo    = buildRepoMock();
            const service = new NotificacionService(repo);

            await expect(service.obtenerNoLeidas(null)).rejects.toBeInstanceOf(BadRequestError);
            expect(repo.obtenerNoLeidasPorUsuario).not.toHaveBeenCalled();
        });
    });

    // ── obtenerLeidas ────────────────────────────────────────────────────────

    describe("obtenerLeidas", () => {

        test("delega al repositorio y retorna el listado", async () => {
            const repo = buildRepoMock();
            const lista = [
                { _id: "n3", usuarioDestinatarioId: USUARIO_ID, leida: true, mensaje: "msg3", tipo: TIPO_VALIDO },
            ];
            repo.obtenerLeidasPorUsuario.mockResolvedValue(lista);

            const service = new NotificacionService(repo);
            const result  = await service.obtenerLeidas(USUARIO_ID);

            expect(repo.obtenerLeidasPorUsuario).toHaveBeenCalledWith(USUARIO_ID);
            expect(result).toHaveLength(1);
            expect(result[0].leida).toBe(true);
        });

        test("lanza BadRequestError si usuarioId es nulo", async () => {
            const repo    = buildRepoMock();
            const service = new NotificacionService(repo);

            await expect(service.obtenerLeidas(undefined)).rejects.toBeInstanceOf(BadRequestError);
        });
    });

    // ── marcarComoLeida ──────────────────────────────────────────────────────

    describe("marcarComoLeida", () => {

        test("marca la notificación como leída exitosamente", async () => {
            const repo = buildRepoMock();
            const notifEnDB = { _id: NOTIF_ID, usuarioDestinatarioId: USUARIO_ID, leida: false };
            const notifActualizada = { ...notifEnDB, leida: true, fechaHoraLeida: new Date() };

            repo.obtenerPorId.mockResolvedValue(notifEnDB);
            repo.marcarComoLeida.mockResolvedValue(notifActualizada);

            const service = new NotificacionService(repo);
            const result  = await service.marcarComoLeida(NOTIF_ID, USUARIO_ID);

            expect(repo.obtenerPorId).toHaveBeenCalledWith(NOTIF_ID);
            expect(repo.marcarComoLeida).toHaveBeenCalledWith(NOTIF_ID);
            expect(result.leida).toBe(true);
        });

        test("es idempotente: si ya estaba leída no llama a marcarComoLeida del repo", async () => {
            const repo = buildRepoMock();
            const notifEnDB = { _id: NOTIF_ID, usuarioDestinatarioId: USUARIO_ID, leida: true };
            repo.obtenerPorId.mockResolvedValue(notifEnDB);

            const service = new NotificacionService(repo);
            const result  = await service.marcarComoLeida(NOTIF_ID, USUARIO_ID);

            expect(repo.marcarComoLeida).not.toHaveBeenCalled();
            expect(result).toBe(notifEnDB);
        });

        test("lanza NotFoundError si la notificación no existe", async () => {
            const repo = buildRepoMock();
            repo.obtenerPorId.mockResolvedValue(null);

            const service = new NotificacionService(repo);

            await expect(
                service.marcarComoLeida(NOTIF_ID, USUARIO_ID)
            ).rejects.toBeInstanceOf(NotFoundError);
        });

        test("lanza BadRequestError si el usuario no es el destinatario", async () => {
            const repo = buildRepoMock();
            repo.obtenerPorId.mockResolvedValue({
                _id: NOTIF_ID,
                usuarioDestinatarioId: "otro-usuario",
                leida: false,
            });

            const service = new NotificacionService(repo);

            await expect(
                service.marcarComoLeida(NOTIF_ID, USUARIO_ID)
            ).rejects.toBeInstanceOf(BadRequestError);

            expect(repo.marcarComoLeida).not.toHaveBeenCalled();
        });

        test("lanza BadRequestError si falta el id de la notificación", async () => {
            const repo    = buildRepoMock();
            const service = new NotificacionService(repo);

            await expect(
                service.marcarComoLeida(null, USUARIO_ID)
            ).rejects.toBeInstanceOf(BadRequestError);
        });

        test("lanza BadRequestError si falta el id del usuario", async () => {
            const repo    = buildRepoMock();
            const service = new NotificacionService(repo);

            await expect(
                service.marcarComoLeida(NOTIF_ID, null)
            ).rejects.toBeInstanceOf(BadRequestError);
        });
    });
});
