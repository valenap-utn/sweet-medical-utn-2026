import request from "supertest";
import { describe, expect, jest, test, beforeEach } from "@jest/globals";

import { buildTestApp } from "./utils/buildApp.js";
import { RolUsuario } from "../src/domain/enums/RolUsuario.js";

describe("Test de Integración de AuthController", () => {
    let app;
    let usuarioRepository;
    let pacienteRepository;
    let medicoRepository;

    beforeEach(() => {
        usuarioRepository = {
            findByNombreUsuario: jest.fn(),
            existsByNombreUsuario: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
        };

        pacienteRepository = {
            findByUsuarioId: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
        };

        medicoRepository = {
            findByUsuarioId: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
        };

        app = buildTestApp({ usuarioRepository, pacienteRepository, medicoRepository });
    });

    describe("POST /register/medico", () => {
        test("debe retornar 201 y registrar al médico correctamente", async () => {
            const usuarioCreado = {
                _id: "usuario-1",
                nombreUsuario: "dracarla",
                rol: RolUsuario.MEDICO,
            };
            const medicoCreado = { _id: "medico-1" };

            usuarioRepository.existsByNombreUsuario.mockResolvedValue(false);
            usuarioRepository.create.mockResolvedValue(usuarioCreado);
            medicoRepository.create.mockResolvedValue(medicoCreado);

            const response = await request(app).post("/register/medico").send({
                nombreUsuario: "dracarla",
                password: "Password_123",
                nombre: "Dra. Carla",
                matricula: "MP12345",
            });

            expect(response.status).toBe(201);
            expect(response.body.mensaje).toBe("Médico registrado exitosamente.");
            expect(response.body.usuarioId).toBe("usuario-1");
            expect(response.body.medicoId).toBe("medico-1");
            expect(response.body.rol).toBe(RolUsuario.MEDICO);

            expect(usuarioRepository.existsByNombreUsuario).toHaveBeenCalledWith("dracarla");

            expect(usuarioRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    nombreUsuario: "dracarla",
                    rol: RolUsuario.MEDICO,
                })
            );

            const datosUsuarioCreado = usuarioRepository.create.mock.calls[0][0];
            expect(datosUsuarioCreado.password).not.toBe("Password_123");

            expect(medicoRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    usuario: "usuario-1",
                    nombre: "Dra. Carla",
                    matricula: "MP12345",
                })
            );
        });
    });
});