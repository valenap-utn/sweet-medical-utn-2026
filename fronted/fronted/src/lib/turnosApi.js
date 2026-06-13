import { api } from "./api";

/**
 * Busca turnos disponibles.
 * Params acepta: tipoServicio, especialidadId, practicaId, sedeId,
 *                fechaDesde, fechaHasta, page, limit, sortBy, sortOrder
 * Mapea exactamente los query params del backend GET /turnos/disponibles
 */
export async function buscarTurnosDisponibles(params = {}) {
  const query = {};
  if (params.tipoServicio)   query.tipoServicio   = params.tipoServicio;
  if (params.especialidadId) query.especialidadId = params.especialidadId;
  if (params.practicaId)     query.practicaId     = params.practicaId;
  if (params.sedeId)         query.sedeId         = params.sedeId;
  if (params.fechaDesde)     query.fechaDesde     = params.fechaDesde;
  if (params.fechaHasta)     query.fechaHasta     = params.fechaHasta;
  if (params.page)           query.page           = params.page;
  if (params.limit)          query.limit          = params.limit;
  query.sortBy    = params.sortBy    ?? "fechaHoraInicio";
  query.sortOrder = params.sortOrder ?? "asc";

  const { data } = await api.get("/turnos/disponibles", { params: query });
  return data; // { turnos, total, page, limit }
}

/** Obtiene historial de turnos del paciente autenticado */
export async function obtenerHistorialPaciente() {
  const { data } = await api.get("/pacientes/turnos");
  return data;
}

/** Reserva un turno (requiere auth de paciente) */
export async function reservarTurno(turnoId) {
  const { data } = await api.patch(`/turnos/${turnoId}/reserva`);
  return data;
}

/** Cancela un turno */
export async function cancelarTurno(turnoId, motivo = "") {
  const { data } = await api.patch(`/turnos/${turnoId}/cancelacion`, { motivo });
  return data;
}

/** Obtiene cotización para un turno específico */
export async function obtenerCotizacion(turnoId) {
  const { data } = await api.get(`/turnos/${turnoId}/cotizacion`);
  return data;
}
