import {addMinutes, isAfter, isValid, parseISO, subHours} from "date-fns";
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

    /* ===== ACCIONES sobre turnos ================================================================================== */

    // EstadoTurno.CANCELADO.nombre
    async cancelarTurno({turnoId, usuario, motivo}) {
        if (!motivo) throw new BadRequestError("Debe indicar un motivo para cancelar el turno");

        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new NotFoundError(`No se encontró un turno con el id: ${turnoId}`);

        // Chequeamos que se quiere CANCELAR un turno que se encuentra RESERVADO
        if (turno.estado !== EstadoTurno.RESERVADO.nombre) throw new ConflictError(`El turno no puede cancelarse porque su estado actual es: ${turno.estado}`);

        this.validarUsuarioPuedeCancelarTurno({turno, usuario});

        const unaHoraAntes = subHours(turno.fechaHoraInicio, 1);

        if (isAfter(new Date(), unaHoraAntes)) throw new ConflictError("El turno solo puede cancelarse con al menos una hora de anticipación.")

        // Guardamos el estado de cancelación del turno
        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.CANCELADO.nombre,
            usuario: usuario.usuarioId,
            motivo,
            turnoId: turno._id,
        });

        // Y lo volvemos a dejar "Disponible"
        turno.paciente = null;
        turno.costo = null;

        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.DISPONIBLE.nombre,
            usuario: usuario.usuarioId,
            motivo: "Turno liberado luego de cancelación.",
            turnoId: turno._id,
        });

        return await this.turnoRepository.save(turno);
    }

    // Busca turnos disponibles según filtros
    async buscarTurnosDisponibles({ filtros, usuario }) {
        if (!usuario?.pacienteId) {
            throw new ForbiddenError(
                "Solo un paciente puede buscar turnos personalizados."
            );
        }

        // Convertimos las fechas recibidas como texto.
        let fechaDesde;

        if (filtros.fechaDesde) {
            fechaDesde = parseISO(filtros.fechaDesde);

            // Si el usuario eligió el día de hoy, buscamos desde este instante
            // para no devolver turnos que ya pasaron.
            const ahora = new Date();

            if (fechaDesde.toDateString() === ahora.toDateString()) {
                fechaDesde = ahora;
            }
        }

        const fechaHasta = filtros.fechaHasta
            ? parseISO(filtros.fechaHasta)
            : undefined;

        // Validamos las fechas antes de consultar MongoDB.
        if (fechaDesde && !isValid(fechaDesde)) {
            throw new BadRequestError(
                `La fechaDesde no es válida: ${filtros.fechaDesde}.`
            );
        }

        if (fechaHasta && !isValid(fechaHasta)) {
            throw new BadRequestError(
                `La fechaHasta no es válida: ${filtros.fechaHasta}.`
            );
        }

        // Cargamos al paciente junto con su plan y coberturas.
        const paciente =
            await this.pacienteRepository.findById(
                usuario.pacienteId
            );

        if (!paciente) {
            throw new NotFoundError(
                `No se encontró el paciente con id ${usuario.pacienteId}.`
            );
        }

        // Buscamos los turnos disponibles como antes.
        const resultado =
            await this.turnoRepository.buscarTurnosDisponibles({
                ...filtros,
                fechaDesde,
                fechaHasta,
            });

        // Agregamos cobertura y costo estimado a cada resultado.
        const turnosPersonalizados = resultado.turnos.map(
            (turno) => {
                const cobertura =
                    this.obtenerCoberturaPaciente(
                        paciente,
                        turno
                    );

                const costoEstimado =
                    this.calcularCostoPaciente({
                        turno,
                        cobertura,
                    });

                const coberturaValor =
                    cobertura?.nombre ??
                    cobertura?.toString?.() ??
                    cobertura;

                // Los resultados de Mongoose son documentos.
                // Los convertimos en objetos comunes para agregar campos.
                const turnoPlano =
                    typeof turno.toObject === "function"
                        ? turno.toObject()
                        : turno;

                return {
                    ...turnoPlano,
                    cobertura: coberturaValor,
                    costo: costoEstimado,
                };
            }
        );

        // Conservamos total, página y límite del repositorio.
        return {
            ...resultado,
            turnos: turnosPersonalizados,
        };
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
        const coberturaValor = cobertura?.nombre ?? cobertura?.toString?.() ?? cobertura;

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
            cobertura: coberturaValor,
            costo: costoEstimado,
        };
    }

    // EstadoTurno.CONFIRMADO.nombre
    async confirmarCambioFecha({turnoId, usuario}) {
        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new NotFoundError(`El turno con id: ${turnoId} no fue encontrado.`);

        if (!turno.fechaHoraSolicitada) throw new ConflictError(`El turno con id: ${turno._id} no tiene una propuesta de cambio de fecha pendiente.`);

        this.validarUsuarioPuedeConfirmarCambioFecha({turno, usuario});

        // Efectuamos el cambio real sobreescribiendo la fecha de inicio original
        const nuevaFechaInicio = turno.fechaHoraSolicitada;

        const servicio = turno.especialidad ?? turno.practica;
        if (!servicio) throw new BadRequestError(`El turno ${turnoId} no tiene servicio asociado.`)

        turno.fechaHoraInicio = turno.fechaHoraSolicitada;
        turno.fechaHoraFin = addMinutes(nuevaFechaInicio, servicio.duracionTurnoEnMins);

        // Limpiamos el campo temporal de solicitud
        turno.fechaHoraSolicitada = null;

        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.CONFIRMADO.nombre,
            usuario: usuario.usuarioId,
            motivo: "Cambio de fecha confirmado.",
            turnoId: turno._id,
        });

        return await this.turnoRepository.save(turno);
    }

    /* ===== ACCIONES DEL MEDICO sobre turnos ======================================================================= */

    // EstadoTurno.REALIZADO.nombre
    async marcarTurnoRealizado({turnoId, usuario}) {
        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new NotFoundError(`El turno con id: ${turnoId} no fue encontrado.`);

        this.validarUsuarioPuedeMarcarTurnoRealizado({turno, usuario});

        // El turno se puede marcar como REALIZADO si el estado del mismo es CONFIRMADO
        if (!(turno.estado === EstadoTurno.CONFIRMADO.nombre)) throw new ConflictError(`El turno con id: ${turnoId} no puede marcarse como "Realizado" porque su estado actual es ${turno.estado}`);

        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.REALIZADO.nombre,
            usuario: usuario.usuarioId,
            motivo: "Turno realizado",
            turnoId: turno._id,
        })
        return await this.turnoRepository.save(turno);
    }

    async confirmarTurno({turnoId, usuario}) {
        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new NotFoundError(`El turno con id: ${turnoId} no fue encontrado.`);

        this.validarUsuarioPuedeMarcarTurnoRealizado({turno, usuario});

        // El turno se puede marcar como CONFIRMADO si el estado del mismo es RESERVADO
        if (!(turno.estado === EstadoTurno.RESERVADO.nombre)) throw new ConflictError(`El turno con id: ${turnoId} no puede marcarse como "Realizado" porque su estado actual es ${turno.estado}`);

        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.CONFIRMADO.nombre,
            usuario: usuario.usuarioId,
            motivo: "Turno confirmado",
            turnoId: turno._id,
        })
        return await this.turnoRepository.save(turno);
    }

    async proponerCambioFecha({turnoId, usuario, nuevaFechaHora}) {
        if (!nuevaFechaHora) throw new BadRequestError(`Debe indicar la nueva fecha y hora propuesta.`);

        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new NotFoundError(`El turno con id: ${turnoId} no fue encontrado.`);

        if (turno.estado === EstadoTurno.REALIZADO.nombre) throw new ConflictError(`No se puede proponer un cambio de fecha dado que el estado del turno es ${turno.estado}.`);

        this.validarUsuarioPuedeProponerCambioFecha({turno, usuario});

        const fechaParseada = parseISO(nuevaFechaHora);
        if (!isValid(fechaParseada)) throw new BadRequestError(`La fecha ${nuevaFechaHora} no es válida.`);

        // Se asigna la fecha propuesta al campo temporal sin sobreescribir la original todavía
        turno.fechaHoraSolicitada = fechaParseada;

        // Registramos el cambio en el historial manteniendo el estado de espera (RESERVADO)
        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.RESERVADO.nombre,
            usuario: usuario.usuarioId,
            motivo: "Nueva fecha propuesta para el turno.",
            turnoId: turnoId
        });
        return await this.turnoRepository.save(turno);
    }

    /* ===== ACCIONES DEL PACIENTE sobre turnos ===================================================================== */

    // EstadoTurno.RESERVADO.nombre
    async reservarTurno({turnoId, usuario}) {
        this.validarUsuarioPuedeReservarTurno({usuario});

        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new NotFoundError(`No se encontró el turno con id: ${turnoId}`);

        if (turno.estado !== EstadoTurno.DISPONIBLE.nombre) throw new ConflictError(`El turno con id: ${turnoId} no se encuentra disponible.`);

        turno.paciente = usuario.pacienteId;

        // Para agregar el costo del turno para el paciente
        const paciente = await this.pacienteRepository.findById(usuario.pacienteId);
        if (!paciente) {
            throw new NotFoundError(`No se encontró el paciente con id ${usuario.pacienteId}.`);
        }

        const cobertura = this.obtenerCoberturaPaciente(paciente, turno);
        const costoEstimado = this.calcularCostoPaciente({turno, cobertura});

        turno.paciente = usuario.pacienteId;
        turno.costo = costoEstimado;

        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.RESERVADO.nombre,
            usuario: usuario.usuarioId,
            motivo: "Reserva de turno",
            turnoId: turno._id,
        })

        return await this.turnoRepository.save(turno);
    }

    // EstadoTurno.RESERVADO.nombre
    async solicitarCambioFecha({turnoId, usuario, nuevaFechaHora}) {
        if (!nuevaFechaHora) throw new BadRequestError("Debe indicar la nueva fecha solicitada.")

        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) throw new NotFoundError(`No se encontró el turno con id: ${turnoId}.`);

        if (turno.estado === EstadoTurno.REALIZADO.nombre) throw new ConflictError(`No se puede proponer un cambio de fecha dado que el estado del turno es ${turno.estado}.`);

        //Chequeamos que el que quiere solicitar el cambio de fecha sea un paciente a quien le pertenece el turno
        this.validarUsuarioPuedeSolicitarCambioFecha({turno, usuario});

        const paciente = await this.pacienteRepository.findById(usuario.pacienteId);
        if (!paciente) throw new NotFoundError(`No se encontró al paciente con id: ${usuario.pacienteId}.`);

        const nuevaFechaParseada = parseISO(nuevaFechaHora);

        if (!isValid(nuevaFechaParseada)) throw new BadRequestError(`La nueva fecha solicitada no es válida: ${nuevaFechaHora}.`)

        turno.fechaHoraSolicitada = nuevaFechaParseada;

        turno.actualizarEstado({
            nuevoEstado: EstadoTurno.RESERVADO.nombre, // pendiente de confirmación por parte del médico
            usuario: usuario.usuarioId,
            motivo: "Solicitud de cambio de fecha pendiente de confirmación médica.",
            turnoId: turno._id,
        });

        return this.turnoRepository.save(turno);
    }


    // ---------- FUNCIONES (que aún no estoy segura de que vayan acá) ----------
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
        const coberturaValor = cobertura?.nombre ?? cobertura?.toString() ?? cobertura;

        if (coberturaValor === NivelCobertura.TOTAL.toString()) return 0;
        if (coberturaValor === NivelCobertura.PARCIAL.toString()) return costoBase * 0.5;
        return costoBase;
    }


    // ---------- VALIDACIONES ----------
    validarUsuarioPuedeCancelarTurno({turno, usuario}) {
        const pacienteId = usuario?.pacienteId?.toString();
        const medicoId = usuario?.medicoId?.toString();

        const turnoPacienteId = turno.paciente?._id ?? turno.paciente;
        const turnoMedicoId = turno.medico?._id ?? turno.medico;

        const esPacienteDelTurno = pacienteId && (String(turnoPacienteId) === String(pacienteId));
        const esMedicoDelTurno = medicoId && (String(turnoMedicoId) === String(medicoId));

        if (!esPacienteDelTurno && !esMedicoDelTurno) throw new ForbiddenError("El usuario no tiene permisos para cancelar este turno.");
    }

    validarUsuarioPuedeReservarTurno({usuario}) {
        if (!usuario?.pacienteId) throw new ForbiddenError("Solo un paciente puede reservar turnos.");
    }

    validarUsuarioPuedeMarcarTurnoRealizado({turno, usuario}) {
        const medicoId = usuario?.medicoId?.toString();

        const turnoMedicoId = turno.medico?._id ?? turno.medico;
        const esMedicoDelTurno = medicoId && (String(turnoMedicoId) === String(medicoId));

        if (!esMedicoDelTurno) throw new ForbiddenError("Solo el médico del turno puede marcarlo como realizado.");
    }

    validarUsuarioPuedeSolicitarCambioFecha({turno, usuario}) {
        const pacienteId = usuario?.pacienteId?.toString();
        if (!usuario?.pacienteId) throw new ForbiddenError("Solo un paciente puede solicitar cambios de fecha.");

        const turnoPacienteId = turno.paciente?._id ?? turno.paciente;
        const esPacienteDelTurno = pacienteId && (String(turnoPacienteId) === String(pacienteId));

        if (!esPacienteDelTurno) throw new ForbiddenError(`El usuario no tiene permisos para solicitar un cambio de fecha sobre el turno con id: ${turno._id}.`);
    }

    validarUsuarioPuedeProponerCambioFecha({turno, usuario}) {
        const medicoId = usuario?.medicoId?.toString();
        if (!usuario?.medicoId) throw new ForbiddenError("Solo un médico puede proponer cambios de fecha.");

        const turnoMedicoId = turno.medico?._id ?? turno.medico;
        const esMedicoDelTurno = medicoId && (String(turnoMedicoId) === String(medicoId));

        if (!esMedicoDelTurno) throw new ForbiddenError(`El usuario no tiene permisos para proponer un cambio de fecha sobre el turno con id: ${turno._id}.`);
    }

    validarUsuarioPuedeConfirmarCambioFecha({turno, usuario}) {
        const pacienteId = usuario?.pacienteId?.toString();
        const medicoId = usuario?.medicoId?.toString();

        const turnoPacienteId = turno.paciente?._id ?? turno.paciente;
        const turnoMedicoId = turno.medico?._id ?? turno.medico;

        const esPacienteDelTurno = pacienteId && (String(turnoPacienteId) === String(pacienteId));
        const esMedicoDelTurno = medicoId && (String(turnoMedicoId) === String(medicoId));

        if (!esPacienteDelTurno && !esMedicoDelTurno) throw new ForbiddenError("El usuario no tiene permisos para confimar este cambio de fecha.");
    }
}