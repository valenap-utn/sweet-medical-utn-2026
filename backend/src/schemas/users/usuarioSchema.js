import mongoose from "mongoose";
import { RolUsuario } from "../../domain/enums/RolUsuario.js";
import {Usuario} from "../../domain/users/Usuario.js";
import {validarPassword} from "../../utils/auxFunctions.js";

const UsuarioSchema = new mongoose.Schema({
    nombreUsuario: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(value) {
                return value && value.length >= 3;
            },
            message: 'El nombre de usuario debe tener al menos 3 caracteres.'
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: validarPassword,
            message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.'
        }
    },
    rol: {
        type: String,
        enum: Object.values(RolUsuario),
        required: true,
    }
}, {
    // Para trazabilidad ( createdAt , updatedAt )
    timestamps: true
})

// Cargamos el esquema 'Usuario' (mongoose) a la entidad 'Usuario' (nuestro dominio)
UsuarioSchema.loadClass(Usuario);

// Exportamos el modelo mongoose que se usará correspondiente al esquema
export const UsuarioModel = mongoose.model("Usuario", UsuarioSchema);
