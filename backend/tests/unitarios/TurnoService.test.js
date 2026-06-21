import {
    describe,
    expect,
    jest,
    test,
} from "@jest/globals";

import { TurnoService } from "../../src/services/TurnoService.js";
import { NivelCobertura } from "../../src/domain/enums/NivelCobertura.js";
import { TipoServicio } from "../../src/domain/enums/TipoServicio.js";

describe("TurnoService - búsqueda personalizada", () => {
    test("devuelve cobertura parcial y calcula el 50% del costo", async () => {
        const practica = {
            _id: "practica-1",
            codigo: "RX-001",
            nombre: "Radiografía",
            costo: 10000,
            duracionTurnoEnMins: 30,
        };

        const turno = {
            _id: "turno-1",
            medico: {
                _id: "medico-1",
                nombre: "Dra. Pérez",
            },
            sede: {
                _id: "sede-1",
                nombre: "Sede Centro",
            },
            tipoServicio: TipoServicio.PRACTICA,
            especialidad: null,
            practica,
            estado: "Disponible",
            costo: null,
            fechaHoraInicio: new Date("2026-07-10T10:00:00"),
            fechaHoraFin: new Date("2026-07-10T10:30:00"),
        };

        const paciente = {
            _id: "paciente-1",
            plan: {
                obtenerCoberturaPractica: jest
                    .fn()
                    .mockReturnValue(NivelCobertura.PARCIAL),
            },
        };

        const turnoRepository = {
            buscarTurnosDisponibles: jest.fn().mockResolvedValue({
                turnos: [turno],
                total: 1,
                page: 1,
                limit: 10,
            }),
        };

        const pacienteRepository = {
            findById: jest.fn().mockResolvedValue(paciente),
        };

        const service = new TurnoService(
            turnoRepository,
            pacienteRepository
        );

        const resultado =
            await service.buscarTurnosDisponibles({
                filtros: {
                    page: 1,
                    limit: 10,
                },
                usuario: {
                    usuarioId: "usuario-1",
                    pacienteId: "paciente-1",
                    rol: "PACIENTE",
                },
            });

        expect(pacienteRepository.findById)
            .toHaveBeenCalledWith("paciente-1");

        expect(turnoRepository.buscarTurnosDisponibles)
            .toHaveBeenCalled();

        expect(resultado.total).toBe(1);
        expect(resultado.turnos).toHaveLength(1);
        expect(resultado.turnos[0].cobertura)
            .toBe("PARCIAL");
        expect(resultado.turnos[0].costo)
            .toBe(5000);

        // La búsqueda calcula un estimado,
        // pero no modifica el turno persistido.
        expect(turno.costo).toBeNull();
    });
});