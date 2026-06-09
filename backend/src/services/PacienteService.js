export class PacienteService {
    constructor({pacienteRepository, turnoRepository}) {
        this.pacienteRepository = pacienteRepository;
        this.turnoRepository = turnoRepository;
    }

     // GET /turnos
    // Historial de Turnos de un paciente
    async obtenerHistorial({pacienteId}) {
        return await this.turnoRepository.findByPacienteId(pacienteId);
    }
}
