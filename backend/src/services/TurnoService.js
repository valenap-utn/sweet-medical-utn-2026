import {isValid, parseISO} from "date-fns";
import {NivelCobertura} from "../domain/enums/NivelCobertura.js";
import {EstadoTurno} from "../domain/enums/EstadoTurno.js";
import {BadRequestError, NotFoundError} from "../error/AppError.js";

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

    // Busca turnos disponibles según filtros
    async buscarTurnosDisponibles(filtros) {

        const fechaDesde = filtros.fechaDesde ? parseISO(filtros.fechaDesde) : undefined;
        const fechaHasta = filtros.fechaHasta ? parseISO(filtros.fechaHasta) : undefined;

        if (fechaDesde && !isValid(fechaDesde)) throw new BadRequestError(`La fechaDesde no es válida: ${filtros.fechaDesde}.`);
        if (fechaHasta && !isValid(fechaHasta)) throw new BadRequestError(`La fechaHasta no es válida: ${filtros.fechaHasta}.`);

        return await this.turnoRepository.buscarTurnosDisponibles({
            ...filtros,
            fechaDesde,
            fechaHasta,
        });
    }

    async obtenerCotizacionTurno({turnoId, pacienteId}) {
        // Buscamos el turno
        if (!turnoId) throw new BadRequestError("Debe indicar turnoId.")
        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new NotFoundError(`No se encontró el turno con id ${turnoId}.`);

        // Buscamos al paciente
        if (!pacienteId) throw new BadRequestError("Debe indicar pacienteId.")
        const paciente = await this.pacienteRepository.findById(pacienteId);
        if (!paciente) throw new NotFoundError(`No se encontró el paciente con id ${pacienteId}.`);

        // Calculamos cobertura

        const cobertura = this.obtenerCoberturaPaciente(paciente, turno);
        const costoEstimado = this.calcularCostoPaciente({turno, cobertura});

        return {
            turno: {
                id: turno.id,
                medico: turno.medico,
                sede: turno.sede,
                tipoServicio: turno.tipoServicio,
                especialidad: turno.especialidad,
                practica: turno.practica,
                fechaHoraInicio: turno.fechaHoraInicio,
                fechaHoraFin: turno.fechaHoraFin,
                estado: turno.estado,
            },
            cobertura: cobertura.nombre,
            costo: costoEstimado,
        };
    }

    // Devuelve médicos con turnos dispo. según los filtros
    async obtenerMedicosDisponibles(filtros) {
        return await this.turnoRepository.obtenerMedicosDisponibles(filtros);
    }

    // Devuelve opciones de servicios (para desplegables del front)
    async obtenerOpcionesServicio({tipoServicio, sedeId}) {
        if (!tipoServicio) throw new BadRequestError("Debe indicar tipoServicio.");
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