import {describe, expect, jest, test} from "@jest/globals";
import { NotificacionService } from "../../src/services/NotificacionService.js";
import { TipoNotificacion } from "../../src/domain/Notificacion.js";
import { NotFoundError, BadRequestError } from "../../src/error/AppError.js";

// ─── helpers ─────────────────────────────────────────────────────────────────

function buildRepoMock() {
    return {
        guardar:                   jest.fn(),
        obtenerNoLeidasPorUsuario: jest.fn(),
        obtenerLeidasPorUsuario:   jest.fn(),
        obtenerPorId:              jest.fn(),
        marcarComoLeida:           jest.fn(),
    };
}

// ─── fixtures ─────────────────────────────────────────────────────────────────
const DESTINATARIO_ID  = "usuario-medico-1";
const REMITENTE_ID     = "usuario-paciente-1";
const NOTIF_ID         = "notif-abc-123";
const TIPO             = TipoNotificacion.TURNO_RESERVADO;
const MENSAJE          = "Nueva reserva: paciente solicitó turno de Cardiología.";

// ─── suite ───────────────────────────────────────────────────────────────────
describe("NotificacionService", () => {

    // ── crearNotificacion ────────────────────────────────────────────────────
    describe("crearNotificacion", () => {

        test("crea y persiste una notificación válida llamando al repositorio", async () => {
            const repo    = buildRepoMock();
            const savedDoc = { _id: NOTIF_ID, destinatario: DESTINATARIO_ID, remitente: REMITENTE_ID, mensaje: MENSAJE, tipo: TIPO, leida: false };
            repo.guardar.mockResolvedValue(savedDoc);

            const service = new NotificacionService(repo);
            const result  = await service.crearNotificacion(DESTINATARIO_ID, REMITENTE_ID, MENSAJE, TIPO);

            expect(repo.guardar).toHaveBeenCalledTimes(1);
            expect(result).toBe(savedDoc);
        });

        test("lanza BadRequestError si el tipo no existe en el enum", async () => {
            const repo    = buildRepoMock();
            const service = new NotificacionService(repo);

            await expect(
                service.crearNotificacion(DESTINATARIO_ID, REMITENTE_ID, MENSAJE, "TIPO_INEXISTENTE")
            ).rejects.toBeInstanceOf(BadRequestError);

            expect(repo.guardar).not.toHaveBeenCalled();
        });

        test("lanza BadRequestError si falta el destinatario", async () => {
            const repo    = buildRepoMock();
            const service = new NotificacionService(repo);

            await expect(
                service.crearNotificacion(null, REMITENTE_ID, MENSAJE, TIPO)
            ).rejects.toBeInstanceOf(BadRequestError);
        });

        test("lanza BadRequestError si falta el remitente", async () => {
            const repo    = buildRepoMock();
            const service = new NotificacionService(repo);

            await expect(
                service.crearNotificacion(DESTINATARIO_ID, null, MENSAJE, TIPO)
            ).rejects.toBeInstanceOf(BadRequestError);
        });

        test("lanza BadRequestError si el mensaje está vacío", async () => {
            const repo    = buildRepoMock();
            const service = new NotificacionService(repo);

            await expect(
                service.crearNotificacion(DESTINATARIO_ID, REMITENTE_ID, "", TIPO)
            ).rejects.toBeInstanceOf(BadRequestError);
        });
    });

    // ── obtenerNoLeidas ──────────────────────────────────────────────────────
    describe("obtenerNoLeidas", () => {

        test("delega al repositorio y retorna las notificaciones sin leer", async () => {
            const repo  = buildRepoMock();
            const lista = [
                { _id: "n1", destinatario: DESTINATARIO_ID, leida: false, tipo: TipoNotificacion.TURNO_RESERVADO },
                { _id: "n2", destinatario: DESTINATARIO_ID, leida: false, tipo: TipoNotificacion.RECORDATORIO_TURNO },
            ];
            repo.obtenerNoLeidasPorUsuario.mockResolvedValue(lista);

            const service = new NotificacionService(repo);
            const result  = await service.obtenerNoLeidas(DESTINATARIO_ID);

            expect(repo.obtenerNoLeidasPorUsuario).toHaveBeenCalledWith(DESTINATARIO_ID);
            expect(result).toHaveLength(2);
            expect(result.every(n => !n.leida)).toBe(true);
        });

        test("retorna array vacío si el usuario no tiene notificaciones sin leer", async () => {
            const repo = buildRepoMock();
            repo.obtenerNoLeidasPorUsuario.mockResolvedValue([]);

            const result = await new NotificacionService(repo).obtenerNoLeidas(DESTINATARIO_ID);

            expect(result).toEqual([]);
        });

        test("lanza BadRequestError si usuarioId es nulo", async () => {
            const repo    = buildRepoMock();
            const service = new NotificacionService(repo);

            await expect(service.obtenerNoLeidas(null)).rejects.toBeInstanceOf(BadRequestError);
            expect(repo.obtenerNoLeidasPorUsuario).not.toHaveBeenCalled();
        });

        test("lanza BadRequestError si usuarioId es undefined", async () => {
            const repo    = buildRepoMock();
            const service = new NotificacionService(repo);

            await expect(service.obtenerNoLeidas(undefined)).rejects.toBeInstanceOf(BadRequestError);
        });
    });

    // ── obtenerLeidas ────────────────────────────────────────────────────────
    describe("obtenerLeidas", () => {

        test("delega al repositorio y retorna las notificaciones ya leídas", async () => {
            const repo  = buildRepoMock();
            const lista = [
                { _id: "n3", destinatario: DESTINATARIO_ID, leida: true, tipo: TipoNotificacion.TURNO_CONFIRMADO },
            ];
            repo.obtenerLeidasPorUsuario.mockResolvedValue(lista);

            const service = new NotificacionService(repo);
            const result  = await service.obtenerLeidas(DESTINATARIO_ID);

            expect(repo.obtenerLeidasPorUsuario).toHaveBeenCalledWith(DESTINATARIO_ID);
            expect(result).toHaveLength(1);
            expect(result[0].leida).toBe(true);
        });

        test("retorna array vacío si el usuario no tiene notificaciones leídas", async () => {
            const repo = buildRepoMock();
            repo.obtenerLeidasPorUsuario.mockResolvedValue([]);

            const result = await new NotificacionService(repo).obtenerLeidas(DESTINATARIO_ID);

            expect(result).toEqual([]);
        });

        test("lanza BadRequestError si usuarioId es nulo", async () => {
            const repo    = buildRepoMock();
            const service = new NotificacionService(repo);

            await expect(service.obtenerLeidas(null)).rejects.toBeInstanceOf(BadRequestError);
            expect(repo.obtenerLeidasPorUsuario).not.toHaveBeenCalled();
        });
    });

    // ── marcarComoLeida ──────────────────────────────────────────────────────
    describe("marcarComoLeida", () => {

        test("marca la notificación como leída exitosamente", async () => {
            const repo = buildRepoMock();
            const notifEnDB    = { _id: NOTIF_ID, destinatario: DESTINATARIO_ID, leida: false };
            const notifLeida   = { ...notifEnDB, leida: true, fechaHoraLeida: new Date() };

            repo.obtenerPorId.mockResolvedValue(notifEnDB);
            repo.marcarComoLeida.mockResolvedValue(notifLeida);

            const service = new NotificacionService(repo);
            const result  = await service.marcarComoLeida(NOTIF_ID, DESTINATARIO_ID);

            expect(repo.obtenerPorId).toHaveBeenCalledWith(NOTIF_ID);
            expect(repo.marcarComoLeida).toHaveBeenCalledWith(NOTIF_ID);
            expect(result.leida).toBe(true);
        });

        test("es idempotente: si ya estaba leída no invoca marcarComoLeida del repo", async () => {
            const repo = buildRepoMock();
            const notifYaLeida = { _id: NOTIF_ID, destinatario: DESTINATARIO_ID, leida: true, fechaHoraLeida: new Date() };
            repo.obtenerPorId.mockResolvedValue(notifYaLeida);

            const service = new NotificacionService(repo);
            const result  = await service.marcarComoLeida(NOTIF_ID, DESTINATARIO_ID);

            expect(repo.marcarComoLeida).not.toHaveBeenCalled();
            expect(result).toBe(notifYaLeida);
        });

        test("lanza NotFoundError si la notificación no existe en la base", async () => {
            const repo = buildRepoMock();
            repo.obtenerPorId.mockResolvedValue(null);

            const service = new NotificacionService(repo);

            await expect(
                service.marcarComoLeida(NOTIF_ID, DESTINATARIO_ID)
            ).rejects.toBeInstanceOf(NotFoundError);
        });

        test("lanza BadRequestError si el usuario no es el destinatario (autorización)", async () => {
            const repo = buildRepoMock();
            repo.obtenerPorId.mockResolvedValue({
                _id: NOTIF_ID,
                destinatario: "otro-usuario-789",
                leida: false,
            });

            const service = new NotificacionService(repo);

            await expect(
                service.marcarComoLeida(NOTIF_ID, DESTINATARIO_ID)
            ).rejects.toBeInstanceOf(BadRequestError);

            expect(repo.marcarComoLeida).not.toHaveBeenCalled();
        });

        test("lanza BadRequestError si notificacionId es nulo", async () => {
            const repo    = buildRepoMock();
            const service = new NotificacionService(repo);

            await expect(
                service.marcarComoLeida(null, DESTINATARIO_ID)
            ).rejects.toBeInstanceOf(BadRequestError);

            expect(repo.obtenerPorId).not.toHaveBeenCalled();
        });

        test("lanza BadRequestError si usuarioId es nulo", async () => {
            const repo    = buildRepoMock();
            const service = new NotificacionService(repo);

            await expect(
                service.marcarComoLeida(NOTIF_ID, null)
            ).rejects.toBeInstanceOf(BadRequestError);

            expect(repo.obtenerPorId).not.toHaveBeenCalled();
        });
    });
});
