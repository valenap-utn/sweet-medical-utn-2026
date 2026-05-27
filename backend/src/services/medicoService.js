import { MedicoRepository } from "../repositories/MedicoRepository.js";
import { EspecialidadModel } from "../schemas/coberturas/especialidadSchema.js";
import { PracticaModel } from "../schemas/coberturas/practicaSchema.js";

export class MedicoService {
    constructor() {
        this.medicoRepository = new MedicoRepository();
    }

    async asociarServicio(medicoId, { tipo, nombre, duracionTurnoEnMins, costo, codigo }) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) {
            throw new Error("Médico no encontrado.");
        }

        if (tipo === "especialidad") {
            // Buscar si ya existe la especialidad globalmente
            let especialidad = await EspecialidadModel.findOne({ nombre });
            if (!especialidad) {
                especialidad = new EspecialidadModel({
                    nombre,
                    duracionTurnoEnMins,
                    costoConsulta: costo
                });
                await especialidad.save();
            }
            
            // Asociar al médico si no la tiene
            if (!medico.especialidades.some(e => e._id.toString() === especialidad._id.toString())) {
                medico.especialidades.push(especialidad._id);
                await this.medicoRepository.save(medico);
            }
            return especialidad;
        } else if (tipo === "practica") {
            // Buscar por código o nombre
            let practica = await PracticaModel.findOne({ $or: [{ codigo }, { nombre }] });
            if (!practica) {
                practica = new PracticaModel({
                    codigo,
                    nombre,
                    duracionTurnoEnMins,
                    costo
                });
                await practica.save();
            }

            // Asociar al médico
            if (!medico.practicas.some(p => p._id.toString() === practica._id.toString())) {
                medico.practicas.push(practica._id);
                await this.medicoRepository.save(medico);
            }
            return practica;
        } else {
            throw new Error("Tipo de servicio inválido (debe ser 'especialidad' o 'practica').");
        }
    }

    async modificarServicio(medicoId, { tipo, servicioId, duracionTurnoEnMins, costo }) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) {
            throw new Error("Médico no encontrado.");
        }

        if (tipo === "especialidad") {
            // Validar que el médico posea la especialidad
            const tieneServicio = medico.especialidades.some(e => e._id.toString() === servicioId.toString());
            if (!tieneServicio) {
                throw new Error("El médico no ofrece esta especialidad.");
            }
            // Modificar los valores del servicio global
            const especialidad = await EspecialidadModel.findByIdAndUpdate(servicioId, {
                duracionTurnoEnMins,
                costoConsulta: costo
            }, { new: true });
            return especialidad;
        } else if (tipo === "practica") {
            const tieneServicio = medico.practicas.some(p => p._id.toString() === servicioId.toString());
            if (!tieneServicio) {
                throw new Error("El médico no ofrece esta práctica.");
            }
            const practica = await PracticaModel.findByIdAndUpdate(servicioId, {
                duracionTurnoEnMins,
                costo
            }, { new: true });
            return practica;
        } else {
            throw new Error("Tipo de servicio inválido.");
        }
    }

    async desasociarServicio(medicoId, { tipo, servicioId }) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) {
            throw new Error("Médico no encontrado.");
        }

        if (tipo === "especialidad") {
            medico.especialidades = medico.especialidades.filter(e => e._id.toString() !== servicioId.toString());
        } else if (tipo === "practica") {
            medico.practicas = medico.practicas.filter(p => p._id.toString() !== servicioId.toString());
        } else {
            throw new Error("Tipo de servicio inválido.");
        }

        await this.medicoRepository.save(medico);
        return { message: "Servicio dado de baja con éxito para el profesional." };
    }

    async consultarDisponibilidad(medicoId, { especialidadId, practicaId }) {
        const medico = await this.medicoRepository.findById(medicoId);
        if (!medico) {
            throw new Error("Médico no encontrado.");
        }
        
        let tieneServicio = false;
        let nombreServicio = "";

        if (especialidadId) {
            const esp = medico.especialidades.find(e => e._id.toString() === especialidadId.toString());
            if (esp) {
                tieneServicio = true;
                nombreServicio = esp.nombre;
            }
        } else if (practicaId) {
            const prac = medico.practicas.find(p => p._id.toString() === practicaId.toString());
            if (prac) {
                tieneServicio = true;
                nombreServicio = prac.nombre;
            }
        }

        return {
            medico: medico.nombre,
            tieneServicio,
            nombreServicio,
            disponibilidades: medico.disponibilidades
        };
    }
}
