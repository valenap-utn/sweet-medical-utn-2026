import {BadRequestError, ConflictError, NotFoundError} from "../../error/AppError.js";

export class EspecialidadService {
    constructor(especialidadRepository) {
        this.especialidadRepository = especialidadRepository;
    }

    async crear({nombre, duracionTurnoEnMins, costo}) {
        if (!nombre || !duracionTurnoEnMins || costo == null) throw new BadRequestError(`Debe indicar nombre, duración del turno y costo de consulta para crear la especialidad.`)
        if (duracionTurnoEnMins <= 0) throw new BadRequestError("La duración del turno debe ser mayor a 0.");
        if (costo < 0) throw new BadRequestError("El costo no puede ser negativo.");

        // Si ya existe => 409
        if (await this.especialidadRepository.findOne(nombre, duracionTurnoEnMins, costo)) throw new ConflictError(`Ya existe una especialidad con nombre ${nombre}, duración ${duracionTurnoEnMins} minutos y costo ${costo}.`);

        // Sino => 201
        return await this.especialidadRepository.create({nombre, duracionTurnoEnMins, costo});
    }

    async obtenerTodas() {
        return await this.especialidadRepository.findAll();
    }

    async obtenerPorId(id) {
        const especialidad = await this.especialidadRepository.findById(id);
        if (!especialidad) throw new NotFoundError(`La especialidad con id: ${id} no fue encontrada.`);
        return especialidad
    }

    async eliminar(especialidadId) {
        const especialidad = await this.especialidadRepository.findById(especialidadId);
        if (!especialidad) throw new NotFoundError(`No se encontró la especialidad con id: ${especialidadId}.`);
        await this.especialidadRepository.delete(especialidadId);
        return {mensaje: "Especialidad eliminada correctamente."}
    }

    // Endpoint pendiente
    async modificar(especialidadId, {nombre, duracionTurnoEnMins, costo}) {
        const especialidad = await this.especialidadRepository.findById(especialidadId);
        if (!especialidad) {
            throw new NotFoundError(`La especialidad con id ${especialidadId} no fue encontrada.`);
        }

        if (nombre !== undefined) especialidad.establecerNuevoNombre(nombre);
        if (duracionTurnoEnMins !== undefined) especialidad.establecerNuevaDuracion(duracionTurnoEnMins);
        if (costo !== undefined) especialidad.establecerNuevoCosto(costo);

        return await this.especialidadRepository.save(especialidad);
    }

}
