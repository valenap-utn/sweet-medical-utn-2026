import {Notificacion, TipoNotificacion} from "../../src/domain/Notificacion.js";
import {NotificacionInvalida} from "../../src/exceptions/NotificacionInvalida.js";
import {describe, expect, test} from "@jest/globals";

// ─── fixtures ────────────────────────────────────────────────────────────────
const ID = "notif-1";
const DESTINATARIO = "usuario-medico-1";
const REMITENTE = "usuario-paciente-1";
const MENSAJE = "Nueva reserva: Juan Pérez solicitó un turno de Cardiología para el 01/06/2026.";
const TIPO = TipoNotificacion.TURNO_RESERVADO;

function build(overrides = {}) {
    return new Notificacion({
        id: ID,
        destinatario: DESTINATARIO,
        remitente: REMITENTE,
        mensaje: MENSAJE,
        tipo: TIPO,
        ...overrides,
    });
}

// ─── suite ───────────────────────────────────────────────────────────────────
describe("Notificacion (dominio)", () => {

    test("se crea correctamente con parámetros válidos", () => {
        const n = build();

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
        [{id: null}, "id nulo"],
        [{destinatario: null}, "destinatario nulo"],
        [{remitente: null}, "remitente nulo"],
        [{mensaje: ""}, "mensaje vacío"],
        [{tipo: null}, "tipo nulo"],
    ])("lanza NotificacionInvalida cuando %s", (override) => {
        expect(() => build(override)).toThrow(NotificacionInvalida);
    });

    test("lanza NotificacionInvalida con tipo desconocido", () => {
        expect(() => build({tipo: "TIPO_INVENTADO"})).toThrow(NotificacionInvalida);
    });

    test("todos los valores del enum TipoNotificacion son válidos", () => {
        for (const tipo of Object.values(TipoNotificacion)) {
            expect(() => build({tipo})).not.toThrow();
        }
    });

    test("marcarComoLeida actualiza leida y fechaHoraLeida", () => {
        const n = build();

        n.marcarComoLeida();

        expect(n.leida).toBe(true);
        expect(n.fechaHoraLeida).not.toBeNull();
    });

    test("marcarComoLeida es idempotente: no sobreescribe fechaHoraLeida en segunda llamada", () => {
        const n = build();

        n.marcarComoLeida();
        const primeraFecha = n.fechaHoraLeida;

        n.marcarComoLeida(); // segunda llamada

        expect(n.fechaHoraLeida).toBe(primeraFecha);
    });
});
