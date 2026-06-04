import {describe, expect, test} from '@jest/globals';
import {EstadoTurno} from "../../src/domain/enums/EstadoTurno.js";
import {Turno} from "../../src/domain/Turno.js";
import {TipoServicio} from "../../src/domain/enums/TipoServicio.js";
import {TurnoInvalido} from "../../src/exceptions/TurnoInvalido.js";

describe("Turno", () => {
    const medico = { id: "medico-1" };
    const paciente = { id: "paciente-1" };
    const sede = { id: "sede-1" };
    const practica = { id: "practica-1", costo: 10000 };

    test("crea un turno disponible correctamente", () => {
        const turno = new Turno({
            medico,
            sede,
            tipoServicio: TipoServicio.PRACTICA,
            practica,
            fechaHoraInicio: new Date("2026-06-01T10:00:00"),
            fechaHoraFin: new Date("2026-06-01T10:30:00"),
        });

        expect(turno.estado).toBe(EstadoTurno.DISPONIBLE.nombre);
        expect(turno.paciente).toBeNull();
        expect(turno.costo).toBeNull();
        expect(turno.historialEstados).toEqual([]);
    });

    test("no permite crear un turno sin práctica si el tipo de servicio es PRACTICA", () => {
        expect(() => {
            new Turno({
                medico,
                sede,
                tipoServicio: TipoServicio.PRACTICA,
                fechaHoraInicio: new Date("2026-06-01T10:00:00"),
                fechaHoraFin: new Date("2026-06-01T10:30:00"),
            });
        }).toThrow(TurnoInvalido);
    });

    test("no permite crear un turno con especialidad y práctica al mismo tiempo", () => {
        expect(() => {
            new Turno({
                medico,
                sede,
                tipoServicio: TipoServicio.PRACTICA,
                especialidad: { id: "especialidad-1" },
                practica,
                fechaHoraInicio: new Date("2026-06-01T10:00:00"),
                fechaHoraFin: new Date("2026-06-01T10:30:00"),
            });
        }).toThrow(TurnoInvalido);
    });

    test("permite reservar un turno disponible", () => {
        const turno = new Turno({
            medico,
            sede,
            tipoServicio: TipoServicio.PRACTICA,
            practica,
            fechaHoraInicio: new Date("2026-06-01T10:00:00"),
            fechaHoraFin: new Date("2026-06-01T10:30:00"),
        });

        turno.reservar({
            paciente,
            costo: 5000,
            turnoId: "turno-1",
        });

        expect(turno.estado).toBe(EstadoTurno.RESERVADO.nombre);
        expect(turno.paciente).toBe(paciente);
        expect(turno.costo).toBe(5000);
        expect(turno.historialEstados).toHaveLength(1);
        expect(turno.historialEstados[0].motivo).toBe("Reserva de Turno");
    });

    test("no permite reservar un turno que no está disponible", () => {
        const turno = new Turno({
            medico,
            paciente,
            sede,
            tipoServicio: TipoServicio.PRACTICA,
            practica,
            fechaHoraInicio: new Date("2026-06-01T10:00:00"),
            fechaHoraFin: new Date("2026-06-01T10:30:00"),
            estado: EstadoTurno.RESERVADO.nombre,
            costo: 5000,
        });

        expect(() => {
            turno.reservar({
                paciente,
                costo: 5000,
                turnoId: "turno-1",
            });
        }).toThrow(TurnoInvalido);
    });
});