import { api } from "./api";

/**
 * Obtiene todas las especialidades.
 * GET /especialidades — público
 * Response: array directo [{ _id, nombre, duracionTurnoEnMins }]
 */
export async function getServicios() {
  const { data } = await api.get("/servicios");
  return Array.isArray(data) ? data : [];
}


/**
 * Obtiene todas las sedes.
 * GET /sedes — público
 * Response: array directo [{ _id, nombre }]
 */
export async function getSedes() {
  const { data } = await api.get("/sedes");
  return Array.isArray(data) ? data : [];
}

/**
 * Obtiene todos los planes.
 * GET /planes — público
 * IMPORTANTE: el PlanController devuelve { data: planes }, NO un array directo.
 * (ver backend/src/controllers/PlanController.js → obtenerTodos)
 */
export async function getPlanes() {
  const { data } = await api.get("/planes");
  // El backend responde { data: [...] } — no array directo
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}
