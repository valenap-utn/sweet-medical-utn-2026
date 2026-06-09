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
}
