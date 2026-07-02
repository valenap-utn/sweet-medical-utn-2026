import {UsuarioModel} from "../../schemas/users/usuarioSchema.js";

export class UsuarioRepository {
    constructor() {
        this.model = UsuarioModel;
    }

    async create(user) {
        return await this.model.create(user);
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async findByNombreUsuario(nombreUsuario) {
        return await this.model.findOne({nombreUsuario});
    }

    async existsByNombreUsuario(nombreUsuario) {
        return Boolean(await this.model.exists({nombreUsuario}));
    }

}
