import {BadRequestError, ConflictError, NotFoundError} from "../error/AppError.js";

export class ServiciosMedicoService {
    constructor({especialidadRepository, practicaRepository}) {
        this.especialidadRepository = especialidadRepository;
        this.practicaRepository = practicaRepository;
    }

    async crearEspecialidad({nombre, duracionTurnoEnMins, costo}) {
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
    }

    async crearPractica({nombre, duracionTurnoEnMins, costo}) {
        if (!nombre || !duracionTurnoEnMins || costo == null) {
            throw new BadRequestError("Debe indicar nombre, duración del turno y costo para crear la práctica.");
        }

        if (await this.practicaRepository.findOne(nombre, duracionTurnoEnMins, costo)) throw new ConflictError(`La practica ${nombre} ya existe.`);

        return await this.practicaRepository.create({nombre, duracionTurnoEnMins, costo});
    }

    async borrarPractica({practicaId}) {
        const practica = await this.practicaRepository.findById(practicaId);
        if (!practica) throw new NotFoundError(`La practica con id: ${practicaId} no fue encontrada.`);

        return await this.practicaRepository.findByIdAndDelete(practicaId);
    }

    async modificarPractica(practicaId, {nombre, duracionTurnoEnMins, costo}) {
        const practica = await this.practicaRepository.findById(practicaId);
        if (!practica) throw new NotFoundError(`La practica con id: ${practicaId} no fue encontrada.`);

        practica.establecerNuevoNombre(nombre);
        practica.establecerNuevaDuracion(duracionTurnoEnMins);
        practica.establecerNuevoCosto(costo);

        return await this.practicaRepository.save(practica);
    }
}