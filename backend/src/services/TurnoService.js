import {isValid, parseISO} from "date-fns";
import {NivelCobertura} from "../domain/enums/NivelCobertura.js";
import {EstadoTurno} from "../domain/enums/EstadoTurno.js";

export class TurnoService {
    constructor(turnoRepository, pacienteRepository) {
        this.turnoRepository = turnoRepository;
        this.pacienteRepository = pacienteRepository;
    }

    // POST /api/turnos
    async crearTurno(data) {
        return await this.turnoRepository.create({
            ...data,
            paciente: null,
            estado: EstadoTurno.DISPONIBLE.nombre,
            costo: null,
            historialEstados: [],
        });
    }

    // Busca turnos dispo. y calcula el costo según el plan del paciente
    async buscarDisponibles({pacienteId, filtros}) {
        if (!pacienteId) throw new Error("Debe indicar pacienteId.")

        const paciente = await this.pacienteRepository.findById(pacienteId);
        if (!paciente) throw new Error("Paciente no encontrado.");

        const fechaDesde = filtros.fechaDesde ? parseISO(filtros.fechaDesde) : undefined;
        const fechaHasta = filtros.fechaHasta ? parseISO(filtros.fechaHasta) : undefined;

        if (fechaDesde && !isValid(fechaDesde)) throw new Error("fechaDesde no es válida.");
        if (fechaHasta && !isValid(fechaHasta)) throw new Error("fechaHasta no es válida.");

        const resultado = await this.turnoRepository.buscarDisponibles({
            ...filtros,
            fechaDesde,
            fechaHasta,
        });

        return {
            ...resultado,
            turnos: resultado.turnos.map((turno) => {
                const cobertura = this.obtenerCoberturaPaciente(paciente, turno);

                return {
                    id: turno.id,
                    medico: turno.medico,
                    sede: turno.sede,
                    tipoServicio: turno.tipoServicio,
                    especialidad: turno.especialidad,
                    practica: turno.practica,
                    fechaHoraInicio: turno.fechaHoraInicio,
                    fechaHoraFin: turno.fechaHoraFin,
                    estado: turno.estado,
                    cobertura: cobertura.nombre,
                    costo: this.calcularCostoPaciente({turno, cobertura}),
                };
            }),
        };
    }

    // Devuelve médicos con turnos dispo. según los filtros
    async obtenerMedicosDisponibles(filtros) {
        return await this.turnoRepository.obtenerMedicosDisponibles(filtros);
    }

    // Devuelve opciones de servicios (para desplegables del front)
    async obtenerOpcionesServicio({tipoServicio, sedeId}) {
        if (!tipoServicio) throw new Error("Debe indicar tipoServicio.");
        return await this.turnoRepository.obtenerOpcionesServicio({tipoServicio, sedeId});
    }

    // ---------- FUNCIONES AUXILIARES ----------
    obtenerCoberturaPaciente(paciente, turno) {
        if (!paciente.plan) return NivelCobertura.NO_CUBIERTA;

        if (turno.especialidad) return paciente.plan.obtenerCoberturaEspecialidad(turno.especialidad);

        if (turno.practica) return paciente.plan.obtenerCoberturaPractica(turno.practica);

        return NivelCobertura.NO_CUBIERTA;
    }

    calcularCostoPaciente({turno, cobertura}) {
        const servicio = turno.especialidad ?? turno.practica;
        if (!servicio) return 0;

        const costoBase = servicio.costo ?? 0;

        if (cobertura === NivelCobertura.TOTAL) return 0;
        if (cobertura === NivelCobertura.PARCIAL) return costoBase * 0.5;
        return costoBase;
    }
}