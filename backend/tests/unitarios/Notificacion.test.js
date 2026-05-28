import { Notificacion, TipoNotificacion } from "../../src/domain/Notificacion.js";
import { NotificacionInvalida } from "../../src/exceptions/NotificacionInvalida.js";

// ─── fixtures ────────────────────────────────────────────────────────────────
const ID           = "notif-1";
const DESTINATARIO = "usuario-medico-1";
const REMITENTE    = "usuario-paciente-1";
const MENSAJE      = "Nueva reserva: Juan Pérez solicitó un turno de Cardiología para el 01/06/2026.";
const TIPO         = TipoNotificacion.TURNO_RESERVADO;

// ─── suite ───────────────────────────────────────────────────────────────────
describe("Notificacion (dominio)", () => {

    test("se crea correctamente con parámetros válidos", () => {
        const n = new Notificacion(ID, DESTINATARIO, REMITENTE, MENSAJE, TIPO);

        expect(n.id).toBe(ID);
        expect(n.destinatario).toBe(DESTINATARIO);
        expect(n.remitente).toBe(REMITENTE);
        expect(n.mensaje).toBe(MENSAJE);
        expect(n.tipo).toBe(TIPO);
        expect(n.leida).toBe(false);
        expect(n.fechaHoraLeida).toBeNull();
        expect(n.fechaHoraCreacion).toBeDefined();
    });

    test.each([
        [null, DESTINATARIO, REMITENTE, MENSAJE, TIPO, "id nulo"],
        [ID,   null,         REMITENTE, MENSAJE, TIPO, "destinatario nulo"],
        [ID,   DESTINATARIO, null,      MENSAJE, TIPO, "remitente nulo"],
        [ID,   DESTINATARIO, REMITENTE, "",      TIPO, "mensaje vacío"],
        [ID,   DESTINATARIO, REMITENTE, MENSAJE, null, "tipo nulo"],
    ])("lanza NotificacionInvalida cuando %s (%s)", (id, dest, rem, msg, tipo) => {
        expect(() => new Notificacion(id, dest, rem, msg, tipo)).toThrow(NotificacionInvalida);
    });

    test("lanza NotificacionInvalida con tipo desconocido", () => {
        expect(() => new Notificacion(ID, DESTINATARIO, REMITENTE, MENSAJE, "TIPO_INVENTADO"))
            .toThrow(NotificacionInvalida);
    });

    test("todos los valores del enum TipoNotificacion son válidos", () => {
        for (const tipo of Object.values(TipoNotificacion)) {
            expect(() => new Notificacion(ID, DESTINATARIO, REMITENTE, MENSAJE, tipo)).not.toThrow();
        }
    });

    test("marcarComoLeida actualiza leida y fechaHoraLeida", () => {
        const n = new Notificacion(ID, DESTINATARIO, REMITENTE, MENSAJE, TIPO);

        n.marcarComoLeida();

        expect(n.leida).toBe(true);
        expect(n.fechaHoraLeida).not.toBeNull();
    });

    test("marcarComoLeida es idempotente: no sobreescribe fechaHoraLeida en segunda llamada", () => {
        const n = new Notificacion(ID, DESTINATARIO, REMITENTE, MENSAJE, TIPO);

        n.marcarComoLeida();
        const primeraFecha = n.fechaHoraLeida;

        n.marcarComoLeida(); // segunda llamada

        expect(n.fechaHoraLeida).toBe(primeraFecha);
    });
});
