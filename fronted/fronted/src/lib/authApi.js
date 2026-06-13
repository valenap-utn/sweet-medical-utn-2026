import { api } from "./api";

/**
 * Inicia sesión con nombre de usuario y contraseña.
 * El backend responde seteando cookies httpOnly (accessToken/refreshToken)
 * y devuelve los datos del usuario autenticado.
 */
export async function login({ nombreUsuario, password }) {
  const { data } = await api.post("/auth/login", { nombreUsuario, password });
  return data; // { mensaje, usuario }
}

/**
 * Registra un nuevo paciente.
 */
export async function registrarPaciente({
  nombreUsuario,
  password,
  dni,
  nombre,
  obraSocial,
  plan,
}) {
  const { data } = await api.post("/auth/register/paciente", {
    nombreUsuario,
    password,
    dni,
    nombre,
    obraSocial,
    plan,
  });
  return data; // { mensaje, usuarioId, pacienteId }
}

/**
 * Registra un nuevo médico.
 */
export async function registrarMedico({ nombreUsuario, password, nombre, matricula }) {
  const { data } = await api.post("/auth/register/medico", {
    nombreUsuario,
    password,
    nombre,
    matricula,
  });
  return data; // { mensaje, usuarioId, medicoId }
}

/**
 * Devuelve los datos del usuario autenticado actual (vía cookie).
 */
export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data;
}

/**
 * Cierra la sesión actual.
 */
export async function logout() {
  const { data } = await api.post("/auth/logout");
  return data;
}

/**
 * Obtiene la lista de obras sociales disponibles (para el registro de pacientes).
 */
export async function getObrasSociales() {
  const { data } = await api.get("/obras-sociales");
  return data;
}

/**
 * Obtiene los planes de una obra social específica.
 */
export async function getPlanesDeObraSocial(obraSocialId) {
  const { data } = await api.get(`/obras-sociales/${obraSocialId}/planes`);
  return data;
}
