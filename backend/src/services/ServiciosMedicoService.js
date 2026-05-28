export class ServiciosMedicoService {
    constructor({especialidadRepository, practicaRepository}) {
        this.especialidadRepository = especialidadRepository;
        this.practicaRepository = practicaRepository;
    }

    async crearEspecialidad({nombre, duracionTurnoEnMins, costoConsulta}){
        if(await this.especialidadRepository.findOne(nombre, duracionTurnoEnMins, costoConsulta)) throw new Error("La especialidad ya existe");

        return await this.especialidadRepository.create({nombre, duracionTurnoEnMins, costoConsulta});
    }

    async borrarEspecialidad({especialidadId}){
        const especialidad = await this.especialidadRepository.findById(especialidadId);
        if(!especialidad) throw new Error("La especialidad no existe");

        return await this.especialidadRepository.findByIdAndDelete(especialidadId);
    }

    async modificarEspecialidad(especialidadId, {nombre, duracionTurnoEnMins, costoConsulta}){
        const especialidad = await this.especialidadRepository.findById(especialidadId);
        if(!especialidad) throw new Error("La especialidad no existe");

        especialidad.establecerNuevoNombre(nombre);
        especialidad.establecerNuevaDuracion(duracionTurnoEnMins);
        especialidad.establecerNuevoCosto(costoConsulta);

        return await this.especialidadRepository.save(especialidad);
    }

    async crearPractica({nombre, duracionTurnoEnMins, costo}){
        if(await this.practicaRepository.findOne(nombre, duracionTurnoEnMins, costo)) throw new Error("La practica ya existe");

        return await this.practicaRepository.create({nombre, duracionTurnoEnMins, costo});
    }

    async borrarPractica({practicaId}){
        const practica = await this.practicaRepository.findById(practicaId);
        if(!practica) throw new Error("La practica no existe");

        return await this.practicaRepository.findByIdAndDelete(practicaId);
    }

    async modificarPractica(practicaId, {nombre, duracionTurnoEnMins, costo}){
        const practica = await this.practicaRepository.findById(practicaId);
        if(!practica) throw new Error("La practica no existe");

        practica.establecerNuevoNombre(nombre);
        practica.establecerNuevaDuracion(duracionTurnoEnMins);
        practica.establecerNuevoCosto(costo);

        return await this.practicaRepository.save(practica);
    }
}