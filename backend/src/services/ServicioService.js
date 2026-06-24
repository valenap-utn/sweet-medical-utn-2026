import {BadRequestError, ConflictError, NotFoundError} from "../error/AppError.js";

export class ServicioService {
    constructor({servicioRepository}) {
        this.servicioRepository = servicioRepository;
    }

    async crear({codigo, nombre, tipoServicio, duracionTurnoEnMins, costo}){
        if (!nombre || !tipoServicio || !duracionTurnoEnMins || !costo) throw new BadRequestError(`Debe indicar nombre, duración del turno y costo de consulta para crear la especialidad.`)

        if (await this.servicioRepository.findOne(nombre, duracionTurnoEnMins, costo)) throw new ConflictError(`Ya existe un servicio con nombre ${nombre}, duración ${duracionTurnoEnMins} minutos y costo ${costo}.`);

        return await this.servicioRepository.create({codigo, nombre, tipoServicio, duracionTurnoEnMins, costo});
    }

    async obtenerTodos(){
        return await this.servicioRepository.findAll();
    }

    async modificar(id, {nombre, duracionTurnoEnMins, costo}) {
        const servicio = await this.servicioRepository.findById(id);

        servicio.establecerNuevoNombre(nombre);
        servicio.establecerNuevaDuracion(duracionTurnoEnMins);
        servicio.establecerNuevoCosto(costo);

        return await this.servicioRepository.save(servicio);
    }

    async obtenerPorId(id){
        return await this.servicioRepository.findById(id);
    }

    async eliminar(id){
        const servicio = await this.servicioRepository.findById(id);
        if(!servicio) throw new NotFoundError(`No se encontró el servicio a eliminar.`);
        return await this.servicioRepository.delete(servicio);
    }
}