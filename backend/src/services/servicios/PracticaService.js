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
}