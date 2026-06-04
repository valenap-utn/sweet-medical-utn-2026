import { describe, expect, test } from "@jest/globals";
import { Paciente } from "../../src/domain/users/Paciente.js";
import { UsuarioInvalido } from "../../src/exceptions/UsuarioInvalido.js";

describe("Paciente domain tests", () => {
    // Factory de paciente
    const buildPacienteData = (overrides = {}) => ({
        id: "paciente-1",
        usuario: { _id: "usuario-1" },
        dni: "12345678",
        nombre: "Paciente Test",
        obraSocial: { _id: "obra-social-1", nombre: "OSDE" },
        plan: { _id: "plan-1", nombre: "Plan 210" },
        ...overrides,
    });

    const crearPaciente = (overrides = {}) => {
        const data = buildPacienteData(overrides);

        return new Paciente(
            data.id,
            data.usuario,
            data.dni,
            data.nombre,
            data.obraSocial,
            data.plan
        );
    };

    test("crea un paciente válido asignando sus propiedades", () => {
        const data = buildPacienteData();

        const paciente = crearPaciente(data);

        expect(paciente.id).toBe(data.id);
        expect(paciente.usuario).toBe(data.usuario);
        expect(paciente.dni).toBe(data.dni);
        expect(paciente.nombre).toBe(data.nombre);
        expect(paciente.obraSocial).toBe(data.obraSocial);
        expect(paciente.plan).toBe(data.plan);
    });

    test("lanza UsuarioInvalido si falta el usuario", () => {
        expect(() =>
            crearPaciente({ usuario: null })
        ).toThrow(UsuarioInvalido);
    });

    test("lanza UsuarioInvalido si falta el dni", () => {
        expect(() =>
            crearPaciente({ dni: null })
        ).toThrow(UsuarioInvalido);
    });

    test("lanza UsuarioInvalido si falta el nombre", () => {
        expect(() =>
            crearPaciente({ nombre: null })
        ).toThrow(UsuarioInvalido);
    });

    test("lanza UsuarioInvalido si falta la obra social", () => {
        expect(() =>
            crearPaciente({ obraSocial: null })
        ).toThrow(UsuarioInvalido);
    });

    test("lanza UsuarioInvalido si falta el plan", () => {
        expect(() =>
            crearPaciente({ plan: null })
        ).toThrow(UsuarioInvalido);
    });

    test("lanza UsuarioInvalido si algún campo obligatorio está vacío", () => {
        expect(() =>
            crearPaciente({ dni: "" })
        ).toThrow(UsuarioInvalido);
    });
});