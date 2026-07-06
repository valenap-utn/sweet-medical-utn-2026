import axios from "axios";
import { api } from "./api";

const MOCK_AUTH_STORAGE_KEY = "sweet-medical-mock-auth";

function isBrowser() {
  return typeof window !== "undefined";
}

function readStoredMockUser() {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(MOCK_AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredMockUser(usuario) {
  if (!isBrowser()) return;
  window.localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(usuario));
}

function clearStoredMockUser() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
}

function shouldUseMockAuth(error) {
  if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true") return true;
  if (process.env.NODE_ENV === "production") return false;

  if (!axios.isAxiosError(error)) return false;
  const status = error.response?.status;
  if (status && status !== 401) return false;

  return !error.response || error.code === "ERR_NETWORK" || error.message?.includes("Network Error") || error.message?.includes("connect");
}

function buildMockUser(nombreUsuario) {
  const esMedico = nombreUsuario.toLowerCase().startsWith("dr_");
  return {
    usuarioId: "mock-user-id",
    rol: esMedico ? "MEDICO" : "PACIENTE",
    pacienteId: esMedico ? null : "mock-paciente-id",
    medicoId: esMedico ? "mock-medico-id" : null,
    nombreUsuario,
  };
}

/**
 * Login.
 * POST /auth/login — body: { nombreUsuario, password }
 * Response: { mensaje, usuario: { usuarioId, pacienteId, medicoId } }
 * El backend setea cookies httpOnly: accessToken (15min) y refreshToken (7d)
 */
export async function login({ nombreUsuario, password }) {
  try {
    const { data } = await api.post("/auth/login", { nombreUsuario, password });
    return data;
  } catch (error) {
    if (shouldUseMockAuth(error)) {
      const usuario = buildMockUser(nombreUsuario);
      writeStoredMockUser(usuario);
      return {
        mensaje: "Login exitoso (modo demo)",
        usuario,
      };
    }
    throw error;
  }
}

/**
 * Registro de paciente.
 * POST /auth/register/paciente
 * Body: { nombreUsuario, password, dni, nombre, obraSocial (ObjectId), plan (ObjectId) }
 * Response: { mensaje, usuarioId, pacienteId }
 */
export async function registrarPaciente({
  nombreUsuario, password, dni, nombre, obraSocial, plan,
}) {
  try {
    const { data } = await api.post("/auth/register/paciente", {
      nombreUsuario, password, dni, nombre, obraSocial, plan,
    });
    return data;
  } catch (error) {
    if (shouldUseMockAuth(error)) {
      const usuario = buildMockUser(nombreUsuario);
      writeStoredMockUser(usuario);
      return {
        mensaje: "Cuenta creada en modo demo",
        usuarioId: "mock-user-id",
        pacienteId: "mock-paciente-id",
      };
    }
    throw error;
  }
}

/**
 * Registro de médico.
 * POST /auth/register/medico
 * Body: { nombreUsuario, password, nombre, matricula }
 * Response: { mensaje, usuarioId, medicoId }
 */
export async function registrarMedico({ nombreUsuario, password, nombre, matricula }) {
  try {
    const { data } = await api.post("/auth/register/medico", {
      nombreUsuario, password, nombre, matricula,
    });
    return data;
  } catch (error) {
    if (shouldUseMockAuth(error)) {
      const usuario = buildMockUser(nombreUsuario);
      writeStoredMockUser(usuario);
      return {
        mensaje: "Cuenta creada en modo demo",
        usuarioId: "mock-user-id",
        medicoId: "mock-medico-id",
      };
    }
    throw error;
  }
}

/**
 * Devuelve req.user del token actual.
 * GET /auth/me — requiere cookie accessToken
 * Response: { usuarioId, pacienteId, medicoId } (payload del JWT, sin nombreUsuario)
 */
export async function getMe() {
  const storedMockUser = readStoredMockUser();
  if (storedMockUser) return storedMockUser;

  try {
    const { data } = await api.get("/auth/me");
    return data;
  } catch (error) {
    if (shouldUseMockAuth(error)) {
      return null;
    }
    throw error;
  }
}

/**
 * Cierra sesión borrando cookies en el servidor.
 * POST /auth/logout
 */
export async function logout() {
  clearStoredMockUser();
  try {
    const { data } = await api.post("/auth/logout");
    return data;
  } catch (error) {
    if (shouldUseMockAuth(error)) {
      return { mensaje: "Logout exitoso (modo demo)" };
    }
    throw error;
  }
}

/**
 * Obtiene todas las obras sociales (con planes populados).
 * GET /obras-sociales — público
 * Response: array [{ _id, nombre, planes: [{ _id, nombre, ... }] }]
 */
export async function getObrasSociales() {
  const { data } = await api.get("/obras-sociales");
  return Array.isArray(data) ? data : [];
}

/**
 * Obtiene los planes de una obra social.
 * GET /obras-sociales/:obraSocialId/planes — público
 * Response: array de planes populados [{ _id, nombre, coberturas }]
 * (ObraSocialService.obtenerPlanes devuelve obraSocial.planes que ya está populado)
 */
export async function getPlanesDeObraSocial(obraSocialId) {
  const { data } = await api.get(`/obras-sociales/${obraSocialId}/planes`);
  return Array.isArray(data) ? data : [];
}
