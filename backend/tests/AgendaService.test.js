import { describe, expect, test, beforeEach, jest } from "@jest/globals";
import { AgendaService } from "../../src/services/AgendaService.js";
import { EstadoTurno } from "../../src/domain/enums/EstadoTurno.js";

function buildReposMock() {
    return {
        medicoRepository: {
            findById: jest.fn(),
        },
        turnoRepository: {
            findFuturosByMedico: jest.fn(),
            deleteMany: jest.fn(),
            insertMany: jest.fn(),
        }
    };
}

describe("AgendaService - Pruebas de Servicio", () => {
    let repos;
    let service;
    let mockMedico;

    beforeEach(() => {
        repos = buildReposMock();
        service = new AgendaService({
            medicoRepository: repos.medicoRepository,
            turnoRepository: repos.turnoRepository
        });

        mockMedico = {
            _id: "medico-123",
            sedes: [{ _id: "sede-1" }],
            especialidades: [
                { nombre: "Pediatría", duracionTurnoEnMins: 30, costo: 4000 }
            ],
            practicas: [],
            disponibilidades: [
                {
                    diaSemana: { toString: () => "MARTES" },
                    horaDesde: "09:00",
                    horaHasta: "10:00"
                }
            ]
        };
    });

    describe("regenerarAgenda", () => {
        test("debe lanzar un error si el médico no existe en el sistema", async () => {
            repos.medicoRepository.findById.mockResolvedValue(null);

            await expect(
                service.regenerarAgenda({ medicoId: "inexistente" })
            ).rejects.toThrow("No se encontró un médico con id: inexistente");
        });

        test("debe procesar, eliminar obsoletos e insertar nuevos turnos exitosamente", async () => {
            repos.medicoRepository.findById.mockResolvedValue(mockMedico);

            // Simulamos un turno existente en la base de datos que ya no es válido
            const mockTurnoObsoleto = {
                _id: "turno-viejo-id",
                fechaHoraInicio: new Date("2026-06-08T09:00:00"),
                fechaHoraFin: new Date("2026-06-08T09:30:00"),
                estado: EstadoTurno.DISPONIBLE.nombre
            };
            repos.turnoRepository.findFuturosByMedico.mockResolvedValue([mockTurnoObsoleto]);
            repos.turnoRepository.deleteMany.mockResolvedValue({ deletedCount: 1 });
            repos.turnoRepository.insertMany.mockResolvedValue([]);

            const resultado = await service.regenerarAgenda({ medicoId: "medico-123" });

            // Verificaciones de llamadas al repositorio
            expect(repos.medicoRepository.findById).toHaveBeenCalledWith("medico-123");
            expect(repos.turnoRepository.findFuturosByMedico).toHaveBeenCalled();
            expect(repos.turnoRepository.deleteMany).toHaveBeenCalledWith(["turno-viejo-id"]);
            expect(repos.turnoRepository.insertMany).toHaveBeenCalled();

            // Verificación del retorno del servicio
            expect(resultado).toEqual({
                mensaje: "Agenda regenerada exitosamente.",
                turnosEliminados: 1,
                turnosGenerados: expect.any(Number)
            });
        });
        test("no debe eliminar turnos futuros que ya se encuentren en estado RESERVADO", async () => {
            repos.medicoRepository.findById.mockResolvedValue(mockMedico);

            // Simulamos dos turnos: uno DISPONIBLE (que ya no coincide con el horario) y uno RESERVADO
            const mockTurnoDisponibleObsoleto = {
                _id: "turno-disp-viejo",
                fechaHoraInicio: new Date("2026-06-08T15:00:00"), // Fuera del horario de 09 a 10
                fechaHoraFin: new Date("2026-06-08T15:30:00"),
                estado: EstadoTurno.DISPONIBLE.nombre
            };

            const mockTurnoReservado = {
                _id: "turno-reservado-intocable",
                fechaHoraInicio: new Date("2026-06-09T09:00:00"),
                fechaHoraFin: new Date("2026-06-09T09:30:00"),
                estado: EstadoTurno.RESERVADO.nombre, // ¡Este es el dato clave!
                paciente: "paciente-123"
            };

            repos.turnoRepository.findFuturosByMedico.mockResolvedValue([
                mockTurnoDisponibleObsoleto,
                mockTurnoReservado
            ]);

            repos.turnoRepository.deleteMany.mockResolvedValue({ deletedCount: 1 });
            repos.turnoRepository.insertMany.mockResolvedValue([]);

            await service.regenerarAgenda({ medicoId: "medico-123" });

            // Verificamos que SOLO se haya mandado a borrar el turno DISPONIBLE obsoleto
            expect(repos.turnoRepository.deleteMany).toHaveBeenCalledWith(["turno-disp-viejo"]);

            // Nos aseguramos de que el ID del turno reservado NO esté en la lista de eliminados
            expect(repos.turnoRepository.deleteMany).not.toHaveBeenCalledWith(
                expect.arrayContaining(["turno-reservado-intocable"])
            );
        });
    });

    describe("generarTurnosParaMedico", () => {
        test("debe generar turnos en un rango específico sin borrar existentes", async () => {
            repos.medicoRepository.findById.mockResolvedValue(mockMedico);
            repos.turnoRepository.findFuturosByMedico.mockResolvedValue([]);
            repos.turnoRepository.insertMany.mockResolvedValue([]);

            const fechaDesde = new Date("2026-06-02T00:00:00"); // Martes
            const fechaHasta = new Date("2026-06-02T23:59:59");

            const resultado = await service.generarTurnosParaMedico({
                medicoId: "medico-123",
                fechaDesde,
                fechaHasta
            });

            expect(repos.turnoRepository.deleteMany).not.toHaveBeenCalled();
            expect(repos.turnoRepository.insertMany).toHaveBeenCalled();
            expect(resultado.turnosGenerados).toBe(2); // De 09:00 a 10:00 entran dos bloques de 30 mins
        });
    });
});