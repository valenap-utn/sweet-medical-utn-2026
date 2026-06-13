import { api } from "./api";

export async function getEspecialidades() {
  const { data } = await api.get("/especialidades");
  return Array.isArray(data) ? data : [];
}

export async function getPracticas() {
  const { data } = await api.get("/practicas");
  return Array.isArray(data) ? data : [];
}

export async function getSedes() {
  const { data } = await api.get("/sedes");
  return Array.isArray(data) ? data : [];
}

export async function getPlanes() {
  const { data } = await api.get("/planes");
  return Array.isArray(data) ? data : [];
}
