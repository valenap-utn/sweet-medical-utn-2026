import {NotFoundError} from "../../error/AppError.js";

export class EspecialidadService {
    constructor(especialidadRepository) {
        this.especialidadRepository = especialidadRepository;
    }

    async crear(data) {
        return await this.especialidadRepository.create(data);
    }

    async obtenerTodas() {
        return await this.especialidadRepository.findAll();
    }

    async obtenerPorId(id) {
        return await this.especialidadRepository.findById(id);
    }

    async eliminar(especialidadId){
        const especialidad = await this.especialidadRepository.findById(especialidadId);
        if(!especialidad) throw new NotFoundError(`No se encontró la especialidad.`);
        await this.especialidadRepository.delete(especialidadId);
        return {mensaje: "Especialidad eliminada correctamente."}
    }
}
