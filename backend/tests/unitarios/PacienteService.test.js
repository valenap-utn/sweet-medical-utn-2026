import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import { PacienteService } from "../../src/services/PacienteService.js";
import { EstadoTurno } from "../../src/domain/enums/EstadoTurno.js";

describe("PacienteService", () => {
    let pacienteRepository;
    let turnoRepository;
    let pacienteService;

    beforeEach(() => {
        pacienteRepository = {
            findById: jest.fn(),
        };

        turnoRepository = {
            findById: jest.fn(),
            save: jest.fn(),
            findByPacienteId: jest.fn(),
        };

        pacienteService = new PacienteService({
            pacienteRepository,
            turnoRepository,
        });
    });

    test("reserva un turno disponible", async () => {
        const paciente = { _id: "paciente-1" };

        const turno = {
            _id: "turno-1",
            estado: EstadoTurno.DISPONIBLE,
            practica: { costo: 10000 },
            reservar: jest.fn(),
        };

        pacienteRepository.findById.mockResolvedValue(paciente);
        turnoRepository.findById.mockResolvedValue(turno);
        turnoRepository.save.mockResolvedValue(turno);

        const resultado = await pacienteService.reservarTurno({
            pacienteId: "paciente-1",
            turnoId: "turno-1",
        });

        expect(pacienteRepository.findById).toHaveBeenCalledWith("paciente-1");
        expect(turnoRepository.findById).toHaveBeenCalledWith("turno-1");

        expect(turno.reservar).toHaveBeenCalledWith({
            paciente: paciente._id,
            costo: 10000,
            turnoId: turno._id,
        });

        expect(turnoRepository.save).toHaveBeenCalledWith(turno);
        expect(resultado).toBe(turno);
    });

    test("no reserva un turno si el paciente no existe", async () => {
        pacienteRepository.findById.mockResolvedValue(null);

        await expect(
            pacienteService.reservarTurno({
                pacienteId: "paciente-inexistente",
                turnoId: "turno-1",
            })
        ).rejects.toThrow("Paciente no encontrado.");
    });

    test("no reserva un turno si el turno no existe", async () => {
        pacienteRepository.findById.mockResolvedValue({ _id: "paciente-1" });
        turnoRepository.findById.mockResolvedValue(null);

        await expect(
            pacienteService.reservarTurno({
                pacienteId: "paciente-1",
                turnoId: "turno-inexistente",
            })
        ).rejects.toThrow("Turno no encontrado.");
    });

    test("no reserva un turno si no está disponible", async () => {
        pacienteRepository.findById.mockResolvedValue({ _id: "paciente-1" });

        turnoRepository.findById.mockResolvedValue({
            _id: "turno-1",
            estado: EstadoTurno.RESERVADO,
        });

        await expect(
            pacienteService.reservarTurno({
                pacienteId: "paciente-1",
                turnoId: "turno-1",
            })
        ).rejects.toThrow("El turno no está disponible.");
    });

    test("obtiene historial de turnos del paciente", async () => {
        const turnos = [
            { _id: "turno-1" },
            { _id: "turno-2" },
        ];

        turnoRepository.findByPacienteId.mockResolvedValue(turnos);

        const resultado = await pacienteService.obtenerHistorial({
            pacienteId: "paciente-1",
        });

        expect(turnoRepository.findByPacienteId).toHaveBeenCalledWith("paciente-1");
        expect(resultado).toEqual(turnos);
    });

    test("cancela un turno del paciente con motivo válido", async () => {
        const fechaFutura = new Date();
        fechaFutura.setHours(fechaFutura.getHours() + 3);

        const turno = {
            _id: "turno-1",
            paciente: "paciente-1",
            fechaHoraInicio: fechaFutura,
            actualizarEstado: jest.fn(),
        };

        turnoRepository.findById.mockResolvedValue(turno);
        turnoRepository.save.mockResolvedValue(turno);

        const resultado = await pacienteService.cancelarTurno({
            pacienteId: "paciente-1",
            turnoId: "turno-1",
            motivo: "No puedo asistir",
        });

        expect(turno.actualizarEstado).toHaveBeenCalledWith({
            nuevoEstado: EstadoTurno.CANCELADO,
            usuario: "paciente-1",
            motivo: "No puedo asistir",
            turnoId: "turno-1",
        });

        expect(turnoRepository.save).toHaveBeenCalledWith(turno);
        expect(resultado).toBe(turno);
    });

    test("no cancela un turno sin motivo", async () => {
        await expect(
            pacienteService.cancelarTurno({
                pacienteId: "paciente-1",
                turnoId: "turno-1",
                motivo: "",
            })
        ).rejects.toThrow("Debe indicar un motivo de cancelación.");
    });

    test("no cancela un turno que no pertenece al paciente", async () => {
        turnoRepository.findById.mockResolvedValue({
            _id: "turno-1",
            paciente: "otro-paciente",
            fechaHoraInicio: new Date("2026-06-01T10:00:00"),
        });

        await expect(
            pacienteService.cancelarTurno({
                pacienteId: "paciente-1",
                turnoId: "turno-1",
                motivo: "No puedo asistir",
            })
        ).rejects.toThrow("El turno no pertenece al paciente.");
    });

    test("solicita cambio de fecha de un turno", async () => {
        const turno = {
            _id: "turno-1",
            paciente: "paciente-1",
            actualizarEstado: jest.fn(),
        };

        pacienteRepository.findById.mockResolvedValue({ _id: "paciente-1" });
        turnoRepository.findById.mockResolvedValue(turno);
        turnoRepository.save.mockResolvedValue(turno);

        const nuevaFechaHora = "2026-06-10T15:30:00";

        const resultado = await pacienteService.solicitarCambioFecha({
            pacienteId: "paciente-1",
            turnoId: "turno-1",
            nuevaFechaHora,
        });

        expect(turno.fechaHoraSolicitada).toEqual(new Date("2026-06-10T15:30:00"));

        expect(turno.actualizarEstado).toHaveBeenCalledWith({
            nuevoEstado: EstadoTurno.RESERVADO,
            usuario: "paciente-1",
            motivo: "Solicitud de cambio de fecha",
            turnoId: "turno-1",
        });

        expect(turnoRepository.save).toHaveBeenCalledWith(turno);
        expect(resultado).toBe(turno);
    });
});