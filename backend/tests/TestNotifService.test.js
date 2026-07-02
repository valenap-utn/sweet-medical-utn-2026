import {beforeEach, describe, expect, jest, test} from "@jest/globals";
import {NotificacionService} from "../../src/services/NotificacionService.js";
import {TipoNotificacion} from "../../src/domain/Notificacion.js";
import {BadRequestError, NotFoundError} from "../../src/error/AppError.js";

describe("NotificacionService tests", () => {
    let notificacionRepository;
    let notificacionService;

    // Factory de repositorio mockeado
    const buildRepository = () => ({
        guardar: jest.fn(),
        obtenerNoLeidasPorUsuario: jest.fn(),
        obtenerLeidasPorUsuario: jest.fn(),
        obtenerPorId: jest.fn(),
        marcarComoLeida: jest.fn(),
    });

    // Factory de notificaciones válidas
    const buildNotificacion = (overrides = {}) => ({
        _id: "notif-1",
        destinatario: "usuario-destino-1",
        remitente: "usuario-origen-1",
        mensaje: "Nueva reserva de turno",
        tipo: TipoNotificacion.TURNO_RESERVADO,
        leida: false,
        fechaHoraLeida: null,
        ...overrides,
    });

    beforeEach(() => {
        notificacionRepository = buildRepository();
        notificacionService = new NotificacionService(notificacionRepository);
    });

    // ── crearNotificacion ────────────────────────────────────────────────────
    describe("crearNotificacion", () => {
        test("crea y persiste una notificación válida llamando al repositorio", async () => {
            const notificacion = buildNotificacion();

            notificacionRepository.guardar.mockResolvedValue(notificacion);

            const resultado = await notificacionService.crearNotificacion({
                destinatarioId: notificacion.destinatario,
                remitenteId: notificacion.remitente,
                mensaje: notificacion.mensaje,
                tipo: notificacion.tipo,
            });

            expect(notificacionRepository.guardar).toHaveBeenCalledTimes(1);
            expect(notificacionRepository.guardar).toHaveBeenCalledWith({
                notificacion: expect.objectContaining({
                    destinatario: notificacion.destinatario,
                    remitente: notificacion.remitente,
                    mensaje: notificacion.mensaje,
                    tipo: notificacion.tipo,
                }),
            });

            expect(resultado).toBe(notificacion);
        });

        test("lanza BadRequestError si el tipo no existe en el enum", async () => {
            const notificacion = buildNotificacion({
                tipo: "TIPO_INEXISTENTE",
            });

            await expect(
                notificacionService.crearNotificacion({
                    destinatarioId: notificacion.destinatario,
                    remitenteId: notificacion.remitente,
                    mensaje: notificacion.mensaje,
                    tipo: notificacion.tipo,
                })
            ).rejects.toBeInstanceOf(BadRequestError);

            expect(notificacionRepository.guardar).not.toHaveBeenCalled();
        });

        test("lanza BadRequestError si falta el destinatario", async () => {
            const notificacion = buildNotificacion({
                destinatario: null,
            });

            await expect(
                notificacionService.crearNotificacion({
                    destinatarioId: notificacion.destinatario,
                    remitenteId: notificacion.remitente,
                    mensaje: notificacion.mensaje,
                    tipo: notificacion.tipo,
                })
            ).rejects.toBeInstanceOf(BadRequestError);

            expect(notificacionRepository.guardar).not.toHaveBeenCalled();
        });

        test("lanza BadRequestError si falta el remitente", async () => {
            const notificacion = buildNotificacion({
                remitente: null,
            });

            await expect(
                notificacionService.crearNotificacion({
                    destinatarioId: notificacion.destinatario,
                    remitenteId: notificacion.remitente,
                    mensaje: notificacion.mensaje,
                    tipo: notificacion.tipo,
                })
            ).rejects.toBeInstanceOf(BadRequestError);

            expect(notificacionRepository.guardar).not.toHaveBeenCalled();
        });

        test("lanza BadRequestError si el mensaje está vacío", async () => {
            const notificacion = buildNotificacion({
                mensaje: "",
            });

            await expect(
                notificacionService.crearNotificacion({
                    destinatarioId: notificacion.destinatario,
                    remitenteId: notificacion.remitente,
                    mensaje: notificacion.mensaje,
                    tipo: notificacion.tipo,
                })
            ).rejects.toBeInstanceOf(BadRequestError);

            expect(notificacionRepository.guardar).not.toHaveBeenCalled();
        });
    });

    // ── obtenerNoLeidas ──────────────────────────────────────────────────────
    describe("obtenerNoLeidas", () => {
        test("delega al repositorio y retorna las notificaciones sin leer", async () => {
            const usuarioId = "usuario-medico-1";

            const notificaciones = [
                buildNotificacion({_id: "notif-1", leida: false}),
                buildNotificacion({_id: "notif-2", leida: false}),
            ];

            notificacionRepository.obtenerNoLeidasPorUsuario.mockResolvedValue(notificaciones);

            const resultado = await notificacionService.obtenerNoLeidas({usuarioId});

            expect(notificacionRepository.obtenerNoLeidasPorUsuario)
                .toHaveBeenCalledWith({usuarioId});

            expect(resultado).toHaveLength(2);
            expect(resultado.every(n => !n.leida)).toBe(true);
        });

        test("retorna array vacío si el usuario no tiene notificaciones sin leer", async () => {
            const usuarioId = "usuario-medico-1";

            notificacionRepository.obtenerNoLeidasPorUsuario.mockResolvedValue([]);

            const resultado = await notificacionService.obtenerNoLeidas({usuarioId});

            expect(resultado).toEqual([]);
        });

        test("lanza BadRequestError si usuarioId es nulo", async () => {
            await expect(
                notificacionService.obtenerNoLeidas({usuarioId: null})
            ).rejects.toBeInstanceOf(BadRequestError);

            expect(notificacionRepository.obtenerNoLeidasPorUsuario).not.toHaveBeenCalled();
        });

        test("lanza BadRequestError si usuarioId es undefined", async () => {
            await expect(
                notificacionService.obtenerNoLeidas({usuarioId: undefined})
            ).rejects.toBeInstanceOf(BadRequestError);

            expect(
                notificacionRepository.obtenerNoLeidasPorUsuario
            ).not.toHaveBeenCalled();
        });
    });

    // ── obtenerLeidas ────────────────────────────────────────────────────────
    describe("obtenerLeidas", () => {
        test("delega al repositorio y retorna las notificaciones ya leídas", async () => {
            const usuarioId = "usuario-medico-1";

            const notificaciones = [
                buildNotificacion({
                    _id: "notif-3",
                    leida: true,
                    fechaHoraLeida: new Date(),
                }),
            ];

            notificacionRepository.obtenerLeidasPorUsuario.mockResolvedValue(notificaciones);

            const resultado = await notificacionService.obtenerLeidas({usuarioId});

            expect(notificacionRepository.obtenerLeidasPorUsuario)
                .toHaveBeenCalledWith({usuarioId});

            expect(resultado).toHaveLength(1);
            expect(resultado[0].leida).toBe(true);
        });

        test("retorna array vacío si el usuario no tiene notificaciones leídas", async () => {
            const usuarioId = "usuario-medico-1";

            notificacionRepository.obtenerLeidasPorUsuario.mockResolvedValue([]);

            const resultado = await notificacionService.obtenerLeidas({usuarioId});

            expect(resultado).toEqual([]);
        });

        test("lanza BadRequestError si usuarioId es nulo", async () => {
            await expect(
                notificacionService.obtenerLeidas({usuarioId: null})
            ).rejects.toBeInstanceOf(BadRequestError);

            expect(notificacionRepository.obtenerLeidasPorUsuario).not.toHaveBeenCalled();
        });
    });

    // ── marcarComoLeida ──────────────────────────────────────────────────────
    describe("marcarComoLeida", () => {
        test("marca la notificación como leída exitosamente", async () => {
            const notificacion = buildNotificacion();

            const notificacionLeida = buildNotificacion({
                leida: true,
                fechaHoraLeida: new Date(),
            });

            notificacionRepository.obtenerPorId.mockResolvedValue(notificacion);
            notificacionRepository.marcarComoLeida.mockResolvedValue(notificacionLeida);

            const resultado = await notificacionService.marcarComoLeida({
                notificacionId: notificacion._id,
                usuarioId: notificacion.destinatario,
            });

            expect(notificacionRepository.obtenerPorId).toHaveBeenCalledWith({notificacionId: notificacion._id});

            expect(notificacionRepository.marcarComoLeida).toHaveBeenCalledWith({notificacionId: notificacion._id});

            expect(resultado.leida).toBe(true);
        });

        test("es idempotente: si ya estaba leída no invoca marcarComoLeida del repo", async () => {
            const notificacionYaLeida = buildNotificacion({
                leida: true,
                fechaHoraLeida: new Date(),
            });

            notificacionRepository.obtenerPorId.mockResolvedValue(notificacionYaLeida);

            const resultado = await notificacionService.marcarComoLeida({
                notificacionId: notificacionYaLeida._id,
                usuarioId: notificacionYaLeida.destinatario
            });

            expect(notificacionRepository.marcarComoLeida).not.toHaveBeenCalled();
            expect(resultado).toBe(notificacionYaLeida);
        });

        test("lanza NotFoundError si la notificación no existe en la base", async () => {
            const notificacion = buildNotificacion();

            notificacionRepository.obtenerPorId.mockResolvedValue(null);

            await expect(
                notificacionService.marcarComoLeida({
                    notificacionId: notificacion._id,
                    usuarioId: notificacion.destinatario
                })
            ).rejects.toBeInstanceOf(NotFoundError);
        });

        test("lanza BadRequestError si el usuario no es el destinatario", async () => {
            const notificacion = buildNotificacion({
                destinatario: "otro-usuario-789",
            });

            notificacionRepository.obtenerPorId.mockResolvedValue(notificacion);

            await expect(
                notificacionService.marcarComoLeida({
                    notificacionId: notificacion._id,
                    usuarioId: "usuario-medico-1"
                })
            ).rejects.toBeInstanceOf(BadRequestError);

            expect(notificacionRepository.marcarComoLeida).not.toHaveBeenCalled();
        });

        test("lanza BadRequestError si notificacionId es nulo", async () => {
            await expect(
                notificacionService.marcarComoLeida({notificacionId: null, usuarioId: "usuario-medico-1"})
            ).rejects.toBeInstanceOf(BadRequestError);

            expect(notificacionRepository.obtenerPorId).not.toHaveBeenCalled();
        });

        test("lanza BadRequestError si usuarioId es nulo", async () => {
            const notificacion = buildNotificacion();

            await expect(
                notificacionService.marcarComoLeida({notificacionId: notificacion._id, usuarioId: null})
            ).rejects.toBeInstanceOf(BadRequestError);

            expect(notificacionRepository.obtenerPorId).not.toHaveBeenCalled();
        });
    });
});