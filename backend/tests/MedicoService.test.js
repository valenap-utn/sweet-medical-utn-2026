import {beforeEach, describe, expect, jest, test} from "@jest/globals";
import {MedicoService} from "../../src/services/MedicoService.js";
import {EstadoTurno} from "../../src/domain/enums/EstadoTurno.js";
import {TipoServicio} from "../../src/domain/enums/TipoServicio.js";
import {DiaSemana} from "../../src/domain/enums/DiaSemana.js";

describe("MedicoService tests", () => {
    let medicoRepository;
    let turnoRepository;
    let especialidadRepository;
    let practicaRepository;

    let medicoService;

    const buildMedico = (overrides = {}) => ({
        _id: "medico-1",
        disponibilidades: [],
        especialidades: [],
        practicas: [],
        definirDisponibilidad: jest.fn(),
        agregarEspecialidad: jest.fn(),
        agregarPractica: jest.fn(),
        ...overrides,
    });

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

    const buildDisponibilidad = (overrides = {}) => ({
        diaSemana: new DiaSemana('Lunes'),
        horaDesde: '08:00',
        horaHasta: '12:00',
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
        medicoRepository = {
            findById: jest.fn(),
            save: jest.fn(),
        };

        turnoRepository = {
            findById: jest.fn(),
            save: jest.fn(),
            findByPacienteId: jest.fn(),
            buscarTurnosDisponibles: jest.fn(),
        };

        especialidadRepository = {
            findById: jest.fn(),
        };

        practicaRepository = {
            findById: jest.fn(),
        };

        medicoService = new MedicoService({
            medicoRepository,
            turnoRepository,
            especialidadRepository,
            practicaRepository,
        });

        medicoService.agendaService = {
            regenerarAgenda: jest.fn(),
        };
    });

// ------------------------------------------------- TURNOS --------------------------------------------------------------

    // ========================================== Cancelar turnos ======================================================

    test("Cancela un turno correctamente", async () => {
        const medico = buildMedico();
        const turno = buildTurno();

        turnoRepository.findById.mockResolvedValue(turno);
        turnoRepository.save.mockResolvedValue(turno);

        const resultado = await medicoService.cancelarTurno({
            medicoId: medico._id,
            turnoId: turno._id,
            motivo: "Motivo",
        });

        expect(turno.actualizarEstado).toHaveBeenCalledWith({
            nuevoEstado: EstadoTurno.CANCELADO.nombre,
            usuario: medico._id,
            motivo: "Motivo",
            turnoId: turno._id,
        });

        expect(turnoRepository.save).toHaveBeenCalledWith(turno);
        expect(resultado).toBe(turno);
    });

    test("No cancela un turno sin motivo", async () => {
        const medico = buildMedico();

        await expect(
            medicoService.cancelarTurno({
                medicoId: medico._id,
                turnoId: "turno-1",
                motivo: "",
            })
        ).rejects.toThrow(
            "Debe indicar un motivo para cancelar el turno"
        );
    });

    test("No cancela un turno inexistente", async () => {
        const medico = buildMedico();

        turnoRepository.findById.mockResolvedValue(null);

        await expect(
            medicoService.cancelarTurno({
                medicoId: medico._id,
                turnoId: "turno-1",
                motivo: "Motivo",
            })
        ).rejects.toThrow(
            "Turno turno-1 no encontrado."
        );
    });

    test("No cancela un turno que no pertenece al médico", async () => {
        const medico = buildMedico();

        const turno = buildTurno({
            medico: {_id: "otro-medico"},
        });

        turnoRepository.findById.mockResolvedValue(turno);

        await expect(
            medicoService.cancelarTurno({
                medicoId: medico._id,
                turnoId: turno._id,
                motivo: "Motivo",
            })
        ).rejects.toThrow(
            `El turno ${turno._id} no pertenece al médico ${medico._id}.`
        );
    });

    test("No cancela un turno con menos de una hora de anticipación", async () => {
        const medico = buildMedico();

        const turno = buildTurno({
            fechaHoraInicio: new Date(Date.now() + 30 * 60 * 1000),
        });

        turnoRepository.findById.mockResolvedValue(turno);

        await expect(
            medicoService.cancelarTurno({
                medicoId: medico._id,
                turnoId: turno._id,
                motivo: "Motivo",
            })
        ).rejects.toThrow(
            "El turno solo puede cancelarse con al menos 1 hora de anticipación."
        );
    });

    // ========================================== Marcar realizado ======================================================

    test("Marca un turno confirmado como realizado", async () => {
        const medico = buildMedico();

        const turno = buildTurno({
            estado: EstadoTurno.CONFIRMADO.nombre,
        });

        turnoRepository.findById.mockResolvedValue(turno);
        turnoRepository.save.mockResolvedValue(turno);

        const resultado = await medicoService.marcarTurnoRealizado({
            medicoId: medico._id,
            turnoId: turno._id,
        });

        expect(turno.actualizarEstado).toHaveBeenCalledWith({
            nuevoEstado: EstadoTurno.REALIZADO.nombre,
            usuario: medico._id,
            motivo: "Se realizó el turno",
            turnoId: turno._id,
        });

        expect(resultado).toBe(turno);
    });

    test("No marca realizado un turno inexistente", async () => {
        const medico = buildMedico();

        turnoRepository.findById.mockResolvedValue(null);

        await expect(
            medicoService.marcarTurnoRealizado({
                medicoId: medico._id,
                turnoId: "turno-1",
            })
        ).rejects.toThrow(
            "Turno turno-1 no encontrado."
        );
    });

    test("No marca como realizado un turno que no pertenece al médico", async () => {
        const medico = buildMedico();

        const turno = buildTurno({
            medico: {_id: "otro-medico"},
        });

        turnoRepository.findById.mockResolvedValue(turno);

        await expect(
            medicoService.marcarTurnoRealizado({
                medicoId: medico._id,
                turnoId: turno._id,
            })
        ).rejects.toThrow(
            `El turno ${turno._id} no pertenece al médico ${medico._id}.`
        );
    });

    test("No marca realizado un turno no confirmado", async () => {
        const medico = buildMedico();

        const turno = buildTurno({
            estado: EstadoTurno.RESERVADO.nombre,
        });

        turnoRepository.findById.mockResolvedValue(turno);

        await expect(
            medicoService.marcarTurnoRealizado({
                medicoId: medico._id,
                turnoId: turno._id,
            })
        ).rejects.toThrow(
            `El turno con id: turno-1 no puede marcarse como \"Realizado\" porque su estado actual es Reservado`
        );
    });

    // ========================================== Obtener historial de paciente ======================================================

    test("Obtiene historial de turnos", async () => {
        const turnos = [
            {_id: "turno-1"},
            {_id: "turno-2"},
        ];

        turnoRepository.findByPacienteId.mockResolvedValue(turnos);

        const resultado = await medicoService.obtenerHistorial({
            pacienteId: "paciente-1",
        });

        expect(turnoRepository.findByPacienteId)
            .toHaveBeenCalledWith("paciente-1");

        expect(resultado).toEqual(turnos);
    });

    // ========================================== Proponer cambio de fecha ======================================================

    test("Propone cambio de fecha", async () => {
        const medico = buildMedico();
        const turno = buildTurno();

        turnoRepository.findById.mockResolvedValue(turno);
        turnoRepository.save.mockResolvedValue(turno);

        const resultado = await medicoService.proponerCambioFecha({
            medicoId: medico._id,
            turnoId: turno._id,
            nuevaFechaHora: "2027-05-10T10:00:00",
        });

        expect(turno.fechaHoraSolicitada)
            .toEqual(new Date("2027-05-10T10:00:00"));

        expect(turno.actualizarEstado).toHaveBeenCalledWith({
            nuevoEstado: EstadoTurno.RESERVADO.nombre,
            usuario: medico._id,
            motivo: "Nueva fecha propuesta para el turno.",
            turnoId: turno._id,
        });

        expect(resultado).toBe(turno);
    });

    test("No propone cambio de fecha sin una fecha", async () => {
        const medico = buildMedico();
        const turno = buildTurno();

        turnoRepository.findById.mockResolvedValue(turno);

        await expect(
            medicoService.proponerCambioFecha({
                medicoId: medico._id,
                turnoId: turno._id,
                nuevaFechaHora: null,
            })
        ).rejects.toThrow(
            "Debe indicar la nueva fecha y hora propuesta."
        );
    });

    test("No propone cambio de fecha de un turno inexistente", async () => {
        const medico = buildMedico();

        turnoRepository.findById.mockResolvedValue(null);

        await expect(
            medicoService.proponerCambioFecha({
                medicoId: medico._id,
                turnoId: "turno-1",
                nuevaFechaHora: "2027-05-10T10:00:00",
            })
        ).rejects.toThrow(
            "Turno turno-1 no encontrado."
        );
    });

    test("No propone el cambio de fecha de un turno que no pertenece al médico", async () => {
        const medico = buildMedico();

        const turno = buildTurno({
            medico: {_id: "otro-medico"},
        });

        turnoRepository.findById.mockResolvedValue(turno);

        await expect(
            medicoService.proponerCambioFecha({
                medicoId: medico._id,
                turnoId: turno._id,
                nuevaFechaHora: "2027-05-10T10:00:00",
            })
        ).rejects.toThrow(
            `El turno ${turno._id} no pertenece al médico ${medico._id}.`
        );
    });

    test("No propone cambio con fecha inválida", async () => {
        const medico = buildMedico();
        const turno = buildTurno();

        turnoRepository.findById.mockResolvedValue(turno);

        await expect(
            medicoService.proponerCambioFecha({
                medicoId: medico._id,
                turnoId: turno._id,
                nuevaFechaHora: "fecha-invalida",
            })
        ).rejects.toThrow();
    });

    // ========================================== Confirmar cambio de fecha ======================================================

    test("Confirma modificación de fecha", async () => {
        const medico = buildMedico();

        const turno = buildTurno({
            fechaHoraSolicitada: new Date("2027-05-10T10:00:00"),
        });

        turnoRepository.findById.mockResolvedValue(turno);
        turnoRepository.save.mockResolvedValue(turno);

        const resultado = await medicoService.confirmarCambioFechaSolicitadoPorPaciente({
            medicoId: medico._id,
            turnoId: turno._id,
        });

        expect(turno.fechaHoraInicio)
            .toEqual(new Date("2027-05-10T10:00:00"));

        expect(turno.fechaHoraSolicitada)
            .toBeNull();

        expect(turno.actualizarEstado).toHaveBeenCalledWith({
            nuevoEstado: EstadoTurno.CONFIRMADO.nombre,
            usuario: medico._id,
            motivo: "Modificación de fecha confirmada.",
            turnoId: turno._id,
        });

        expect(resultado).toBe(turno);
    });

    test("No confirma modificación de fecha de un turno inexistente", async () => {
        const medico = buildMedico();

        turnoRepository.findById.mockResolvedValue(null);

        await expect(
            medicoService.marcarTurnoRealizado({
                medicoId: medico._id,
                turnoId: "turno-1",
            })
        ).rejects.toThrow(
            "Turno turno-1 no encontrado."
        );
    });

    test("No confirma modificación si no existe fecha solicitada", async () => {
        const medico = buildMedico();
        const turno = buildTurno();

        turnoRepository.findById.mockResolvedValue(turno);

        await expect(
            medicoService.confirmarCambioFechaSolicitadoPorPaciente({
                medicoId: medico._id,
                turnoId: turno._id,
            })
        ).rejects.toThrow(
            `El turno con id: turno-1 no tiene una propuesta de cambio de fecha pendiente.`
        );
    });

// ----------------------------------------------- DISPONIBILIDAD HORARIA --------------------------------------------------------------

    // ========================================== Consultar disponibilidad ======================================================

    test("Consulta disponibilidad por especialidad", async () => {
        const medico = buildMedico();

        await medicoService.consultarDisponibilidadEspecialidad({
            medicoId: medico._id,
            especialidadId: "esp-1",
        });

        expect(turnoRepository.buscarTurnosDisponibles).toHaveBeenCalledWith({
            medicoId: medico._id,
            tipoServicio: TipoServicio.ESPECIALIDAD,
            especialidadId: "esp-1",
        });
    });

    test("Consulta disponibilidad por práctica", async () => {
        const medico = buildMedico();

        await medicoService.consultarDisponibilidadPractica({
            medicoId: medico._id,
            practicaId: "prac-1",
        });

        expect(turnoRepository.buscarTurnosDisponibles).toHaveBeenCalledWith({
            medicoId: medico._id,
            tipoServicio: TipoServicio.PRACTICA,
            practicaId: "prac-1",
        });
    });

    test("Agrega una disponibilidad horaria", async () => {
        const medico = buildMedico();
        const disponibilidad = buildDisponibilidad();

        medicoRepository.findById.mockResolvedValue(medico);

        const resultado = await medicoService.agregarDisponibilidad({
            medicoId: medico._id,
            disponibilidad,
        });

        expect(medico.definirDisponibilidad)
            .toHaveBeenCalledWith(disponibilidad);

        expect(medicoRepository.save)
            .toHaveBeenCalledWith(medico);

        expect(medicoService.agendaService.regenerarAgenda)
            .toHaveBeenCalledWith({
                medicoId: medico._id,
            });

        expect(resultado).toEqual({
            mensaje: "Disponibilidad agregada y agenda regenerada.",
        });
    });

    test("No agrega la disponibilidad si el médico no existe", async () => {
        const disponibilidad = buildDisponibilidad();

        medicoRepository.findById.mockResolvedValue(null);

        await expect(
            medicoService.agregarDisponibilidad({
                medicoId: "medico-inexistente",
                disponibilidad,
            })
        ).rejects.toThrow(
            "No se encontró el médico con id: medico-inexistente ."
        );
    });

    test("No agrega una disponibilidad inválida", async () => {
        const medico = buildMedico();

        const disponibilidad = buildDisponibilidad({
            horaDesde: "15:00",
            horaHasta: "10:00",
        });

        medicoRepository.findById.mockResolvedValue(medico);

        await expect(
            medicoService.agregarDisponibilidad({
                medicoId: medico._id,
                disponibilidad,
            })
        ).rejects.toThrow(
            "Disponibilidad undefined no válida"
        );
    });

    test("No agrega una disponibilidad ya existente", async () => {
        const disponibilidad = buildDisponibilidad();

        const medico = buildMedico({
            disponibilidades: [disponibilidad],
        });

        medicoRepository.findById.mockResolvedValue(medico);

        await expect(
            medicoService.agregarDisponibilidad({
                medicoId: medico._id,
                disponibilidad,
            })
        ).rejects.toThrow(
            "El médico ya tiene registrada la disponibilidad undefined"
        );
    });

    test("Quita una disponibilidad existente", async () => {
        const disponibilidad = buildDisponibilidad();

        const medico = buildMedico({
            disponibilidades: [disponibilidad],
        });

        medicoRepository.findById.mockResolvedValue(medico);

        const resultado = await medicoService.quitarDisponibilidad({
            medicoId: medico._id,
            disponibilidad,
        });

        expect(medico.disponibilidades).toEqual([]);

        expect(medicoRepository.save)
            .toHaveBeenCalledWith(medico);

        expect(medicoService.agendaService.regenerarAgenda)
            .toHaveBeenCalledWith({
                medicoId: medico._id,
            });

        expect(resultado).toEqual({
            mensaje: "Disponibilidad eliminada y agenda regenerada.",
        });
    });

    test("No quita la disponibilidad si el médico no existe", async () => {
        const disponibilidad = buildDisponibilidad();

        medicoRepository.findById.mockResolvedValue(null);

        await expect(
            medicoService.quitarDisponibilidad({
                medicoId: "medico-inexistente",
                disponibilidad,
            })
        ).rejects.toThrow(
            "No se encontró el médico con id: medico-inexistente ."
        );
    });

    test("No quita una disponibilidad inexistente", async () => {
        const medico = buildMedico({
            disponibilidades: [],
        });

        const disponibilidad = buildDisponibilidad();

        medicoRepository.findById.mockResolvedValue(medico);

        await expect(
            medicoService.quitarDisponibilidad({
                medicoId: medico._id,
                disponibilidad,
            })
        ).rejects.toThrow(
            "Disponibilidad no encontrada"
        );
    });

// ------------------------------------------------- ESPECIALIDADES --------------------------------------------------------------

    // ========================================== Agregar especialidad ======================================================

    test("Agrega una especialidad", async () => {
        const medico = buildMedico();

        const especialidad = buildEspecialidad();

        medicoRepository.findById.mockResolvedValue(medico);
        especialidadRepository.findById.mockResolvedValue(especialidad);
        medicoRepository.save.mockResolvedValue(medico);

        await medicoService.agregarEspecialidad({
            medicoId: medico._id,
            especialidadId: "esp-1",
        });

        expect(medico.agregarEspecialidad)
            .toHaveBeenCalledWith(especialidad);

        expect(medicoRepository.save)
            .toHaveBeenCalledWith(medico);
    });

    test("No agrega una especialidad si el médico no existe", async () => {
        medicoRepository.findById.mockResolvedValue(null);

        await expect(
            medicoService.agregarEspecialidad({
                medicoId: "medico-inexistente",
                especialidadId: "esp-1",
            })
        ).rejects.toThrow(
            "No se encontró el médico con id: medico-inexistente ."
        );
    });

    test("No agrega una especialidad duplicada", async () => {
        const especialidad = buildEspecialidad();

        const medico = buildMedico({
            especialidades: [especialidad],
        });

        medicoRepository.findById.mockResolvedValue(medico);
        especialidadRepository.findById.mockResolvedValue(especialidad);

        await expect(
            medicoService.agregarEspecialidad({
                medicoId: medico._id,
                especialidadId: "esp-1",
            })
        ).rejects.toThrow(
            `El medico ${medico._id} ya tiene la especialidad esp-1`
        );
    });

    // ========================================== Quitar especialidad ======================================================

    test("Quita una especialidad", async () => {
        const especialidad = buildEspecialidad();

        const medico = buildMedico({
            especialidades: [especialidad],
        });

        medicoRepository.findById.mockResolvedValue(medico);
        especialidadRepository.findById.mockResolvedValue(especialidad);

        medicoRepository.save.mockResolvedValue(medico);

        const resultado = await medicoService.quitarEspecialidad({
            medicoId: medico._id,
            especialidadId: "esp-1",
        });

        expect(medico.especialidades).toEqual([]);

        expect(medicoRepository.save)
            .toHaveBeenCalledWith(medico);

        expect(resultado).toBe(medico);
    });

    test("No quita una especialidad si el médico no existe", async () => {
        medicoRepository.findById.mockResolvedValue(null);

        await expect(
            medicoService.quitarEspecialidad({
                medicoId: "medico-inexistente",
                especialidadId: "esp-1",
            })
        ).rejects.toThrow(
            "No se encontró el médico con id: medico-inexistente ."
        );
    });

    test("No quita una especialidad inexistente", async () => {
        const medico = buildMedico();

        medicoRepository.findById.mockResolvedValue(medico);
        especialidadRepository.findById.mockResolvedValue(null);

        await expect(
            medicoService.quitarEspecialidad({
                medicoId: medico._id,
                especialidadId: "esp-inexistente",
            })
        ).rejects.toThrow(
            "No se encontró la especialidad con id: esp-inexistente ."
        );
    });

    test("No quita una especialidad que el médico no posee", async () => {
        const especialidad = buildEspecialidad();

        const medico = buildMedico({
            especialidades: [],
        });

        medicoRepository.findById.mockResolvedValue(medico);
        especialidadRepository.findById.mockResolvedValue(especialidad);

        await expect(
            medicoService.quitarEspecialidad({
                medicoId: medico._id,
                especialidadId: "esp-1",
            })
        ).rejects.toThrow(
            `El medico ${medico._id} no tiene la especialidad esp-1`
        );
    });

// -------------------------------------------------- PRACTICAS --------------------------------------------------------------

    // ========================================== Agregar práctica ======================================================

    test("Agrega una práctica", async () => {
        const medico = buildMedico();
        const practica = buildPractica();

        medicoRepository.findById.mockResolvedValue(medico);
        practicaRepository.findById.mockResolvedValue(practica);

        medicoRepository.save.mockResolvedValue(medico);

        const resultado = await medicoService.agregarPractica({
            medicoId: medico._id,
            practicaId: practica._id,
        });

        expect(medico.agregarPractica)
            .toHaveBeenCalledWith(practica);

        expect(medicoRepository.save)
            .toHaveBeenCalledWith(medico);

        expect(resultado).toBe(medico);
    });

    test("No agrega una práctica si el médico no existe", async () => {
        medicoRepository.findById.mockResolvedValue(null);

        await expect(
            medicoService.agregarPractica({
                medicoId: "medico-inexistente",
                practicaId: "prac-1",
            })
        ).rejects.toThrow(
            "No se encontró el médico con id: medico-inexistente ."
        );
    });

    test("No agrega una práctica inexistente", async () => {
        const medico = buildMedico();

        medicoRepository.findById.mockResolvedValue(medico);
        practicaRepository.findById.mockResolvedValue(null);

        await expect(
            medicoService.agregarPractica({
                medicoId: medico._id,
                practicaId: "prac-inexistente",
            })
        ).rejects.toThrow(
            "No se encontró la práctica con id: prac-inexistente ."
        );
    });

    test("No agrega una práctica que el médico ya posee", async () => {
        const practica = buildPractica();

        const medico = buildMedico({
            practicas: [practica],
        });

        medicoRepository.findById.mockResolvedValue(medico);
        practicaRepository.findById.mockResolvedValue(practica);

        await expect(
            medicoService.agregarPractica({
                medicoId: medico._id,
                practicaId: practica._id,
            })
        ).rejects.toThrow(
            `El medico ${medico._id} ya tiene la práctica ${practica._id}`
        );
    });

    // ========================================== Quitar práctica ======================================================

    test("Quita una práctica", async () => {
        const practica = buildPractica();

        const medico = buildMedico({
            practicas: [practica],
        });

        medicoRepository.findById.mockResolvedValue(medico);
        practicaRepository.findById.mockResolvedValue(practica);
        medicoRepository.save.mockResolvedValue(medico);

        const resultado = await medicoService.quitarPractica({
            medicoId: medico._id,
            practicaId: practica._id,
        });

        expect(medico.practicas).toEqual([]);
        expect(medicoRepository.save).toHaveBeenCalledWith(medico);
        expect(resultado).toBe(medico);
    });

    test("No quita una práctica si el médico no existe", async () => {
        const practica = buildPractica();

        medicoRepository.findById.mockResolvedValue(null);

        await expect(
            medicoService.quitarPractica({
                medicoId: "medico-inexistente",
                practicaId: practica._id,
            })
        ).rejects.toThrow(
            "No se encontró el médico con id: medico-inexistente ."
        );
    });

    test("No quita una práctica si la práctica no existe", async () => {
        const medico = buildMedico();

        medicoRepository.findById.mockResolvedValue(medico);
        practicaRepository.findById.mockResolvedValue(null);

        await expect(
            medicoService.quitarPractica({
                medicoId: medico._id,
                practicaId: "practica-inexistente",
            })
        ).rejects.toThrow(
            "No se encontró la práctica con id: practica-inexistente ."
        );
    });

    test("No quita una práctica que el médico no tiene", async () => {
        const practica = buildPractica();

        const medico = buildMedico({
            practicas: [],
        });

        medicoRepository.findById.mockResolvedValue(medico);
        practicaRepository.findById.mockResolvedValue(practica);

        await expect(
            medicoService.quitarPractica({
                medicoId: medico._id,
                practicaId: practica._id,
            })
        ).rejects.toThrow(
            `El medico ${medico._id} no tiene la práctica ${practica._id}`
        );
    });
});