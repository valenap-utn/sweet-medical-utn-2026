import {beforeEach, describe, expect, jest, test} from "@jest/globals";
import {EstadoTurno} from "../../src/domain/enums/EstadoTurno.js";
import {TurnoService} from "../../src/services/TurnoService.js";


describe("TurnoService tests", () => {
    let turnoRepository;
    let servicioRepository;

    let turnoService;

    const buildTurno = (overrides = {}) => ({
        _id: "turno-1",
        medico: {_id: "medico-1"},
        paciente: "paciente-1",
        estado: EstadoTurno.CONFIRMADO.nombre,
        fechaHoraInicio: new Date(Date.now() + 3 * 60 * 60 * 1000),
        fechaHoraSolicitada: null,
        actualizarEstado: jest.fn(),
        ...overrides,
    });

    const buildEspecialidad = (overrides = {}) => ({
        _id: "esp-1",
        nombre: "Cardiología",
        duracionTurnoEnMins: 30,
        costo: 10000,
        ...overrides,
    });

    const buildPractica = (overrides = {}) => ({
        _id: "prac-1",
        nombre: "Radiografía",
        duracionTurnoEnMins: 20,
        costo: 5000,
        ...overrides,
    });

    beforeEach(() => {
        turnoRepository = {
            findById: jest.fn(),
            save: jest.fn(),
            findByPacienteId: jest.fn(),
            buscarTurnosDisponibles: jest.fn(),
        };

        servicioRepository = {
            findById: jest.fn(),
        };

        turnoService = new TurnoService(
           turnoRepository,

        );

    });

})