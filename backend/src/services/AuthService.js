import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {ConflictError, NotFoundError, UnauthorizedError} from "../error/AppError.js";

export class AuthService {
    constructor(usuarioRepository, pacienteRepository, medicoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.pacienteRepository = pacienteRepository;
        this.medicoRepository = medicoRepository;
    }

    // Registros
    // /auth/register/paciente
    async registrarPaciente({nombreUsuario, password, dni, nombre, obraSocial, plan}) {
        const existe = await this.usuarioRepository.existsByNombreUsuario(nombreUsuario);
        if (existe) throw new ConflictError(`El nombre de usuario ${nombreUsuario} ya está en uso.`);

        const passwordHasheada = await bcrypt.hash(password, 10);

        // Creamos el usuario asociado al paciente
        const usuario = await this.usuarioRepository.create({
            nombreUsuario,
            password: passwordHasheada
        });

        const paciente = await this.pacienteRepository.create({
            usuario: usuario._id, // se crea la relacion con la entidad Usuario
            dni: dni,
            nombre: nombre,
            obraSocial: obraSocial,
            plan: plan,
        });

        return {
            usuarioId: usuario._id,
            pacienteId: paciente._id,
        };
    }

    // /auth/register/medico
    async registrarMedico({nombreUsuario, password, nombre, matricula}) {
        const existe = await this.usuarioRepository.existsByNombreUsuario(nombreUsuario);
        if (existe) throw new ConflictError(`El nombre de usuario ${nombreUsuario} ya está en uso.`);

        const passwordHasheada = await bcrypt.hash(password, 10);

        // Creamos el usuario asociado al medico
        const usuario = await this.usuarioRepository.create({
            nombreUsuario,
            password: passwordHasheada,
        });

        const medico = await this.medicoRepository.create({
            usuario: usuario._id,
            nombre: nombre,
            matricula: matricula,
            especialidades: [],
            practicas: [],
            sedes: [],
            disponibilidades: [],
        });

        return {
            usuarioId: usuario._id,
            medicoId: medico._id,
        }
    }

    // Login
    async login({nombreUsuario, password}) {
        const usuario = await this.usuarioRepository.findByNombreUsuario(nombreUsuario);
        if (!usuario) throw new NotFoundError(`El nombre de usuario ${nombreUsuario} no es correcto.`);

        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) throw new UnauthorizedError("La contraseña ingresada no es correcta");

        const paciente = await this.pacienteRepository.findByUsuarioId(usuario._id);
        const medico = await this.medicoRepository.findByUsuarioId(usuario._id);

        const payload = {
            usuarioId: usuario._id.toString(),
            pacienteId: paciente?._id.toString() ?? null,
            medicoId: medico?._id.toString() ?? null,
        }

        return {
            accessToken: this.generarAccessToken(payload),
            refreshToken: this.generarRefreshToken(payload),
            usuario: payload,
        };
    }

    // Refresh para el Token
    refresh(refreshToken) {
        if (!refreshToken) throw new UnauthorizedError("Refresh token requerido.");

        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const nuevoPayload = {
            usuarioId: payload.usuarioId,
            pacienteId: payload.pacienteId ?? null,
            medicoId: payload.medicoId ?? null,
        }

        return {accessToken: this.generarAccessToken(nuevoPayload)};
    }

    generarAccessToken(payload) {
        return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: "15m",
        });
    }

    generarRefreshToken(payload) {
        return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: "7d",
        });
    }
}
