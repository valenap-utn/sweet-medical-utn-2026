import { api } from "./api";

/**
 * Login.
 * POST /auth/login — body: { nombreUsuario, password }
 * Response: { mensaje, usuario: { usuarioId, pacienteId, medicoId } }
 * El backend setea cookies httpOnly: accessToken (15min) y refreshToken (7d)
 */
export async function login({ nombreUsuario, password }) {
  const { data } = await api.post("/auth/login", { nombreUsuario, password });
  return data;
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
  const { data } = await api.post("/auth/register/paciente", {
    nombreUsuario, password, dni, nombre, obraSocial, plan,
  });
  return data;
}

/**
 * Registro de médico.
 * POST /auth/register/medico
 * Body: { nombreUsuario, password, nombre, matricula }
 * Response: { mensaje, usuarioId, medicoId }
 */
export async function registrarMedico({ nombreUsuario, password, nombre, matricula }) {
  const { data } = await api.post("/auth/register/medico", {
    nombreUsuario, password, nombre, matricula,
  });
  return data;
}

/**
 * Devuelve req.user del token actual.
 * GET /auth/me — requiere cookie accessToken
 * Response: { usuarioId, pacienteId, medicoId } (payload del JWT, sin nombreUsuario)
 */
export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data;
}

/**
 * Cierra sesión borrando cookies en el servidor.
 * POST /auth/logout
 */
export async function logout() {
  const { data } = await api.post("/auth/logout");
  return data;
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
