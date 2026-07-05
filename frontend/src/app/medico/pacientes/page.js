"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FaBan, FaCalendarAlt, FaStethoscope, FaUserCheck } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";

import { useAuth } from "@/context/AuthContext";
import { RolUsuario } from "@/lib/roles";
import { obtenerAgendaMedico, obtenerHistorialPacienteMedico } from "@/lib/medicoApi";
import { cancelarTurno, confirmarTurno, marcarTurnoRealizado, proponerCambioFecha } from "@/lib/turnosApi";
import { getApiErrorMessage } from "@/lib/api";
import Spinner from "@/components/ui/Spinner";
import Alert from "@/components/ui/Alert";
import { notify } from "@/lib/toast";
import styles from "./page.module.css";

// ─── Utilidades ────────────────────────────────────────────────────────────────

function formatearFecha(fecha) {
    if (!fecha) return "–";
    return new Date(fecha).toLocaleString("es-AR", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

function obtenerServicio(turno) {
    if (turno.tipoServicio === "PRACTICA") return turno.practica?.nombre ?? "Práctica";
    return turno.especialidad?.nombre ?? "Especialidad";
}

function accionesDisponibles(estado) {
    return {
        puedeMarcarRealizado: estado === "Confirmado",
        puedeCancelar: estado === "Reservado",
        puedeProponer: !["Realizado", "Cancelado", "Disponible"].includes(estado),
        puedeConfirmar: estado === "Reservado",
    };
}

const STATUS_STYLE = {
    Disponible: { bg: "#f0eded", color: "var(--on-surf-v)" },
    Reservado:  { bg: "var(--p-fixed)", color: "var(--p)" },
    Confirmado: { bg: "#e6f0fb", color: "#1a4f91" },
    Realizado:  { bg: "#e6f4eb", color: "#166534" },
    Cancelado:  { bg: "#fce8e8", color: "#991b1b" },
};

// Extrae pacientes únicos del array de turnos de la agenda del médico
function extraerPacientes(turnos) {
    const mapa = new Map();
    for (const turno of turnos) {
        const paciente = turno.paciente;
        if (!paciente?._id) continue;
        if (!mapa.has(paciente._id)) {
            mapa.set(paciente._id, paciente);
        }
    }
    return Array.from(mapa.values());
}

// ─── Menú de acciones (igual que AgendaMedicoPage) ─────────────────────────────

const itemStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 12px",
    border: "none",
    background: "transparent",
    color: "var(--on-surf)",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "left",
};

function AccionesTurnoMenu({
                               turno,
                               puedeMarcarRealizado,
                               puedeCancelar,
                               puedeProponer,
                               puedeConfirmar,
                               accionCargando,
                               onRealizado,
                               onConfirmar,
                               onCambiarFecha,
                               onCancelar,
                           }) {
    const hayAcciones = puedeMarcarRealizado || puedeCancelar || puedeProponer || puedeConfirmar;
    if (!hayAcciones) return null;

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    disabled={accionCargando}
                    aria-label="Acciones del turno"
                    style={{
                        width: 34, height: 34, borderRadius: 8, border: "none",
                        background: "transparent", color: "var(--on-surf-v)",
                        cursor: accionCargando ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all .18s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--p-fixed)"; e.currentTarget.style.color = "var(--p)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--on-surf-v)"; }}
                >
                    <FaEllipsisVertical size={16} />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content sideOffset={8} align="end" style={{
                    minWidth: 210, padding: 6, borderRadius: 12, background: "#fff",
                    border: "1px solid var(--outline-v)", boxShadow: "0 10px 30px rgba(0,0,0,.10)", zIndex: 9999,
                }}>
                    {puedeConfirmar && (
                        <DropdownMenu.Item asChild>
                            <button style={itemStyle} onClick={() => onConfirmar(turno._id)}>
                                <FaUserCheck size={14} color="var(--p)" /> Confirmar turno
                            </button>
                        </DropdownMenu.Item>
                    )}
                    {puedeMarcarRealizado && (
                        <DropdownMenu.Item asChild>
                            <button style={itemStyle} onClick={() => onRealizado(turno._id)}>
                                <FaStethoscope size={14} color="var(--p)" /> Marcar realizado
                            </button>
                        </DropdownMenu.Item>
                    )}
                    {puedeProponer && (
                        <DropdownMenu.Item asChild>
                            <button style={itemStyle} onClick={() => onCambiarFecha(turno)}>
                                <FaCalendarAlt size={14} color="var(--p)" /> Cambiar fecha
                            </button>
                        </DropdownMenu.Item>
                    )}
                    {puedeCancelar && (
                        <>
                            <DropdownMenu.Separator style={{ height: 1, background: "var(--outline-v)", margin: "6px 0" }} />
                            <DropdownMenu.Item asChild>
                                <button
                                    style={{ ...itemStyle, color: "#991b1b", borderRadius: 8 }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = "#fff5f5"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                                    onClick={() => onCancelar(turno)}
                                >
                                    <FaBan size={14} /> Cancelar turno
                                </button>
                            </DropdownMenu.Item>
                        </>
                    )}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}

// ─── Página principal ───────────────────────────────────────────────────────────

export default function PacientesTurnosPage() {
    const router = useRouter();
    const { usuario, cargando } = useAuth();
    const esMedico = usuario?.rol === RolUsuario.MEDICO;

    // Pacientes extraídos de la agenda del médico
    const [pacientes, setPacientes] = useState([]);
    const [cargandoPacientes, setCargandoPacientes] = useState(true);
    const [errorPacientes, setErrorPacientes] = useState("");

    // Paciente seleccionado y su historial
    const [pacienteId, setPacienteId] = useState("");
    const [historial, setHistorial] = useState([]);
    const [cargandoHistorial, setCargandoHistorial] = useState(false);
    const [errorHistorial, setErrorHistorial] = useState("");

    // Modals y acciones
    const [modalTurno, setModalTurno] = useState(null);
    const [modalTipo, setModalTipo] = useState(null);
    const [nuevaFecha, setNuevaFecha] = useState("");
    const [motivoCancelacion, setMotivo] = useState("");
    const [accionCargando, setAccionCargando] = useState(false);

    // Redirigir si no es médico
    useEffect(() => {
        if (cargando) return;
        if (!usuario) { router.replace("/login"); return; }
        if (!esMedico) router.replace("/perfil");
    }, [cargando, usuario, esMedico, router]);

    // Cargar todos los turnos de la agenda y extraer pacientes únicos
    useEffect(() => {
        if (cargando || !usuario || !esMedico) return;

        let cancelado = false;

        (async () => {
            try {
                // Sin filtros para obtener todos los turnos y extraer todos los pacientes
                const turnos = await obtenerAgendaMedico({});
                if (!cancelado) setPacientes(extraerPacientes(turnos));
            } catch (err) {
                if (!cancelado) setErrorPacientes(getApiErrorMessage(err, "No pudimos cargar los pacientes."));
            } finally {
                if (!cancelado) setCargandoPacientes(false);
            }
        })();

        return () => { cancelado = true; };
    }, [cargando, usuario, esMedico]);

    // Cargar historial cuando cambia el paciente seleccionado
    useEffect(() => {
        // Si no hay id o el id es literalmente el string "undefined", cancelamos la petición
        if (!pacienteId || pacienteId === "undefined") {
            setHistorial([]);
            return;
        }

        let cancelado = false;
        setCargandoHistorial(true);
        setErrorHistorial("");
        setHistorial([]);

        (async () => {
            try {
                const data = await obtenerHistorialPacienteMedico(pacienteId);
                if (!cancelado) setHistorial(data);
            } catch (err) {
                if (!cancelado) setErrorHistorial(getApiErrorMessage(err, "No pudimos cargar el historial del paciente."));
            } finally {
                if (!cancelado) setCargandoHistorial(false);
            }
        })();

        return () => { cancelado = true; };
    }, [pacienteId]);

    // Handlers de acciones

    const handleMarcarRealizado = async (turnoId) => {
        setAccionCargando(true);
        try {
            await marcarTurnoRealizado(turnoId);
            notify.success("Turno marcado como realizado.");
            setHistorial((ts) => ts.map((t) => t._id === turnoId ? { ...t, estado: "Realizado" } : t));
        } catch (err) {
            notify.error(getApiErrorMessage(err, "No se pudo marcar el turno como realizado."));
        } finally {
            setAccionCargando(false);
        }
    };

    const handleConfirmar = async (turnoId) => {
        setAccionCargando(true);
        try {
            await confirmarTurno(turnoId);
            notify.success("Turno confirmado.");
            setHistorial((ts) => ts.map((t) => t._id === turnoId ? { ...t, estado: "Confirmado" } : t));
        } catch (err) {
            notify.error(getApiErrorMessage(err, "No se pudo confirmar el turno."));
        } finally {
            setAccionCargando(false);
        }
    };

    const handleCancelar = async () => {
        if (!motivoCancelacion.trim()) { notify.error("Ingresá un motivo para cancelar."); return; }
        setAccionCargando(true);
        try {
            await cancelarTurno(modalTurno._id, motivoCancelacion);
            notify.success("Turno cancelado correctamente.");
            setHistorial((ts) => ts.map((t) => t._id === modalTurno._id ? { ...t, estado: "Disponible" } : t));
            cerrarModal();
        } catch (err) {
            notify.error(getApiErrorMessage(err, "No se pudo cancelar el turno."));
        } finally {
            setAccionCargando(false);
        }
    };

    const handleProponerCambio = async () => {
        if (!nuevaFecha) { notify.error("Seleccioná una nueva fecha y hora."); return; }
        setAccionCargando(true);
        try {
            await proponerCambioFecha(modalTurno._id, nuevaFecha);
            notify.success("Propuesta de cambio enviada.");
            cerrarModal();
            // Recargamos el historial para reflejar el cambio de fecha
            const data = await obtenerHistorialPacienteMedico(pacienteId);
            setHistorial(data);
        } catch (err) {
            notify.error(getApiErrorMessage(err, "No se pudo proponer el cambio de fecha."));
        } finally {
            setAccionCargando(false);
        }
    };

    const abrirModal = (turno, tipo) => { setModalTurno(turno); setModalTipo(tipo); setNuevaFecha(""); setMotivo(""); };
    const cerrarModal = () => { setModalTurno(null); setModalTipo(null); setNuevaFecha(""); setMotivo(""); };

    // Render

    if (cargando || !usuario || !esMedico) {
        return (
            <div className={styles.loading}>
                <Spinner size={36} />
                <span>Cargando...</span>
            </div>
        );
    }

    const pacienteSeleccionado = pacientes.find((p) => p._id === pacienteId);

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Pacientes y turnos</h1>
                <p className={styles.description}>
                    Consultá el historial de turnos de tus pacientes y gestioná cancelaciones, realizaciones y cambios de fecha.
                </p>
            </div>

            {/* Selector de paciente */}
            <section className={`glass ${styles.filters}`}>
                <div className={styles.field} style={{ flex: 1 }}>
                    <label>Paciente</label>
                    {cargandoPacientes ? (
                        <div className={styles.selectLoading}>
                            <Spinner size={16} />
                            <span>Cargando pacientes...</span>
                        </div>
                    ) : errorPacientes ? (
                        <Alert type="error">{errorPacientes}</Alert>
                    ) : (
                        <select
                            value={pacienteId}
                            onChange={(e) => {
                                setPacienteId(e.target.value)
                            }}
                        >
                            <option value="">
                                {pacientes.length === 0 ? "Sin pacientes en tu agenda" : "Seleccioná un paciente"}
                            </option>
                            {pacientes.map((p) => (
                                <option key={p._id} value={p._id}>
                                    {p.nombre} {p.apellido}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </section>

            {/* Historial */}
            {!pacienteId ? (
                <div className={styles.emptyState}>
                    <h2>Seleccioná un paciente</h2>
                    <p>El historial de turnos aparecerá acá una vez que elijas un paciente del selector.</p>
                </div>
            ) : cargandoHistorial ? (
                <div className={styles.centered}>
                    <Spinner size={32} />
                </div>
            ) : errorHistorial ? (
                <Alert type="error" style={{ marginBottom: 16 }}>{errorHistorial}</Alert>
            ) : historial.length === 0 ? (
                <div className={styles.emptyState}>
                    <h2>Sin turnos registrados</h2>
                    <p>{pacienteSeleccionado?.nombre} no tiene turnos en el historial.</p>
                </div>
            ) : (
                <>
                    <p className={styles.resultCount}>
                        {historial.length} {historial.length === 1 ? "turno" : "turnos"} para{" "}
                        <strong>{pacienteSeleccionado?.nombre} {pacienteSeleccionado?.apellido}</strong>
                    </p>

                    <div className={styles.list}>
                        {historial.map((turno) => {
                            const { puedeMarcarRealizado, puedeCancelar, puedeProponer, puedeConfirmar } = accionesDisponibles(turno.estado);
                            const statusStyle = STATUS_STYLE[turno.estado] ?? STATUS_STYLE.Disponible;

                            return (
                                <article key={turno._id} className={styles.card} style={{ position: "relative" }}>
                                    <span style={{
                                        padding: "3px 11px", borderRadius: 999, fontSize: 10, fontWeight: 700,
                                        background: statusStyle.bg, color: statusStyle.color,
                                        whiteSpace: "nowrap", alignSelf: "center", flexShrink: 0,
                                    }}>
                                        {turno.estado}
                                    </span>

                                    <div className={styles.cardField}>
                                        <span className={styles.cardLabel}>Fecha y hora</span>
                                        <strong className={styles.date}>{formatearFecha(turno.fechaHoraInicio)}</strong>
                                        <span className={styles.muted}>hasta {formatearFecha(turno.fechaHoraFin)}</span>
                                    </div>

                                    <div className={styles.cardField}>
                                        <span className={styles.cardLabel}>Servicio</span>
                                        <strong>{obtenerServicio(turno)}</strong>
                                        <span className={styles.muted}>{turno.tipoServicio}</span>
                                    </div>

                                    <div className={styles.cardField}>
                                        <span className={styles.cardLabel}>Sede</span>
                                        <strong>{turno.sede?.nombre ?? "Sin sede"}</strong>
                                    </div>

                                    <div style={{ position: "absolute", top: 18, right: 18 }}>
                                        <AccionesTurnoMenu
                                            turno={turno}
                                            puedeMarcarRealizado={puedeMarcarRealizado}
                                            puedeCancelar={puedeCancelar}
                                            puedeProponer={puedeProponer}
                                            puedeConfirmar={puedeConfirmar}
                                            accionCargando={accionCargando}
                                            onRealizado={handleMarcarRealizado}
                                            onConfirmar={handleConfirmar}
                                            onCambiarFecha={(t) => abrirModal(t, "proponer")}
                                            onCancelar={(t) => abrirModal(t, "cancelar")}
                                        />
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Modals */}
            {modalTurno && (
                <div className={styles.modalOverlay}>
                    <div className={`wellness-card ${styles.modal}`}>
                        <h3 className={styles.modalTitle}>
                            {modalTipo === "cancelar" ? "Cancelar turno" : "Proponer cambio de fecha"}
                        </h3>
                        <p className={styles.modalSubtitle}>
                            {obtenerServicio(modalTurno)} · {formatearFecha(modalTurno.fechaHoraInicio)}
                        </p>

                        {modalTipo === "cancelar" && (
                            <div>
                                <label className={styles.modalLabel}>Motivo</label>
                                <textarea
                                    rows={3}
                                    className={styles.modalTextarea}
                                    value={motivoCancelacion}
                                    onChange={(e) => setMotivo(e.target.value)}
                                    placeholder="Indicá el motivo de la cancelación..."
                                />
                            </div>
                        )}

                        {modalTipo === "proponer" && (
                            <div>
                                <label className={styles.modalLabel}>Nueva fecha y hora</label>
                                <input
                                    type="datetime-local"
                                    className={styles.modalInput}
                                    value={nuevaFecha}
                                    onChange={(e) => setNuevaFecha(e.target.value)}
                                />
                            </div>
                        )}

                        <div className={styles.modalActions}>
                            <button className={styles.modalBtnSecondary} onClick={cerrarModal} disabled={accionCargando}>
                                Cancelar
                            </button>
                            <button
                                className={styles.modalBtnPrimary}
                                style={{ background: modalTipo === "cancelar" ? "#991b1b" : "var(--p)" }}
                                onClick={modalTipo === "cancelar" ? handleCancelar : handleProponerCambio}
                                disabled={accionCargando}
                            >
                                {accionCargando
                                    ? "Procesando..."
                                    : modalTipo === "cancelar"
                                        ? "Confirmar cancelación"
                                        : "Enviar propuesta"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}