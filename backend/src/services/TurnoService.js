import {isAfter, isValid, parseISO, subHours} from "date-fns";
import {NivelCobertura} from "../domain/enums/NivelCobertura.js";
import {EstadoTurno} from "../domain/enums/EstadoTurno.js";
import {BadRequestError, ConflictError, ForbiddenError, NotFoundError} from "../error/AppError.js";

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

    // EstadoTurno.RESERVADO.nombre
    async reservarTurno({turnoId, usuario}) {
        this.validarUsuarioPuedeReservarTurno({usuario});

        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new NotFoundError(`No se encontró el turno con id: ${turnoId}`);

        if (turno.estado !== EstadoTurno.DISPONIBLE.nombre) throw new ConflictError(`El turno con id: ${turnoId} no se encuentra disponible.`);

        turno.paciente = usuario.pacienteId;

        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.RESERVADO.nombre,
            usuario: usuario.usuarioId,
            motivo: "Reserva de turno",
            turnoId: turno._id,
        })

        return await this.turnoRepository.save(turno);
    }

    // EstadoTurno.CANCELADO.nombre
    async cancelarTurno({turnoId, usuario, motivo}) {
        if (!motivo) throw new BadRequestError("Debe indicar un motivo para cancelar el turno");

        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new NotFoundError(`No se encontró un turno con el id: ${turnoId}`);

        this.validarUsuarioPuedeCancelarTurno({turno, usuario});

        const unaHoraAntes = subHours(turno.fechaHoraInicio, 1);

        if (isAfter(new Date(), unaHoraAntes)) throw new ConflictError("El turno solo puede cancelarse con al menos una hora de anticipación.")

        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.CANCELADO.nombre,
            usuario: usuario.usuarioId,
            motivo,
            turnoId: turno._id,
        });

        return await this.turnoRepository.save(turno);
    }

    async marcarTurnoRealizado({turnoId, usuario}) {
        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new NotFoundError(`El turno con id: ${turnoId} no fue encontrado.`);

        this.validarUsuarioPuedeMarcarTurnoRealizado({turno, usuario});

        if (turno.estado !== EstadoTurno.CONFIRMADO.nombre) throw new ConflictError(`El turno con id: ${turnoId} no puede marcarse como "Realizado" porque su estado actual es ${turno.estado}`);

        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.REALIZADO.nombre,
            usuario: usuario.usuarioId,
            motivo: "Turno realizado",
            turnoId: turno._id,
        })
        return await this.turnoRepository.save(turno);
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

    async obtenerCotizacionTurno({turnoId, usuario}) {
        // Buscamos el turno
        if (!turnoId) throw new BadRequestError("Debe indicar turnoId.")
        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new NotFoundError(`No se encontró el turno con id ${turnoId}.`);

        // Buscamos al paciente
        if (!usuario?.pacienteId) throw new ForbiddenError("Debe indicar pacienteId.")
        const paciente = await this.pacienteRepository.findById(usuario.pacienteId);
        if (!paciente) throw new NotFoundError(`No se encontró el paciente con id ${usuario.pacienteId}.`);

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


    // ---------- VALIDACIONES ----------
    validarUsuarioPuedeCancelarTurno({turno, usuario}) {
        const pacienteId = usuario?.pacienteId?.toString();
        const medicoId = usuario?.medicoId?.toString();

        const esPacienteDelTurno = pacienteId && (turno.paciente?.toString() === pacienteId);
        const esMedicoDelTurno = medicoId && (turno.medico?.toString() === medicoId);

        if(!esPacienteDelTurno && !esMedicoDelTurno) throw new ForbiddenError("El usuario no tiene permisos para cancelar este turno.");
    }

    validarUsuarioPuedeReservarTurno({usuario}) {
        if (!usuario?.pacienteId) throw new ForbiddenError("Solo un paciente puede reservar turnos.");
    }

    validarUsuarioPuedeMarcarTurnoRealizado({turno, usuario}) {
        const medicoId = usuario?.medicoId?.toString();

        const esMedicoDelTurno = medicoId && (turno.medico?.toString() === medicoId);

        if(!esMedicoDelTurno) throw new ForbiddenError("Solo el médico del turno puede marcarlo como realizado.");
    }
}