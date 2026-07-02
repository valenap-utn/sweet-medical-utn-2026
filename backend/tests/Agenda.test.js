import { describe, expect, test, beforeEach } from "@jest/globals";
import { Agenda } from "../../src/domain/Agenda.js";
import { Turno } from "../../src/domain/Turno.js";
import { EstadoTurno } from "../../src/domain/enums/EstadoTurno.js";
import { TipoServicio } from "../../src/domain/enums/TipoServicio.js";

describe("Agenda - Pruebas de Dominio", () => {

    let Medico;
    let Especialidad;

    beforeEach(() => {
        Medico = {
            _id: "medico-123",
            sedes: [
                {
                    _id: "sede-central",
                    nombre: "Sede Central"
                }
            ],
            disponibilidades: [
                {
                    diaSemana: { toString: () => "LUNES" },
                    horaDesde: "08:00",
                    horaHasta: "10:00"
                }
            ]
        };

        Especialidad = {
            nombre: "Cardiología",
            duracionTurnoEnMins: 30,
            costo: 5000
        };
    });

    describe("generarTurnos", () => {

        test("debe generar los bloques correctos si caen dentro del rango y disponibilidad", () => {

            const agenda = new Agenda(Medico);

            const fechaDesde = new Date("2026-06-01T00:00:00");
            const fechaHasta = new Date("2026-06-01T23:59:59");

            agenda.generarTurnos(
                fechaDesde,
                fechaHasta,
                Especialidad
            );

            expect(agenda.turnos.length).toBe(4);

            expect(agenda.turnos[0]).toBeInstanceOf(Turno);

            expect(agenda.turnos[0].estado)
                .toBe(EstadoTurno.DISPONIBLE.nombre);

            expect(agenda.turnos[0].tipoServicio)
                .toBe(TipoServicio.ESPECIALIDAD);
        });

        test("no debe generar turnos si se superpone con un turno ya existente", () => {

            const agenda = new Agenda(Medico);

            const turnoExistente = new Turno({
                medico: Medico,
                sede: Medico.sedes[0],
                tipoServicio: TipoServicio.ESPECIALIDAD,
                especialidad: Especialidad,
                fechaHoraInicio: new Date("2026-06-01T08:00:00"),
                fechaHoraFin: new Date("2026-06-01T08:30:00"),
                estado: EstadoTurno.RESERVADO.nombre
            });

            agenda.turnos.push(turnoExistente);

            const fechaDesde = new Date("2026-06-01T00:00:00");
            const fechaHasta = new Date("2026-06-01T23:59:59");

            agenda.generarTurnos(
                fechaDesde,
                fechaHasta,
                Especialidad
            );

            // 1. Verificamos cantidad total
            expect(agenda.turnos.length).toBe(4);

            // 2. Verificamos que el turno de las 08:00
            // siga siendo el reservado original
            const turnoOchoAM = agenda.turnos.find(t =>
                t.fechaHoraInicio.getTime() ===
                new Date("2026-06-01T08:00:00").getTime()
            );

            expect(turnoOchoAM.estado)
                .toBe(EstadoTurno.RESERVADO.nombre);

            expect(turnoOchoAM).toBe(turnoExistente);
        });

    });

    describe("refrescarTurnos", () => {

        test("debe eliminar turnos futuros DISPONIBLES que ya no coinciden con la disponibilidad", () => {

            // El médico ya no atiende los lunes
            Medico.disponibilidades = [];

            const agenda = new Agenda(Medico);

            const turnoFuturoDispo = new Turno({
                medico: Medico,
                sede: Medico.sedes[0],
                tipoServicio: TipoServicio.ESPECIALIDAD,
                especialidad: Especialidad,
                fechaHoraInicio: new Date("2026-07-06T08:00:00"),
                fechaHoraFin: new Date("2026-07-06T08:30:00"),
                estado: EstadoTurno.DISPONIBLE.nombre
            });

            agenda.turnos.push(turnoFuturoDispo);

            agenda.refrescarTurnos();

            expect(agenda.turnos.length).toBe(0);
        });

        test("NO debe eliminar turnos si están RESERVADOS aunque no coincidan con la disponibilidad", () => {

            Medico.disponibilidades = [];

            const agenda = new Agenda(Medico);

            const turnoReservado = new Turno({
                medico: Medico,
                sede: Medico.sedes[0],
                tipoServicio: TipoServicio.ESPECIALIDAD,
                especialidad: Especialidad,
                fechaHoraInicio: new Date("2026-07-06T08:00:00"),
                fechaHoraFin: new Date("2026-07-06T08:30:00"),
                estado: EstadoTurno.RESERVADO.nombre
            });

            agenda.turnos.push(turnoReservado);

            agenda.refrescarTurnos();

            expect(agenda.turnos.length).toBe(1);
        });

    });

});