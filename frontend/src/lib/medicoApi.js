import { api } from "./api";

/**
 * Obtiene la agenda del médico autenticado.
 * GET /medicos/agenda
 */
export async function obtenerAgendaMedico(params = {}) {
  const query = {};

  if (params.fechaDesde) query.fechaDesde = params.fechaDesde;
  if (params.fechaHasta) query.fechaHasta = params.fechaHasta;
  if (params.estado) query.estado = params.estado;

  const { data } = await api.get("/medicos/agenda", { params: query });
  return Array.isArray(data) ? data : [];
}

/**
 * Obtiene los servicios asociados al médico autenticado.
 * GET /medicos/servicios
 */
export async function obtenerServiciosMedico() {
  const { data } = await api.get("/medicos/servicios");
  return Array.isArray(data) ? data : [];
}

/**
 * Obtiene las disponibilidades del médico autenticado.
 * GET /medicos/disponibilidades
 */
export async function obtenerDisponibilidadesMedico() {
  const { data } = await api.get("/medicos/disponibilidades");
  return Array.isArray(data) ? data : [];
}

/**
 * Crea una disponibilidad del médico autenticado.
 * POST /medicos/disponibilidades
 */
export async function crearDisponibilidadMedico(disponibilidad) {
  const { data } = await api.post("/medicos/disponibilidades", {
    disponibilidad,
  });

  return data;
}

/**
 * Elimina una disponibilidad del médico autenticado.
 * DELETE /medicos/disponibilidades
 */
export async function eliminarDisponibilidadMedico(disponibilidad) {
  const { data } = await api.delete("/medicos/disponibilidades", {
    data: { disponibilidad },
  });

  return data;
}

/**
 * Obtiene las sedes asociadas al médico autenticado.
 * GET /medicos/sedes
 */
export async function obtenerSedesMedico() {
  const { data } = await api.get("/medicos/sedes");
  return Array.isArray(data) ? data : [];
}

/**
 * Asocia una especialidad existente al médico autenticado.
 * POST /medicos/especialidades/:especialidadId
 */
export async function agregarSedeMedico(sedeId) {
  const { data } = await api.post(`/medicos/sedes/${sedeId}`);
  return data;
}

export async function quitarSedeMedico(sedeId) {
  const { data } = await api.delete(`/medicos/sedes/${sedeId}`);
  return data;
}

export async function agregarServicioMedico(servicioId) {
  const { data } = await api.post(`/medicos/servicios/${servicioId}`);
  return data;
}

export async function quitarServicioMedico(servicioId) {
  const { data } = await api.delete(`/medicos/servicios/${servicioId}`);
  return data;
}
