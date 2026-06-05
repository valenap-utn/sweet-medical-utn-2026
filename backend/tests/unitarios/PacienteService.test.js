import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import {EstadoTurno} from "../../src/domain/enums/EstadoTurno.js";
import {PacienteService} from "../../src/services/PacienteService.js";

describe('PacienteService tests', () => {
    let pacienteRepository;
    let turnoRepository;

    let pacienteService;

    // Con este build podemos sobreescribir props. especificas sin repetir todo el objeto
    const buildPaciente = (overrides = {}) => ({
        _id: "paciente-1",
        plan: null,
        ...overrides,
    });

    // Con este build centralizamos la creación de un turno válido, tmb. permitiendonos
    // modificar unicamente las props. relevantes para cada escenario
    const buildTurno = (overrides = {}) => ({
        _id: "turno-1",
        paciente: "paciente-1",
        estado: EstadoTurno.DISPONIBLE.nombre,
        practica: {costo: 10000},
        especialidad: null,
        fechaHoraInicio: new Date(Date.now() + 3 * 60 * 60 * 1000), // +3hr
        reservar: jest.fn(), //para mock
        actualizarEstado: jest.fn(),
        ...overrides,
    });

    beforeEach(() => {
        // Mocks de repositories utilizados por el servicio
        pacienteRepository = {findById: jest.fn(),};
        turnoRepository = {
            findById: jest.fn(),
            save: jest.fn(),
            findByPacienteId: jest.fn(),
        };

        // Instancia del servicio para prueba
        pacienteService = new PacienteService({pacienteRepository, turnoRepository});
    });

    test("reserva un turno disponible", async () => {
        const paciente = buildPaciente();
        const turno = buildTurno();

        pacienteRepository.findById.mockResolvedValue(paciente);
        turnoRepository.findById.mockResolvedValue(turno);
        turnoRepository.save.mockResolvedValue(turno);

        const resultado = await pacienteService.reservarTurno({
            pacienteId: paciente._id,
            turnoId: turno._id,
        });

        expect(pacienteRepository.findById).toHaveBeenCalledWith(paciente._id);
        expect(turnoRepository.findById).toHaveBeenCalledWith(turno._id);

        expect(turno.reservar).toHaveBeenCalledWith({
            paciente: paciente._id,
            costo: 10000,
            turnoId: turno._id,
        });

        expect(turnoRepository.save).toHaveBeenCalledWith(turno);
        expect(resultado).toBe(turno);
    });

    test("NO reserva un turno si el PACIENTE NO EXISTE", async () => {
        pacienteRepository.findById.mockResolvedValue(null);

        const turno = buildTurno();
        turnoRepository.findById.mockResolvedValue(turno);

        await expect(
            pacienteService.reservarTurno({
                pacienteId: "paciente-inexistente",
                turnoId: turno._id,
            })
        ).rejects.toThrow("No se encontró al paciente con id: paciente-inexistente.")
    });

    test("NO reserva un turno si el TURNO NO EXISTE", async () => {
        const paciente = buildPaciente();
        pacienteRepository.findById.mockResolvedValue(paciente);

        turnoRepository.findById.mockResolvedValue(null);

        await expect(
            pacienteService.reservarTurno({
                pacienteId: paciente._id,
                turnoId: "turno-inexistente",
            })
        ).rejects.toThrow(("No se encontró el turno con id: turno-inexistente."));
    });

    test("NO reserva un turno SI NO ESTÁ DISPONIBLE", async () => {
        const paciente = buildPaciente();
        pacienteRepository.findById.mockResolvedValue(paciente);

        const turno = buildTurno({estado: EstadoTurno.RESERVADO.nombre});
        turnoRepository.findById.mockResolvedValue(turno);

        await expect(pacienteService.reservarTurno({
                pacienteId: paciente._id,
                turnoId: turno._id,
            })
        ).rejects.toThrow("El turno con id: turno-1 no puede reservarse porque su estado actual es Reservado.");
    });

    test("obtiene historial de turnos del paciente", async () => {
        const turnos = [
            {_id: "turno-1"},
            {_id: "turno-2"},
        ];

        turnoRepository.findByPacienteId.mockResolvedValue(turnos);

        const resultado = await pacienteService.obtenerHistorial({pacienteId: "paciente-1"});

        expect(turnoRepository.findByPacienteId).toHaveBeenCalledWith("paciente-1");
        expect(resultado).toEqual(turnos);
    });

    test("cancela un turno del paciente con motivo válido", async () => {
        const turno = buildTurno({estado: EstadoTurno.CONFIRMADO.nombre,});

        turnoRepository.findById.mockResolvedValue(turno);
        turnoRepository.save.mockResolvedValue(turno);

        const resultado = await pacienteService.cancelarTurno({
            pacienteId: "paciente-1",
            turnoId: turno._id,
            motivo: "No puedo asistir",
        });

        expect(turno.actualizarEstado).toHaveBeenCalledWith({
            nuevoEstado: EstadoTurno.CANCELADO.nombre,
            usuario: "paciente-1",
            motivo: "No puedo asistir",
            turnoId: turno._id,
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
        const otroPaciente = buildPaciente({pacienteId: "paciente-2"});
        turnoRepository.findById.mockResolvedValue(otroPaciente);

        await expect(
            pacienteService.cancelarTurno({
                pacienteId: "paciente-1",
                turnoId: "turno-1",
                motivo: "No puedo asistir",
            })
        ).rejects.toThrow("El turno con id: paciente-1 no pertenece al paciente paciente-1.");
    });

    test("solicita cambio de fecha de un turno", async () => {
        const turno = buildTurno({estado: EstadoTurno.CONFIRMADO.nombre});
        const paciente = buildPaciente();

        pacienteRepository.findById.mockResolvedValue(paciente);
        turnoRepository.findById.mockResolvedValue(turno);
        turnoRepository.save.mockResolvedValue(turno);

        const nuevaFechaHora = "2026-06-10T15:30:00";

        const resultado = await pacienteService.solicitarCambioFecha({
            pacienteId: paciente._id,
            turnoId: turno._id,
            nuevaFechaHora,
        });

        expect(turno.fechaHoraSolicitada).toEqual(new Date("2026-06-10T15:30:00"));
        expect(turno.actualizarEstado).toHaveBeenCalledWith({
            nuevoEstado: EstadoTurno.RESERVADO.nombre,
            usuario: paciente._id,
            motivo: "Solicitud de cambio de fecha pendiente de confirmación médica.",
            turnoId: turno._id,
        });

        expect(turnoRepository.save).toHaveBeenCalledWith(turno);
        expect(resultado).toBe(turno);
    })
})
