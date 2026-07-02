import {PacienteModel} from "../../schemas/users/pacienteSchema.js";


export class PacienteRepository {
    // El modelo de mongoose nos ayudará con todas las consultas a la BD
    constructor() {
        this.model = PacienteModel;
    }

    async create(paciente) {
        return await this.model.create(paciente);
    }

    async findById(id) {
        return await this.model
            .findById(id)
            .populate({
                path: "plan",
                populate: [
                    {
                        path: "coberturasEspecialidad.especialidad"
                    },
                    {
                        path: "coberturasPractica.practica"
                    }
                ]
            })
            .populate("obraSocial");
    }

    async findAll() {
        return await this.model.find();
    }

    // Para encontrar pacientes por ID de Usuario
    async findByUsuarioId(usuarioId) {
        return await this.model
            .findOne({usuario: usuarioId})
            .populate("usuario");
    }
}
