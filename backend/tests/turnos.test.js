import {Turno} from "../../src/domain/Turno.js";
import {Medico} from "../../src/domain/users/Medico.js";
import {Usuario} from "../../src/domain/users/Usuario.js";
import {Paciente} from "../../src/domain/users/Paciente.js";
import {ObraSocial} from "../../src/domain/ObraSocial.js";
import {Plan} from "../../src/domain/coberturas/Plan.js";
import {LocalDateTime} from "@js-joda/core";
import {Sede} from "../../src/domain/Sede.js";
import {Practica} from "../../src/domain/coberturas/Practica.js";
import {EstadoTurno} from "../../src/domain/enums/EstadoTurno.js";

describe('Turnos', () => {

    const userMedico = new Usuario("1","drCorazon","Pochita_12");
    const userPaciente = new Usuario("1","pepe","Pepito_12");

    let osde = new ObraSocial("1","Osde 310");
    const planPlatino = new Plan("1","Platino");

    osde.agregarPlan(planPlatino);

    const medico = new Medico("1",userMedico,"Nick Riviera" ,"1234");
    const paciente = new Paciente("1", userPaciente,"44444444","Pepito",osde,planPlatino);

    const sede1 = new Sede("1","Sede 1","Av. Cabildo 555");

    const practica1 = new Practica("1","123","Radiografia",60,12000);


    test('Se debería crear un turno', () => {
        const turno = new Turno("1",medico,paciente,LocalDateTime.now(),sede1,practica1,EstadoTurno.RESERVADO,1,false);

        // Si pongo costo '0' por alguna razón lo toma como 'false' => falla

        expect(turno.id).toBe("1");
        expect(turno.medico.nombre).toBe("Nick Riviera");
        expect(turno.paciente.nombre).toBe("Pepito");
        // expect(turno.fechaHora).toBe(LocalDateTime.now());
        expect(turno.sede.nombre).toBe("Sede 1");
        expect(turno.practica.nombre).toBe("Radiografia");
        expect(turno.estado).toBe(EstadoTurno.RESERVADO);
        expect(turno.costo).toBe(1);
    })

    test('Se debería ver el nuevo estado', () => {
        const turno = new Turno("1",medico,paciente,LocalDateTime.now(),sede1,practica1,EstadoTurno.RESERVADO,1,false);

        turno.actualizarEstado(EstadoTurno.CONFIRMADO,medico,"Estoy disponible.");
        turno.actualizarEstado(EstadoTurno.CANCELADO,medico,"Mentira, no estoy disponible.");

        console.log(turno.historialEstados);

        expect(turno.estado).toBe(EstadoTurno.CANCELADO);
    })

})
