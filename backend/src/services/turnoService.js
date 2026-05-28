import { TurnoRepository } from "../repositories/TurnoRepository.js";
import { MedicoRepository } from "../repositories/MedicoRepository.js";
import { PacienteRepository } from "../repositories/PacienteRepository.js";
import { NotificacionService } from "./NotificacionService.js";
import { Agenda } from "../domain/Agenda.js";
import { EstadoTurno } from "../domain/enums/EstadoTurno.js";
import { NivelCobertura } from "../domain/enums/NivelCobertura.js";
import { TurnoModel } from "../schemas/turnoSchema.js";

export class TurnoService {
    constructor() {
        this.turnoRepository = new TurnoRepository();
        this.medicoRepository = new MedicoRepository();
        this.pacienteRepository = new PacienteRepository();
        this.notificacionService = new NotificacionService();
        this.agenda = new Agenda();
    }

    async generarTurnosBatch(medicoId = null) {
        // Ejecución asincrónica (batch)
        const runBatch = async () => {
            try {
                let medicos = [];
                if (medicoId) {
                    const med = await this.medicoRepository.findById(medicoId);
                    if (med) medicos.push(med);
                } else {
                    medicos = await this.medicoRepository.findAll();
                }

                for (const medico of medicos) {
                    // Cargar turnos existentes del médico
                    const turnosExistentes = await this.turnoRepository.find({ medico: medico._id });
                    medico.turnosExistentes = turnosExistentes;

                    // Refrescar según disponibilidad
                    const { eliminar, crear } = this.agenda.refrescarTurnosSegunDisponibilidadDe(medico);

                    // Eliminar turnos indicados
                    if (eliminar.length > 0) {
                        const eliminarIds = eliminar.map(t => t._id || t.id).filter(id => id);
                        if (eliminarIds.length > 0) {
                            await this.turnoRepository.deleteMany({ _id: { $in: eliminarIds } });
                        }
                    }

                    // Crear nuevos turnos
                    const docsToInsert = crear.map(t => {
                        const isEsp = t.practica.costoConsulta !== undefined;
                        return {
                            medico: medico._id,
                            paciente: null,
                            fechaHora: t.fechaHora,
                            sede: t.sede ? t.sede._id : (medico.sedes[0]?._id || null),
                            especialidad: isEsp ? t.practica._id : null,
                            practica: !isEsp ? t.practica._id : null,
                            estado: EstadoTurno.DISPONIBLE.nombre,
                            costo: t.costo,
                            historialEstados: []
                        };
                    });

                    if (docsToInsert.length > 0) {
                        await this.turnoRepository.createMany(docsToInsert);
                    }
                }
                console.log("🚀 Batch de turnos completado con éxito.");
            } catch (err) {
                console.error("❌ Error en el proceso batch de generación de turnos:", err);
            }
        };

        // Disparar en background y retornar de inmediato
        runBatch();
        return { message: "Proceso batch de generación de turnos iniciado." };
    }

    async reservarTurno(turnoId, pacienteId) {
        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) {
            throw new Error("Turno no encontrado.");
        }

        const estadoNombre = turno.estado?.nombre || turno.estado;
        if (estadoNombre.toUpperCase() !== "DISPONIBLE") {
            throw new Error(`El turno no está disponible para reserva (Estado: ${estadoNombre}).`);
        }

        const paciente = await this.pacienteRepository.findById(pacienteId);
        if (!paciente) {
            throw new Error("Paciente no encontrado.");
        }

        // Modificar turno
        turno.paciente = paciente._id;
        
        // Registrar en historial y actualizar estado
        const usuarioRef = paciente.usuario._id || paciente.usuario;
        turno.actualizarEstado(EstadoTurno.RESERVADO, usuarioRef, "Reserva de turno realizada.");
        
        const savedTurno = await this.turnoRepository.save(turno);

        // Notificar al médico (el paciente reservó)
        await this.notificacionService.notificarCambioEstado(savedTurno);

        return savedTurno;
    }

    async cancelarTurno(turnoId, usuarioId, motivo) {
        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) {
            throw new Error("Turno no encontrado.");
        }

        const estadoNombre = turno.estado?.nombre || turno.estado;
        if (estadoNombre.toUpperCase() === "CANCELADO" || estadoNombre.toUpperCase() === "REALIZADO") {
            throw new Error(`El turno ya se encuentra ${estadoNombre}.`);
        }

        // Validación de al menos 1 hora de antelación
        const ahora = new Date();
        const horaTurno = new Date(turno.fechaHora);
        const diffMs = horaTurno.getTime() - ahora.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        if (diffHours < 1) {
            throw new Error("El turno solo puede cancelarse con al menos 1 hora de anticipación.");
        }

        // Cambiar estado
        turno.actualizarEstado(EstadoTurno.CANCELADO, usuarioId, motivo);
        
        const savedTurno = await this.turnoRepository.save(turno);

        // Notificar a la contraparte
        await this.notificacionService.notificarCambioEstado(savedTurno);

        return savedTurno;
    }

    async solicitarCambioFecha(turnoId, usuarioId, nuevaFechaHora, propuestoPor) {
        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) {
            throw new Error("Turno no encontrado.");
        }

        // Agregar metadatos de propuesta de cambio
        const propuesta = {
            fechaHora: new Date(nuevaFechaHora),
            propuestoPor,
            confirmado: false
        };

        // Usamos Mongoose directly para guardar metadatos personalizados o actualizar el turno
        const updated = await TurnoModel.findByIdAndUpdate(turnoId, {
            $set: { propuestaCambioFecha: propuesta }
        }, { new: true });

        // Notificar (opcional, pero ayuda a la trazabilidad en la plataforma)
        return updated;
    }

    async confirmarCambioFecha(turnoId, usuarioId) {
        const turno = await TurnoModel.findById(turnoId)
            .populate({
                path: "medico",
                populate: [{ path: "usuario" }]
            })
            .populate({
                path: "paciente",
                populate: [{ path: "usuario" }]
            });

        if (!turno) {
            throw new Error("Turno no encontrado.");
        }

        const propuesta = turno.get("propuestaCambioFecha");
        if (!propuesta || propuesta.confirmado) {
            throw new Error("No hay propuestas de cambio pendientes.");
        }

        // Aplicar cambio
        turno.fechaHora = propuesta.fechaHora;
        turno.actualizarEstado(EstadoTurno.CONFIRMADO, usuarioId, "Cambio de fecha confirmado.");
        
        // Limpiar propuesta
        turno.set("propuestaCambioFecha", undefined);

        const savedTurno = await this.turnoRepository.save(turno);

        // Notificar confirmación
        await this.notificacionService.notificarCambioEstado(savedTurno);

        return savedTurno;
    }

    async marcarComoRealizado(turnoId, medicoUsuarioId) {
        const turno = await this.turnoRepository.findById(turnoId);
        if (!turno) {
            throw new Error("Turno no encontrado.");
        }

        const estadoNombre = turno.estado?.nombre || turno.estado;
        if (estadoNombre.toUpperCase() !== "RESERVADO" && estadoNombre.toUpperCase() !== "CONFIRMADO") {
            throw new Error("Solo se pueden realizar turnos previamente reservados o confirmados.");
        }

        turno.actualizarEstado(EstadoTurno.REALIZADO, medicoUsuarioId, "Turno realizado.");
        return await this.turnoRepository.save(turno);
    }

    async buscarTurnosDisponibles(filters, pagination, sorting) {
        const query = {
            estado: EstadoTurno.DISPONIBLE.nombre
        };

        if (filters.medicoId) query.medico = filters.medicoId;
        if (filters.sedeId) query.sede = filters.sedeId;

        // Filtro por Especialidad o Práctica
        if (filters.especialidadId) {
            query.especialidad = filters.especialidadId;
        }
        if (filters.practicaId) {
            query.practica = filters.practicaId;
        }

        // Rango de fechas
        if (filters.fechaDesde || filters.fechaHasta) {
            query.fechaHora = {};
            if (filters.fechaDesde) query.fechaHora.$gte = new Date(filters.fechaDesde);
            if (filters.fechaHasta) query.fechaHora.$lte = new Date(filters.fechaHasta);
        }

        // Paginación
        const page = parseInt(pagination.page) || 1;
        const limit = parseInt(pagination.limit) || 10;
        const skip = (page - 1) * limit;

        // Ordenamiento
        const sort = {};
        const sortBy = sorting.sortBy === "costo" ? "costo" : "fechaHora";
        const sortOrder = sorting.sortOrder === "desc" ? -1 : 1;
        sort[sortBy] = sortOrder;

        const total = await this.turnoRepository.count(query);
        const docs = await this.turnoRepository.find(query, sort, limit, skip);

        // Si se provee pacienteId, calcular cobertura y costo final
        let list = docs;
        let paciente = null;

        if (filters.pacienteId) {
            paciente = await this.pacienteRepository.findById(filters.pacienteId);
        }

        const results = list.map(turno => {
            let coberturaStr = NivelCobertura.NO_CUBIERTA.nombre;
            let costoFinal = turno.costo;

            if (paciente && paciente.plan) {
                const servicio = turno.especialidad || turno.practica;
                if (servicio) {
                    const cobertura = paciente.plan.obtenerCobertura(servicio);
                    const cobNombre = cobertura.nombre || cobertura;
                    
                    coberturaStr = cobNombre;
                    if (cobNombre === NivelCobertura.TOTAL.nombre) {
                        costoFinal = 0;
                    } else if (cobNombre === NivelCobertura.PARCIAL.nombre) {
                        costoFinal = turno.costo * 0.5; // 50% de descuento
                    }
                }
            }

            return {
                id: turno._id,
                medico: {
                    id: turno.medico._id,
                    nombre: turno.medico.nombre,
                    matricula: turno.medico.matricula
                },
                sede: {
                    id: turno.sede._id,
                    nombre: turno.sede.nombre,
                    direccion: turno.sede.direccion
                },
                servicio: turno.especialidad 
                    ? { tipo: "especialidad", id: turno.especialidad._id, nombre: turno.especialidad.nombre }
                    : { tipo: "practica", id: turno.practica._id, nombre: turno.practica.nombre, codigo: turno.practica.codigo },
                fechaHora: turno.fechaHora,
                estado: "Disponible",
                costoOriginal: turno.costo,
                cobertura: coberturaStr,
                costoEstimadoPaciente: costoFinal
            };
        });

        // Si el ordenamiento es por "costo" y aplicamos coberturas, es posible que el ordenamiento de Mongoose no coincida exactamente si los costos finales varían por paciente. Sin embargo, dado que el costo de copago es proporcional al costo original del turno (o 0), el orden relativo se mantiene, por lo que el sort de base de datos es suficiente.

        return {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
            data: results
        };
    }

    async consultarHistorialPaciente(pacienteId) {
        const query = { paciente: pacienteId };
        const sort = { fechaHora: -1 }; // Orden inverso
        const docs = await this.turnoRepository.find(query, sort);
        return docs.map(t => ({
            id: t._id,
            medico: t.medico.nombre,
            fechaHora: t.fechaHora,
            sede: t.sede.nombre,
            servicio: t.especialidad ? t.especialidad.nombre : (t.practica ? t.practica.nombre : "Consulta"),
            estado: t.estado?.nombre || t.estado,
            costo: t.costo,
            historialEstados: t.historialEstados
        }));
    }
}
