import { api } from "./api";

/**
 * Busca turnos disponibles.
 * GET /turnos/disponibles — público, sin auth
 */
export async function buscarTurnosDisponibles(params = {}) {
  const query = {};

  if (params.tipoServicio) query.tipoServicio = params.tipoServicio;
  if (params.sedeId) query.sedeId = params.sedeId;
  if (params.medicoId) query.medicoId = params.medicoId;
  if (params.fechaDesde) query.fechaDesde = params.fechaDesde;
  if (params.fechaHasta) query.fechaHasta = params.fechaHasta;
  if (params.page) query.page = params.page;
  if (params.limit) query.limit = params.limit;

  query.sortBy = params.sortBy ?? "fechaHoraInicio";
  query.sortOrder = params.sortOrder ?? "asc";

  if (params.tipoServicio === "ESPECIALIDAD" && params.especialidadId) {
    query.especialidadId = params.especialidadId;
  }

  if (params.tipoServicio === "PRACTICA" && params.practicaId) {
    query.practicaId = params.practicaId;
  }

  const { data } = await api.get("/turnos/disponibles", { params: query });
  return data;
}

/**
 * Obtiene el historial de turnos del paciente autenticado.
 * GET /pacientes/turnos
 */
export async function obtenerHistorialPaciente() {
  const { data } = await api.get("/pacientes/turnos");
  return Array.isArray(data) ? data : [];
}

/**
 * Reserva un turno disponible para el paciente autenticado.
 * PATCH /turnos/:turnoId/reserva
 */
export async function reservarTurno(turnoId) {
  const { data } = await api.patch(`/turnos/${turnoId}/reserva`);
  return data;
}

/**
 * Cancela un turno.
 * PATCH /turnos/:turnoId/cancelacion
 */
export async function cancelarTurno(turnoId, motivo = "") {
  const { data } = await api.patch(`/turnos/${turnoId}/cancelacion`, {
    motivo,
  });
  return data;
}

/**
 * Obtiene la cotización estimada de un turno para el paciente autenticado.
 * GET /turnos/:turnoId/cotizacion
 */
export async function obtenerCotizacion(turnoId) {
  const { data } = await api.get(`/turnos/${turnoId}/cotizacion`);
  return data;
}
