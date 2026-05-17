import { Notificacion, TipoNotificacion } from "../../src/domain/Notificacion.js";
import { NotificacionInvalida } from "../../src/exceptions/NotificacionInvalida.js";

const TIPO  = TipoNotificacion.DONACION_ASIGNADA;
const ID    = "notif-1";
const USER  = "user-1";
const MSG   = "Tu donación fue asignada.";

describe("Notificacion (dominio)", () => {

    test("se crea correctamente con parámetros válidos", () => {
        const n = new Notificacion(ID, USER, MSG, TIPO);

        expect(n.id).toBe(ID);
        expect(n.usuarioDestinatarioId).toBe(USER);
        expect(n.mensaje).toBe(MSG);
        expect(n.tipo).toBe(TIPO);
        expect(n.leida).toBe(false);
        expect(n.fechaHoraLeida).toBeNull();
        expect(n.fechaHoraCreacion).toBeDefined();
    });

    test("lanza NotificacionInvalida si falta algún campo obligatorio", () => {
        expect(() => new Notificacion(null, USER, MSG, TIPO)).toThrow(NotificacionInvalida);
        expect(() => new Notificacion(ID, null, MSG, TIPO)).toThrow(NotificacionInvalida);
        expect(() => new Notificacion(ID, USER, "",   TIPO)).toThrow(NotificacionInvalida);
        expect(() => new Notificacion(ID, USER, MSG,  null)).toThrow(NotificacionInvalida);
    });

    test("lanza NotificacionInvalida con tipo desconocido", () => {
        expect(() => new Notificacion(ID, USER, MSG, "TIPO_RARO")).toThrow(NotificacionInvalida);
    });

    test("marcarComoLeida actualiza el estado correctamente", () => {
        const n = new Notificacion(ID, USER, MSG, TIPO);
        n.marcarComoLeida();

        expect(n.leida).toBe(true);
        expect(n.fechaHoraLeida).not.toBeNull();
    });

    test("marcarComoLeida es idempotente", () => {
        const n = new Notificacion(ID, USER, MSG, TIPO);
        n.marcarComoLeida();
        const primeraFecha = n.fechaHoraLeida;
        n.marcarComoLeida();

        expect(n.fechaHoraLeida).toBe(primeraFecha); // no sobreescribe
    });

    test("todos los tipos del enum son válidos", () => {
        for (const tipo of Object.values(TipoNotificacion)) {
            expect(() => new Notificacion(ID, USER, MSG, tipo)).not.toThrow();
        }
    });
});
