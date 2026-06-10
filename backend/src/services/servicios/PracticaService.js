import {NotFoundError} from "../../error/AppError.js";

export class PracticaService {
    constructor(practicaRepository) {
        this.practicaRepository = practicaRepository;
    }

    async crear(data){
        return await this.practicaRepository.create(data);
    }

    async obtenerTodas(){
        return await this.practicaRepository.findAll();
    }

    async obtenerPorId(id){
        return await this.practicaRepository.findById(id);
    }

    async eliminar(practicaId){
        const practica = await this.practicaRepository.findById(practicaId);
        if(!practica) throw new NotFoundError(`No se encontró la práctica a eliminar.`);
        return await this.practicaRepository.delete(practicaId);
    }
}