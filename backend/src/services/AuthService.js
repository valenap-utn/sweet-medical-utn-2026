import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { RolUsuario } from "../domain/enums/RolUsuario.js";
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
            password: passwordHasheada,
            rol: RolUsuario.PACIENTE
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
            rol: usuario.rol,
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
            rol: RolUsuario.MEDICO,
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
            rol: usuario.rol,
        }
    }

    // Login
    async login({nombreUsuario, password}) {
        const usuario = await this.usuarioRepository.findByNombreUsuario(nombreUsuario);
        let nombre = null;
        if (!usuario) throw new NotFoundError(`El nombre de usuario ${nombreUsuario} no es correcto.`);

        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) throw new UnauthorizedError("La contraseña ingresada no es correcta");

        let pacienteId = null;
        let medicoId = null;

        if (usuario.rol === RolUsuario.PACIENTE) {
            const paciente =
                await this.pacienteRepository.findByUsuarioId(usuario._id);

            if (!paciente) {
                throw new UnauthorizedError(
                    "La cuenta de paciente no tiene un perfil asociado."
                );
            }

            pacienteId = paciente._id.toString();
        } else if (usuario.rol === RolUsuario.MEDICO) {
            const medico =
                await this.medicoRepository.findByUsuarioId(usuario._id);

            if (!medico) {
                throw new UnauthorizedError(
                    "La cuenta médica no tiene un perfil asociado."
                );
            }

            medicoId = medico._id.toString();
            nombre = medico.nombre;
        } else {
            throw new UnauthorizedError(
                `El usuario tiene un rol inválido: ${usuario.rol}.`
            );
        }

        const payload = {
            usuarioId: usuario._id.toString(),
            nombreUsuario: usuario.nombreUsuario,
            nombre,
            rol: usuario.rol,
            pacienteId,
            medicoId,
        };

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
            nombreUsuario: payload.nombreUsuario ?? null,
            nombre: payload.nombre ?? null,
            rol: payload.rol,
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

    async obtenerPerfil({ rol, pacienteId, medicoId }) {
        if (rol === RolUsuario.PACIENTE) {
            const paciente = await this.pacienteRepository.findById(pacienteId);
            if (!paciente) throw new NotFoundError("Perfil de paciente no encontrado.");

            return {
                nombre: paciente.nombre,
                dni: paciente.dni,

                obraSocial: paciente.obraSocial?.nombre ?? null,
                plan: paciente.plan?.nombre       ?? null,

                coberturasEspecialidad:
                    paciente.plan?.coberturasEspecialidad?.map(c => ({
                        nombre: c.especialidad?.nombre,
                        nivel: c.nivel,
                    })) ?? [],

                coberturasPractica:
                    paciente.plan?.coberturasPractica?.map(c => ({
                        nombre: c.practica?.nombre,
                        nivel: c.nivel,
                    })) ?? [],
            };
        }

        if (rol === RolUsuario.MEDICO) {
            const medico = await this.medicoRepository.findById(medicoId);
            if (!medico) throw new NotFoundError("Perfil médico no encontrado.");

            return {
                nombre: medico.nombre,
                matricula: medico.matricula,
                especialidades: medico.especialidades?.map(e => e.nombre) ?? [],
                sedes: medico.sedes?.map(s => s.nombre) ?? [],
            };
        }

        throw new UnauthorizedError("Rol inválido.");
    }
}
