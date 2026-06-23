import { api } from "./api";

/**
 * Busca turnos disponibles.
 * GET /turnos/disponibles — público, sin auth
 *
 * Query params aceptados por el backend (TurnoRepository.buscarTurnosDisponibles):
 *   - tipoServicio:   "ESPECIALIDAD" | "PRACTICA"
 *   - especialidadId: ObjectId (solo si tipoServicio === "ESPECIALIDAD")
 *   - practicaId:     ObjectId (solo si tipoServicio === "PRACTICA")
 *   - sedeId:         ObjectId
 *   - medicoId:       ObjectId
 *   - fechaDesde:     ISO string (parseado con parseISO en el servicio)
 *   - fechaHasta:     ISO string
 *   - page:           number (default 1)
 *   - limit:          number (default 10)
 *   - sortBy:         string (default "fechaHoraInicio")
 *   - sortOrder:      "asc" | "desc"
 *
 * Response: { turnos: [...], total: number, page: number, limit: number }
 * Cada turno tiene: { _id, medico (populated), sede (populated),
 *                     especialidad (populated), practica (populated),
 *                     tipoServicio, fechaHoraInicio, fechaHoraFin,
 *                     estado, duracionEnMins?, costo? }
 */
export async function buscarTurnosDisponibles(params = {}) {
  const query = {};

  if (params.tipoServicio)   query.tipoServicio   = params.tipoServicio;
  if (params.sedeId)         query.sedeId         = params.sedeId;
  if (params.medicoId)       query.medicoId       = params.medicoId;
  if (params.fechaDesde)     query.fechaDesde     = params.fechaDesde;
  if (params.fechaHasta)     query.fechaHasta     = params.fechaHasta;
  if (params.page)           query.page           = params.page;
  if (params.limit)          query.limit          = params.limit;
  query.sortBy    = params.sortBy    ?? "fechaHoraInicio";
  query.sortOrder = params.sortOrder ?? "asc";

  // El backend filtra por especialidad o práctica dependiendo del tipoServicio
  if (params.tipoServicio === "ESPECIALIDAD" && params.especialidadId) {
    query.especialidadId = params.especialidadId;
  }
  if (params.tipoServicio === "PRACTICA" && params.practicaId) {
    query.practicaId = params.practicaId;
  }

  const { data } = await api.get("/turnos/disponibles", { params: query });
  return data; // { turnos, total, page, limit }
}

/**
 * Obtiene el historial de turnos del paciente autenticado.
 * GET /pacientes/turnos — requiere auth (cookie accessToken)
 * Response: array de turnos del paciente (todos los estados)
 */
export async function obtenerHistorialPaciente() {
  const { data } = await api.get("/pacientes/turnos");
  return Array.isArray(data) ? data : [];
}

/**
 * Reserva un turno disponible para el paciente autenticado.
 * PATCH /turnos/:turnoId/reserva — requiere auth
 * Response: turno actualizado con estado "Reservado"
 */
export async function reservarTurno(turnoId) {
  const { data } = await api.patch(`/turnos/${turnoId}/reserva`);
  return data;
}

/**
 * Cancela un turno (paciente o médico autenticado).
 * PATCH /turnos/:turnoId/cancelacion — requiere auth
 * Body: { motivo?: string }
 */
export async function cancelarTurno(turnoId, motivo = "") {
  const { data } = await api.patch(`/turnos/${turnoId}/cancelacion`, { motivo });
  return data;
}

/**
 * Obtiene la cotización estimada de un turno para el paciente autenticado.
 * GET /turnos/:turnoId/cotizacion — requiere auth
 * Response: { turno, cobertura, costo }
 */
export async function obtenerCotizacion(turnoId) {
  const { data } = await api.get(`/turnos/${turnoId}/cotizacion`);
  return data;
}

/**
 * Obtiene la agenda del médico autenticado.
 * GET /medicos/agenda — requiere auth de médico
 *
 * Query params opcionales:
 * - fechaDesde: YYYY-MM-DD
 * - fechaHasta: YYYY-MM-DD
 * - estado: Disponible | Reservado | Confirmado | Cancelado
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
 * Obtiene las especialidades asociadas al médico autenticado.
 * GET /medicos/especialidades
 */
export async function obtenerEspecialidadesMedico() {
  const { data } = await api.get("/medicos/especialidades");
  return Array.isArray(data) ? data : [];
}

/**
 * Obtiene las prácticas asociadas al médico autenticado.
 * GET /medicos/practicas
 */
export async function obtenerPracticasMedico() {
  const { data } = await api.get("/medicos/practicas");
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
