import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { ServiciosMedicoService } from "../../src/services/ServiciosMedicoService.js";

describe("ServiciosMedicoService tests", () => {
    let especialidadRepository;
    let practicaRepository;

    let serviciosMedicoService;

    const buildEspecialidad = (overrides = {}) => ({
        _id: "especialidad-1",
        nombre: "Cardiología",
        duracionTurnoEnMins: 30,
        costo: 10000,
        establecerNuevoNombre: jest.fn(),
        establecerNuevaDuracion: jest.fn(),
        establecerNuevoCosto: jest.fn(),
        ...overrides,
    });

    const buildPractica = (overrides = {}) => ({
        _id: "practica-1",
        nombre: "Radiografía",
        duracionTurnoEnMins: 20,
        costo: 5000,
        establecerNuevoNombre: jest.fn(),
        establecerNuevaDuracion: jest.fn(),
        establecerNuevoCosto: jest.fn(),
        ...overrides,
    });

    beforeEach(() => {
        especialidadRepository = {
            findOne: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            findByIdAndDelete: jest.fn(),
            save: jest.fn(),
        };

        practicaRepository = {
            findOne: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            findByIdAndDelete: jest.fn(),
            save: jest.fn(),
        };

        serviciosMedicoService = new ServiciosMedicoService({
            especialidadRepository,
            practicaRepository,
        });
    });

// ------------------------- ESPECIALIDAD ----------------------

    test("Crea una especialidad", async () => {
        const especialidad = buildEspecialidad();

        especialidadRepository.findOne.mockResolvedValue(null);
        especialidadRepository.create.mockResolvedValue(especialidad);

        const resultado =
            await serviciosMedicoService.crearEspecialidad({
                nombre: especialidad.nombre,
                duracionTurnoEnMins: especialidad.duracionTurnoEnMins,
                costo: especialidad.costo,
            });

        expect(especialidadRepository.findOne)
            .toHaveBeenCalledWith(
                especialidad.nombre,
                especialidad.duracionTurnoEnMins,
                especialidad.costo
            );

        expect(especialidadRepository.create)
            .toHaveBeenCalledWith({
                nombre: especialidad.nombre,
                duracionTurnoEnMins: especialidad.duracionTurnoEnMins,
                costo: especialidad.costo,
            });

        expect(resultado).toBe(especialidad);
    });

    test("No crea una especialidad duplicada", async () => {
        const especialidad = buildEspecialidad();

        especialidadRepository.findOne
            .mockResolvedValue(especialidad);

        await expect(
            serviciosMedicoService.crearEspecialidad({
                nombre: especialidad.nombre,
                duracionTurnoEnMins: especialidad.duracionTurnoEnMins,
                costo: especialidad.costo,
            })
        ).rejects.toThrow(
            "Ya existe una especialidad con nombre Cardiología, duración 30 minutos y costo 10000."
        );
    });

    test("Borra una especialidad", async () => {
        const especialidad = buildEspecialidad();

        especialidadRepository.findById
            .mockResolvedValue(especialidad);

        especialidadRepository.findByIdAndDelete
            .mockResolvedValue(especialidad);

        const resultado =
            await serviciosMedicoService.borrarEspecialidad({
                especialidadId: especialidad._id,
            });

        expect(especialidadRepository.findById)
            .toHaveBeenCalledWith(especialidad._id);

        expect(especialidadRepository.findByIdAndDelete)
            .toHaveBeenCalledWith(especialidad._id);

        expect(resultado).toBe(especialidad);
    });

    test("No borra una especialidad inexistente", async () => {
        especialidadRepository.findById
            .mockResolvedValue(null);

        await expect(
            serviciosMedicoService.borrarEspecialidad({
                especialidadId: "especialidad-inexistente",
            })
        ).rejects.toThrow(
            "La especialidad con id: especialidad-inexistente no fue encontrada."
        );
    });


    test("Modifica una especialidad", async () => {
        const especialidad = buildEspecialidad();

        especialidadRepository.findById
            .mockResolvedValue(especialidad);

        especialidadRepository.save
            .mockResolvedValue(especialidad);

        const resultado =
            await serviciosMedicoService.modificarEspecialidad(
                especialidad._id,
                {
                    nombre: "Neurología",
                    duracionTurnoEnMins: 45,
                    costo: 15000,
                }
            );

        expect(especialidad.establecerNuevoNombre)
            .toHaveBeenCalledWith("Neurología");

        expect(especialidad.establecerNuevaDuracion)
            .toHaveBeenCalledWith(45);

        expect(especialidad.establecerNuevoCosto)
            .toHaveBeenCalledWith(15000);

        expect(especialidadRepository.save)
            .toHaveBeenCalledWith(especialidad);

        expect(resultado).toBe(especialidad);
    });

    test("No modifica una especialidad inexistente", async () => {
        especialidadRepository.findById
            .mockResolvedValue(null);

        await expect(
            serviciosMedicoService.modificarEspecialidad(
                "especialidad-inexistente",
                {
                    nombre: "Neurología",
                    duracionTurnoEnMins: 45,
                    costo: 15000,
                }
            )
        ).rejects.toThrow(
            "La especialidad con id: especialidad-inexistente no fue encontrada."
        );
    });

// -------------------------- PRACTICAS --------------------------

    test("Crea una práctica", async () => {
        const practica = buildPractica();

        practicaRepository.findOne.mockResolvedValue(null);
        practicaRepository.create.mockResolvedValue(practica);

        const resultado =
            await serviciosMedicoService.crearPractica({
                nombre: practica.nombre,
                duracionTurnoEnMins: practica.duracionTurnoEnMins,
                costo: practica.costo,
            });

        expect(practicaRepository.findOne)
            .toHaveBeenCalledWith(
                practica.nombre,
                practica.duracionTurnoEnMins,
                practica.costo
            );

        expect(practicaRepository.create)
            .toHaveBeenCalledWith({
                nombre: practica.nombre,
                duracionTurnoEnMins: practica.duracionTurnoEnMins,
                costo: practica.costo,
            });

        expect(resultado).toBe(practica);
    });

    test("No crea una práctica duplicada", async () => {
        const practica = buildPractica();

        practicaRepository.findOne
            .mockResolvedValue(practica);

        await expect(
            serviciosMedicoService.crearPractica({
                nombre: practica.nombre,
                duracionTurnoEnMins: practica.duracionTurnoEnMins,
                costo: practica.costo,
            })
        ).rejects.toThrow(
            "La practica Radiografía ya existe."
        );
    });

    test("Borra una práctica", async () => {
        const practica = buildPractica();

        practicaRepository.findById
            .mockResolvedValue(practica);

        practicaRepository.findByIdAndDelete
            .mockResolvedValue(practica);

        const resultado =
            await serviciosMedicoService.borrarPractica({
                practicaId: practica._id,
            });

        expect(practicaRepository.findById)
            .toHaveBeenCalledWith(practica._id);

        expect(practicaRepository.findByIdAndDelete)
            .toHaveBeenCalledWith(practica._id);

        expect(resultado).toBe(practica);
    });

    test("No borra una práctica inexistente", async () => {
        practicaRepository.findById
            .mockResolvedValue(null);

        await expect(
            serviciosMedicoService.borrarPractica({
                practicaId: "practica-inexistente",
            })
        ).rejects.toThrow(
            "La practica con id: practica-inexistente no fue encontrada."
        );
    });

    test("Modifica una práctica", async () => {
        const practica = buildPractica();

        practicaRepository.findById
            .mockResolvedValue(practica);

        practicaRepository.save
            .mockResolvedValue(practica);

        const resultado =
            await serviciosMedicoService.modificarPractica(
                practica._id,
                {
                    nombre: "Tomografía",
                    duracionTurnoEnMins: 60,
                    costo: 25000,
                }
            );

        expect(practica.establecerNuevoNombre)
            .toHaveBeenCalledWith("Tomografía");

        expect(practica.establecerNuevaDuracion)
            .toHaveBeenCalledWith(60);

        expect(practica.establecerNuevoCosto)
            .toHaveBeenCalledWith(25000);

        expect(practicaRepository.save)
            .toHaveBeenCalledWith(practica);

        expect(resultado).toBe(practica);
    });

    test("No modifica una práctica inexistente", async () => {
        practicaRepository.findById
            .mockResolvedValue(null);

        await expect(
            serviciosMedicoService.modificarPractica(
                "practica-inexistente",
                {
                    nombre: "Tomografía",
                    duracionTurnoEnMins: 60,
                    costo: 25000,
                }
            )
        ).rejects.toThrow(
            "La practica con id: practica-inexistente no fue encontrada."
        );
    });
});