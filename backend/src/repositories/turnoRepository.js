import {TipoServicio} from "../domain/enums/TipoServicio.js";
import {EstadoTurno} from "../domain/enums/EstadoTurno.js";
import {TurnoModel} from "../schemas/users/turnoSchema.js";

export class TurnoRepository {
    constructor() {
        this.model = TurnoModel;
    }

    // POST
    async create(turno) {
        return await this.model.create(turno);
    }

    // Busca el turno y trae las entidades relacionadas
    async findById(id) {
        return await this.model
            .findById(id)
            .populate("paciente")
            .populate("medico")
            .populate("sede")
            .populate("especialidad")
            .populate("practica")
    }

    async save(turno) {
        return await turno.save();
    }

    async findByPacienteId(pacienteId) {
        // Busca todos los turnos del pacienteId, del mas nuevo al mas viejo
        return await this.model
            .find({paciente: pacienteId})
            .sort({fechaHoraInicio: -1})
            .populate("medico")
            .populate("sede")
            .populate("especialidad")
            .populate("practica")
    }

    // ** query object: objeto que se va construyendo dinámicamente para consultar Mongo

    // Búsqueda de Turnos DISPONIBLES
    async buscarDisponibles({
                                medicoId,
                                sedeId,
                                tipoServicio,
                                especialidadId,
                                practicaId,
                                fechaDesde,
                                fechaHasta,
                                page = 1,
                                limit = 10,
                                sortBy = "fechaHoraInicio",
                                sortOrder = "asc"
                            }) {

        const filtros = { // query object ** o filtro de búsqueda
            estado: EstadoTurno.DISPONIBLE.nombre,
        }

        if (medicoId) filtros.medico = medicoId;
        if (sedeId) filtros.sede = sedeId;
        if (tipoServicio) filtros.tipoServicio = tipoServicio;

        if (tipoServicio === TipoServicio.ESPECIALIDAD && especialidadId) filtros.especialidad = especialidadId;
        if (tipoServicio === TipoServicio.PRACTICA && practicaId) filtros.practica = practicaId;


        if (fechaDesde || fechaHasta) {
            filtros.fechaHoraInicio = {};

            // $gte: mayor igual que
            // $lte: menor o igual que
            if (fechaDesde) filtros.fechaHoraInicio.$gte = fechaDesde;
            if (fechaHasta) filtros.fechaHoraInicio.$lte = fechaHasta;
        }

        // Manejo para paginación - se calcula cuantos turnos debe saltear según la página donde se encuentre
        const skip = (Number(page) - 1) * Number(limit);

        const sort = {
            [sortBy]: sortOrder === "desc" ? -1 : 1,
        };

        // Promise.all -> ejecuta varias operaciones async en paralelo y espera a que todas terminen
        const [turnos, total] = await Promise.all([
            this.model
                .find(filtros)
                .sort(sort)
                .skip(skip)
                .limit(Number(limit)) // el límite será 10 por parámetro
                .populate("medico")
                .populate("sede")
                .populate("especialidad")
                .populate("practica"),

            this.model.countDocuments(filtros), //calcula cuantos docs. hay en TOTAL, que cumplan con los filtros
            // => si hay 50 docs. en total se pueden hacer calculos de cuantas paginas hay en total
            // cuantos docs. se están mostrando/se mostraron del total, etc.
        ]);

        return {
            turnos,
            total,
            page: Number(page),
            limit: Number(limit)
        };
    }

    // Obtiene los servicios especificos (según especialidad o practica) DISPONIBLES
    async obtenerOpcionesServicio({tipoServicio, sedeId}) {
        const filtros = {
            estado: EstadoTurno.DISPONIBLE.nombre,
            tipoServicio,
        };
        if (sedeId) filtros.sede = sedeId;

        if (tipoServicio === TipoServicio.ESPECIALIDAD) return await this.model.distinct("especialidad", filtros);
        if (tipoServicio === TipoServicio.PRACTICA) return await this.model.distinct("practica", filtros);

        throw new Error("tipoServicio inválido.");
    }

    // Obtiene los médicos especificos (según especialidad o practica) DISPONIBLES
    async obtenerMedicosDisponibles({
                                        sedeId,
                                        tipoServicio,
                                        especialidadId,
                                        practicaId,
                                    }) {
        const filtros = {
            estado: EstadoTurno.DISPONIBLE.nombre,
        };

        if (sedeId) filtros.sede = sedeId;
        if (tipoServicio) filtros.tipoServicio = tipoServicio;
        if (tipoServicio === TipoServicio.ESPECIALIDAD && especialidadId) filtros.especialidad = especialidadId;
        if (tipoServicio === TipoServicio.PRACTICA && practicaId) filtros.practica = practicaId;

        return await this.model
            .find(filtros)
            .distinct("medico"); //retorna valores unicos (sin duplicados)
    }
}
