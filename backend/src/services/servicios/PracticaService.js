import {BadRequestError, ConflictError, NotFoundError} from "../../error/AppError.js";

export class PracticaService {
    constructor(practicaRepository) {
        this.practicaRepository = practicaRepository;
    }

    /*async crear(data) {
        return await this.practicaRepository.create(data);
    }*/
    async crear({nombre, duracionTurnoEnMins, codigo, costo}) {
        if (!nombre || !duracionTurnoEnMins || costo == null) throw new BadRequestError("Debe indicar nombre, duración del turno y costo para crear la práctica.");
        if (duracionTurnoEnMins <= 0) throw new BadRequestError("La duración del turno debe ser mayor a 0.");
        if (costo < 0) throw new BadRequestError("El costo no puede ser negativo.");

        // Si ya existe => 409
        if (await this.practicaRepository.findOne(nombre, duracionTurnoEnMins, costo)) throw new ConflictError(`La practica ${nombre} ya existe.`);

        // Sino => 201
        return await this.practicaRepository.create({nombre, codigo, duracionTurnoEnMins, costo});
    }

    async obtenerTodas() {
        return await this.practicaRepository.findAll();
    }

    async obtenerPorId(id) {
        const practica = await this.practicaRepository.findById(id);
        if (!practica) throw new NotFoundError(`La práctica con id: ${id} no fue encontrada.`);
        return practica;
    }

    async eliminar(practicaId) {
        const practica = await this.practicaRepository.findById(practicaId);
        if (!practica) throw new NotFoundError(`No se encontró la práctica a eliminar.`);
        return await this.practicaRepository.delete(practicaId);
    }

    // Endpoint pendiente
    async modificarPractica(practicaId, {nombre, duracionTurnoEnMins, costo}) {
        const practica = await this.practicaRepository.findById(practicaId);
        if (!practica) throw new NotFoundError(`La practica con id: ${practicaId} no fue encontrada.`);

        practica.establecerNuevoNombre(nombre);
        practica.establecerNuevaDuracion(duracionTurnoEnMins);
        practica.establecerNuevoCosto(costo);

        return await this.practicaRepository.save(practica);
    }

    /*
    async borrarPractica({practicaId}) {
        const practica = await this.practicaRepository.findById(practicaId);
        if (!practica) throw new NotFoundError(`La practica con id: ${practicaId} no fue encontrada.`);

        return await this.practicaRepository.findByIdAndDelete(practicaId);
    }
    */
}