import { Turno } from "../../src/domain/Turno.js";
import { Medico } from "../../src/domain/users/Medico.js";
import { Usuario } from "../../src/domain/users/Usuario.js";
import { Paciente } from "../../src/domain/users/Paciente.js";
import { ObraSocial } from "../../src/domain/ObraSocial.js";
import { Plan } from "../../src/domain/coberturas/Plan.js";
import { Sede } from "../../src/domain/Sede.js";
import { Practica } from "../../src/domain/coberturas/Practica.js";
import { EstadoTurno } from "../../src/domain/enums/EstadoTurno.js";
import { TipoServicio } from "../../src/domain/enums/TipoServicio.js";

describe('Turnos', () => {

    // 1. Instanciar Usuarios (id, nombreUsuario, password)
    const userMedico = new Usuario("user-med-1", "drCorazon", "Pochita_12");
    const userPaciente = new Usuario("user-pac-1", "pepe", "Pepito_12");

    // 2. Coberturas
    let osde = new ObraSocial("1", "Osde 310");
    const planPlatino = new Plan("1", "Platino");
    osde.agregarPlan(planPlatino);

    // 3. Medico (id, usuario, nombre, matricula)
    const medico = new Medico("medico-123", userMedico, "Nick Riviera", "1234");

    // 4. Paciente (id, usuario, dni, nombre, obraSocial, plan)
    const paciente = new Paciente("paciente-123", userPaciente, "44444444", "Pepito", osde, planPlatino);

    // 5. Entorno de atención
    const sede1 = new Sede("1", "Sede 1", "Av. Cabildo 555");

    // 6. Practica (codigo, nombre, duracionTurnoEnMins, costo)
    const practica1 = new Practica("123", "Radiografia", 60, 12000);

    test('Se debería crear un turno', () => {
        const fechaInicio = new Date();
        const fechaFin = new Date(fechaInicio.getTime() + 60 * 60000);

        // El constructor de Turno recibe un objeto por desestructuración
        const turno = new Turno({
            id: "turno-123",
            medico: medico,
            paciente: paciente,
            sede: sede1,
            tipoServicio: TipoServicio.PRACTICA,
            practica: practica1,
            especialidad: null,
            fechaHoraInicio: fechaInicio,
            fechaHoraFin: fechaFin,
            estado: EstadoTurno.DISPONIBLE,
            costo: 12000
        });

        expect(turno.medico.nombre).toBe("Nick Riviera");
        expect(turno.paciente.nombre).toBe("Pepito");
        expect(turno.sede.nombre).toBe("Sede 1");
        expect(turno.practica.nombre).toBe("Radiografia");
        expect(turno.tipoServicio).toBe(TipoServicio.PRACTICA);
        expect(turno.estado).toBe(EstadoTurno.DISPONIBLE);
        expect(turno.costo).toBe(12000);
    });

    test('Se debería ver el nuevo estado al reservar', () => {
        const fechaInicio = new Date();
        const fechaFin = new Date(fechaInicio.getTime() + 60 * 60000);

        const turno = new Turno({
            id: "turno-123",
            medico: medico,
            paciente: null,
            sede: sede1,
            tipoServicio: TipoServicio.PRACTICA,
            practica: practica1,
            fechaHoraInicio: fechaInicio,
            fechaHoraFin: fechaFin,
            estado: EstadoTurno.DISPONIBLE,
            costo: null
        });

        // Ejecutar el método de reserva del dominio
        turno.reservar({
            paciente: paciente,
            costo: 12000,
            turnoId: "turno-123"
        });

        expect(turno.estado).toBe(EstadoTurno.RESERVADO);
        expect(turno.paciente.nombre).toBe("Pepito");
        expect(turno.costo).toBe(12000);
        expect(turno.historialEstados.length).toBe(1);
        expect(turno.historialEstados[0].estado).toEqual(EstadoTurno.RESERVADO);
    });
});