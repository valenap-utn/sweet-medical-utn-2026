import { PacienteRepository } from "../repositories/PacienteRepository.js";

export class PacienteService {
    constructor() {
        this.pacienteRepository = new PacienteRepository();
    }

    async obtenerPacientePorId(id) {
        const paciente = await this.pacienteRepository.findById(id);
        if (!paciente) {
            throw new Error("Paciente no encontrado.");
        }
        return paciente;
    }
}
