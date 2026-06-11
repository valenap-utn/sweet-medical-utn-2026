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

    // Métodos traídos de ServiciosMedicoService (después arreglar, para + validaciones, no lo hago ahora porque estoy con otra cosa)
    /*async crearEspecialidad({nombre, duracionTurnoEnMins, costo}) {
        if (!nombre || !duracionTurnoEnMins || costo == null) {
            throw new BadRequestError(`Debe indicar nombre, duración del turno y costo de consulta para crear la especialidad.`)
        }

        if (await this.especialidadRepository.findOne(nombre, duracionTurnoEnMins, costo)) throw new ConflictError(`Ya existe una especialidad con nombre ${nombre}, duración ${duracionTurnoEnMins} minutos y costo ${costo}.`);

        return await this.especialidadRepository.create({nombre, duracionTurnoEnMins, costo});
    }

    async borrarEspecialidad({especialidadId}) {
        const especialidad = await this.especialidadRepository.findById(especialidadId);
        if (!especialidad) throw new NotFoundError(`La especialidad con id: ${especialidadId} no fue encontrada.`);

        return await this.especialidadRepository.findByIdAndDelete(especialidadId);
    }

    async modificarEspecialidad(especialidadId, {nombre, duracionTurnoEnMins, costo}) {
        const especialidad = await this.especialidadRepository.findById(especialidadId);
        if (!especialidad) throw new NotFoundError(`La especialidad con id: ${especialidadId} no fue encontrada.`);

        especialidad.establecerNuevoNombre(nombre);
        especialidad.establecerNuevaDuracion(duracionTurnoEnMins);
        especialidad.establecerNuevoCosto(costo);

        return await this.especialidadRepository.save(especialidad);
    }*/
}
