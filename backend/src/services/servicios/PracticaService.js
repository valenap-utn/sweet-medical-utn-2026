import {NotFoundError} from "../../error/AppError.js";

export class PracticaService {
    constructor(practicaRepository) {
        this.practicaRepository = practicaRepository;
    }

    async crear(data) {
        return await this.practicaRepository.create(data);
    }

    async obtenerTodas() {
        return await this.practicaRepository.findAll();
    }

    async obtenerPorId(id) {
        return await this.practicaRepository.findById(id);
    }

    async eliminar(practicaId) {
        const practica = await this.practicaRepository.findById(practicaId);
        if (!practica) throw new NotFoundError(`No se encontró la práctica a eliminar.`);
        return await this.practicaRepository.delete(practicaId);
    }

    // Métodos traídos de ServiciosMedicoService (después arreglar, para + validaciones, no lo hago ahora porque estoy con otra cosa)
    /*async crearPractica({nombre, duracionTurnoEnMins, costo}) {
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
    }*/
}