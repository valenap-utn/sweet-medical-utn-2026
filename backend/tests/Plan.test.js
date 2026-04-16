import {Plan} from "../src/domain/coberturas/Plan.js";
import {PlanInvalido} from "../src/exceptions/PlanInvalido.js";
import {CoberturaEspecialidad} from "../src/domain/coberturas/CoberturaEspecialidad.js";
import {Especialidad} from "../src/domain/coberturas/Especialidad.js";
import {NivelCobertura} from "../src/domain/enums/NivelCobertura.js";
import {Practica} from "../src/domain/coberturas/Practica.js";
import {CoberturaPractica} from "../src/domain/coberturas/CoberturaPractica.js";


describe("Plan", () => {
    test("Se debería crear un plan válido",()=>{
        const plan = new Plan("1","Plan Personalizado");

        expect(plan.id).toBe("1");
        expect(plan.nombre).toBe("Plan Personalizado");
        expect(plan.coberturasEspecialidad).toEqual([]);
        expect(plan.coberturasPractica).toEqual([]);
    });

    test("Se debería lanzar una excepción si falta el ID", () => {
        expect(() => {
            new Plan(null, "Plan OSDE 210")
        }).toThrow(PlanInvalido);
    });

    test("Se debería devolver cobertura existente", () => {
        const plan = new Plan("1","Plan Personalizado");
        const odontologia = new Especialidad("1","Odontologia",60,25000);

        const coberturaEspecialidad = new CoberturaEspecialidad(odontologia,NivelCobertura.PARCIAL);

        plan.agregarEspecialidad(coberturaEspecialidad);

        const nivel = plan.obtenerCobertura(odontologia);

        expect(nivel).toBe(NivelCobertura.PARCIAL);
    });

    test("Se debería devolver NO CUBIERTA si no existe", ()=>{
        const plan = new Plan("2","Plan Platino");
        const dermatologia = new Especialidad("2","Dermatologia",60,35000);
        const nivel = plan.obtenerCobertura(dermatologia);

        expect(nivel).toBe(NivelCobertura.NO_CUBIERTA);
    })

    test("Se debería agregar cobertura de práctica", () => {
        const plan = new Plan("3","Plan Oro");
        const radiografia = new Practica("1","123","Radiografia",60,12000);
        const cobertura = new CoberturaPractica(radiografia,NivelCobertura.TOTAL);

        plan.agregarPractica(cobertura);

        const nivel = plan.obtenerCobertura(radiografia);

        expect(nivel).toBe(NivelCobertura.TOTAL);
    })
})
