export class TurnoRepository {
    constructor(turnoModel) {
        this.model = turnoModel;
    }

    // Busca el turno y trae las entidades relacionadas (si es tipo REFERENCIADO, chequear cómo lo haremos en la DB)
    async findById(id) {
        return await this.model.findById(id)
            .populate("paciente")
            .populate("especialidad")
            .populate("practica");
    }

    async save(turno) {
        return await turno.save();
    }

    async findByPacienteId(pacienteId) {
        // Busca todos los turnos del pacienteId, del mas nuevo al mas viejo
        return await this.model.find({
            pacienteId: pacienteId})
            .sort({fechaHoraInicio: -1})
            .populate("medico")
            .populate("especialidad")
            .populate("practica");
    }
}
