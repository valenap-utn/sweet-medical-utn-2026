"use client";

import {useCallback, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {FaBan, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaStethoscope, FaUserCheck} from "react-icons/fa";
import {FaEllipsisVertical} from "react-icons/fa6";

import {useAuth} from "@/context/AuthContext";
import {RolUsuario} from "@/lib/roles";
import {obtenerAgendaMedico} from "@/lib/medicoApi";
import {cancelarTurno, confirmarTurno, marcarTurnoRealizado, proponerCambioFecha,} from "@/lib/turnosApi";
import {getApiErrorMessage} from "@/lib/api";
import Spinner from "@/components/ui/Spinner";
import styles from "./page.module.css";
import {notify} from "@/lib/toast";
import Alert from "@/components/ui/Alert";

const ESTADOS = ["", "Disponible", "Reservado", "Confirmado", "Realizado", "Cancelado"];

const STATUS_STYLE = {
    Disponible: {bg: "#f0eded", color: "var(--on-surf-v)"},
    Reservado: {bg: "var(--p-fixed)", color: "var(--p)"},
    Confirmado: {bg: "#e6f0fb", color: "#1a4f91"},
    Realizado: {bg: "#e6f4eb", color: "#166534"},
    Cancelado: {bg: "#fce8e8", color: "#991b1b"},
};

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
    const hayAcciones =
        puedeMarcarRealizado || puedeCancelar || puedeProponer || puedeConfirmar;

    if (!hayAcciones) return null;

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

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    disabled={accionCargando}
                    aria-label="Acciones del turno"
                    style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        border: "none",
                        background: "transparent",
                        color: "var(--on-surf-v)",
                        cursor: accionCargando ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all .18s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--p-fixed)";
                        e.currentTarget.style.color = "var(--p)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--on-surf-v)";
                    }}
                >
                    <FaEllipsisVertical size={16}/>
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    sideOffset={8}
                    align="end"
                    style={{
                        minWidth: 210,
                        padding: 6,
                        borderRadius: 12,
                        background: "#fff",
                        border: "1px solid var(--outline-v)",
                        boxShadow: "0 10px 30px rgba(0,0,0,.10)",
                        zIndex: 9999,
                    }}
                >
                    {puedeConfirmar && (
                        <DropdownMenu.Item asChild>
                            <button style={itemStyle} onClick={() => onConfirmar(turno._id)}>
                                <FaUserCheck size={14} color="var(--p)"/>
                                Confirmar turno
                            </button>
                        </DropdownMenu.Item>
                    )}

                    {puedeMarcarRealizado && (
                        <DropdownMenu.Item asChild>
                            <button style={itemStyle} onClick={() => onRealizado(turno._id)}>
                                <FaStethoscope size={14} color="var(--p)"/>
                                Marcar realizado
                            </button>
                        </DropdownMenu.Item>
                    )}

                    {puedeProponer && (
                        <DropdownMenu.Item asChild>
                            <button style={itemStyle} onClick={() => onCambiarFecha(turno)}>
                                <FaCalendarAlt size={14} color="var(--p)"/>
                                Cambiar fecha
                            </button>
                        </DropdownMenu.Item>
                    )}

                    {puedeCancelar && (
                        <>
                            <DropdownMenu.Separator
                                style={{
                                    height: 1,
                                    background: "var(--outline-v)",
                                    margin: "6px 0",
                                }}
                            />

                            <DropdownMenu.Item asChild>
                                <button
                                    style={{
                                        ...itemStyle,
                                        color: "#991b1b",
                                        borderRadius: 8,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#fff5f5";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "transparent";
                                    }}
                                    onClick={() => onCancelar(turno)}
                                >
                                    <FaBan size={14}/>
                                    Cancelar turno
                                </button>
                            </DropdownMenu.Item>
                        </>
                    )}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}

export default function AgendaMedicoPage() {
    const router = useRouter();
    const {usuario, cargando} = useAuth();
    const esMedico = usuario?.rol === RolUsuario.MEDICO;

    const [filtros, setFiltros] = useState({
        fechaDesde: "",
        fechaHasta: "",
        estado: "",
        sortOrder: "asc",
    });

    const [turnos, setTurnos] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const [cargandoAgenda, setCargandoAgenda] = useState(true);
    const [error, setError] = useState("");

    const [modalTurno, setModalTurno] = useState(null);
    const [nuevaFecha, setNuevaFecha] = useState("");
    const [motivoCancelacion, setMotivo] = useState("");
    const [modalTipo, setModalTipo] = useState(null);
    const [accionCargando, setAccionCargando] = useState(false);

    useEffect(() => {
        if (cargando) return;
        if (!usuario) {
            router.replace("/login");
            return;
        }
        if (!esMedico) router.replace("/perfil");
    }, [cargando, usuario, esMedico, router]);

    useEffect(() => {
        if (cargando || !usuario || !esMedico) return;

        let cancelado = false;

        (async () => {
            try {
                const data = await obtenerAgendaMedico({
                    fechaDesde: "",
                    fechaHasta: "",
                    estado: "",
                    page: 1,
                    limit,
                });

                if (!cancelado) {
                    setTurnos(data.turnos ?? []);
                    setTotalPages(data.totalPages ?? 1);
                }

            } catch (err) {
                if (!cancelado) {
                    setError(getApiErrorMessage(err, "No pudimos cargar la agenda médica."));
                }
            } finally {
                if (!cancelado) setCargandoAgenda(false);
            }
        })();

        return () => {
            cancelado = true;
        };
    }, [cargando, usuario, esMedico]);

    const buscarAgenda = useCallback(async (pagina = page) => {
        setCargandoAgenda(true);
        setError("");

        try {
            const data = await obtenerAgendaMedico({
                ...filtros,
                page: pagina,
                limit,
            });

            setTurnos(data.turnos ?? []);
            setTotalPages(data.totalPages ?? 1);
            setPage(pagina);
        } catch (err) {
            setError(getApiErrorMessage(err, "No pudimos cargar la agenda médica."));
        } finally {
            setCargandoAgenda(false);
        }
    }, [filtros, page, limit]);

    const getPaginasVisibles = () => {
        if (totalPages <= 7) {
            return Array.from({length: totalPages}, (_, i) => i + 1);
        }

        const paginas = [1];

        if (page > 4) paginas.push("...");

        const inicio = Math.max(2, page - 2);
        const fin = Math.min(totalPages - 1, page + 2);

        for (let i = inicio; i <= fin; i++) {
            paginas.push(i);
        }

        if (page < totalPages - 3) paginas.push("...");

        paginas.push(totalPages);

        return paginas;
    };

    const handleMarcarRealizado = async (turnoId) => {
        setAccionCargando(true);

        try {
            await marcarTurnoRealizado(turnoId);
            notify.success("Turno marcado como realizado.");
            setTurnos((ts) =>
                ts.map((t) => (t._id === turnoId ? {...t, estado: "Realizado"} : t))
            );
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
            setTurnos((ts) =>
                ts.map((t) => (t._id === turnoId ? {...t, estado: "Confirmado"} : t))
            );
        } catch (err) {
            notify.error(getApiErrorMessage(err, "No se pudo confirmar el turno."));
        } finally {
            setAccionCargando(false);
        }
    };

    const handleCancelar = async () => {
        if (!motivoCancelacion.trim()) {
            notify.error("Ingresá un motivo para cancelar.");
            return;
        }
        setAccionCargando(true);

        try {
            await cancelarTurno(modalTurno._id, motivoCancelacion);
            notify.success("Turno cancelado correctamente.");
            setTurnos((ts) =>
                ts.map((t) =>
                    t._id === modalTurno._id ? {...t, estado: "Disponible"} : t
                )
            );
            cerrarModal();
        } catch (err) {
            notify.error(getApiErrorMessage(err, "No se pudo cancelar el turno."));
        } finally {
            setAccionCargando(false);
        }
    };

    const handleProponerCambio = async () => {
        if (!nuevaFecha) {
            notify.error("Seleccioná una nueva fecha y hora.");
            return;
        }

        setAccionCargando(true);

        try {
            await proponerCambioFecha(modalTurno._id, nuevaFecha);
            notify.success("Propuesta de cambio enviada.");
            cerrarModal();
            await buscarAgenda();
        } catch (err) {
            notify.error(getApiErrorMessage(err, "No se pudo proponer el cambio de fecha."));
        } finally {
            setAccionCargando(false);
        }
    };

    const abrirModal = (turno, tipo) => {
        setModalTurno(turno);
        setModalTipo(tipo);
        setNuevaFecha("");
        setMotivo("");
    };

    const cerrarModal = () => {
        setModalTurno(null);
        setModalTipo(null);
        setNuevaFecha("");
        setMotivo("");
    };

    if (cargando || !usuario || !esMedico) {
        return (
            <div className={styles.loading}>
                <Spinner size={36}/>
                <span>Preparando agenda...</span>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Agenda médica</h1>
                <p className={styles.description}>
                    Consultá tus turnos y gestioná cancelaciones, realizaciones y cambios de fecha.
                </p>
            </div>

            <section className={`glass ${styles.filters}`}>
                <div className={styles.field}>
                    <label>Fecha desde</label>
                    <input
                        type="date"
                        value={filtros.fechaDesde}
                        onChange={(e) =>
                            setFiltros((f) => ({...f, fechaDesde: e.target.value}))
                        }
                    />
                </div>

                <div className={styles.field}>
                    <label>Fecha hasta</label>
                    <input
                        type="date"
                        value={filtros.fechaHasta}
                        onChange={(e) =>
                            setFiltros((f) => ({...f, fechaHasta: e.target.value}))
                        }
                    />
                </div>

                <div className={styles.field}>
                    <label>Estado</label>
                    <select
                        value={filtros.estado}
                        onChange={(e) =>
                            setFiltros((f) => ({...f, estado: e.target.value}))
                        }
                    >
                        {ESTADOS.map((e) => (
                            <option key={e} value={e}>
                                {e || "Todos"}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={() => void buscarAgenda(1)}
                    disabled={cargandoAgenda}
                    className={styles.searchButton}
                >
                    {cargandoAgenda ? "Buscando..." : "Buscar"}
                </button>
            </section>

            {error && (
                <Alert type="error" style={{marginBottom: 16}}>
                    {error}
                </Alert>
            )}

            {!cargandoAgenda && turnos.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginBottom: 16,
                    }}
                >
                    <select
                        value={filtros.sortOrder}
                        onChange={(e) => {
                            setFiltros((f) => ({...f, sortOrder: e.target.value}));
                            setPage(1);
                        }}
                        style={{
                            width: "auto",
                            padding: "10px 12px",
                            borderRadius: 11,
                            border: "1.5px solid var(--outline-v)",
                            background: "#fff",
                            color: "var(--on-surf)",
                            fontSize: 13,
                            fontFamily: "'Hanken Grotesk',system-ui,sans-serif",
                            outline: "none",
                        }}
                    >
                        <option value="asc">Fecha más cercana</option>
                        <option value="desc">Fecha más lejana</option>
                    </select>
                </div>
            )}

            {cargandoAgenda ? (
                <div className={styles.centered}>
                    <Spinner size={32}/>
                </div>
            ) : turnos.length === 0 ? (
                <div className={styles.emptyState}>
                    <h2>No hay turnos para mostrar</h2>
                    <p>Probá cambiando los filtros o generando nuevas disponibilidades.</p>
                </div>
            ) : (
                <>
                    <div className={styles.list}>
                        {turnos.map((turno) => {
                            const {
                                puedeMarcarRealizado,
                                puedeCancelar,
                                puedeProponer,
                                puedeConfirmar,
                            } = accionesDisponibles(turno.estado);

                            const statusStyle = STATUS_STYLE[turno.estado] ?? STATUS_STYLE.Disponible;

                            return (
                                <article key={turno._id} className={styles.card}
                                         style={{
                                             position: "relative",
                                         }}>
                        <span
                            style={{
                                padding: "3px 11px",
                                borderRadius: 999,
                                fontSize: 10,
                                fontWeight: 700,
                                background: statusStyle.bg,
                                color: statusStyle.color,
                                whiteSpace: "nowrap",
                                alignSelf: "center",
                                flexShrink: 0,
                            }}
                        >
                          {turno.estado}
                        </span>

                                    <div className={styles.cardField}>
                                        <span className={styles.cardLabel}>Fecha y hora</span>
                                        <strong className={styles.date}>
                                            {formatearFecha(turno.fechaHoraInicio)}
                                        </strong>
                                        <span className={styles.muted}>
                                            hasta {formatearFecha(turno.fechaHoraFin)}
                                        </span>
                                    </div>

                                    <div className={styles.cardField}>
                                        <span className={styles.cardLabel}>Servicio</span>
                                        <strong>{obtenerServicio(turno)}</strong>
                                        <span className={styles.muted}>{turno.tipoServicio}</span>
                                    </div>

                                    <div className={styles.cardField}>
                                        <span className={styles.cardLabel}>Sede</span>
                                        <strong>{turno.sede?.nombre ?? "Sin sede"}</strong>
                                        <span className={styles.muted}>
                                            {turno.paciente?.nombre ?? "Sin paciente"}
                                        </span>
                                    </div>

                                    <div
                                        style={{
                                            position: "absolute",
                                            top: 18,
                                            right: 18,
                                        }}
                                    >
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

                    {totalPages > 1 && (
                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                                justifyContent: "center",
                                marginTop: 24,
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <button
                                onClick={() => void buscarAgenda(Math.max(1, page - 1))}
                                disabled={page === 1 || cargandoAgenda}
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    border: "1.5px solid var(--outline-v)",
                                    background: "#fff",
                                    color: page === 1 ? "var(--secondary)" : "var(--p)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: page === 1 ? "not-allowed" : "pointer",
                                    opacity: page === 1 ? 0.45 : 1,
                                    transition: "all .15s ease",
                                }}
                            >
                                <FaChevronLeft size={12}/>
                            </button>

                            {getPaginasVisibles().map((n, index) =>
                                    n === "..." ? (
                                        <span
                                            key={`dots-${index}`}
                                            style={{
                                                color: "var(--secondary)",
                                                fontWeight: 700,
                                                padding: "0 4px",
                                            }}
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={n}
                                            onClick={() => void buscarAgenda(n)}
                                            style={{
                                                minWidth: 34,
                                                height: 34,
                                                padding: "0 10px",
                                                borderRadius: 999,
                                                border: "1.5px solid",
                                                borderColor: n === page ? "var(--p)" : "var(--outline-v)",
                                                background: n === page ? "var(--p)" : "#fff",
                                                color: n === page ? "#fff" : "var(--on-surf-v)",
                                                fontSize: 13,
                                                fontWeight: 700,
                                                cursor: "pointer",
                                                fontFamily: "inherit",
                                                transition: "all .15s",
                                            }}
                                        >
                                            {n}
                                        </button>
                                    )
                            )}

                            <button
                                onClick={() => void buscarAgenda(Math.min(totalPages, page + 1))}                                disabled={page === totalPages || cargandoAgenda}
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    border: "1.5px solid var(--outline-v)",
                                    background: "#fff",
                                    color: page === totalPages ? "var(--secondary)" : "var(--p)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: page === totalPages ? "not-allowed" : "pointer",
                                    opacity: page === totalPages ? 0.45 : 1,
                                    transition: "all .15s ease",
                                }}
                            >
                                <FaChevronRight size={12}/>
                            </button>
                        </div>
                    )}
                </>
            )}
            {modalTurno && (
                <div className={styles.modalOverlay}>
                    <div className={`wellness-card ${styles.modal}`}>
                        <h3 className={styles.modalTitle}>
                            {modalTipo === "cancelar"
                                ? "Cancelar turno"
                                : "Proponer cambio de fecha"}
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
                            <button
                                className={styles.modalBtnSecondary}
                                onClick={cerrarModal}
                                disabled={accionCargando}
                            >
                                Cancelar
                            </button>

                            <button
                                className={styles.modalBtnPrimary}
                                style={{
                                    background: modalTipo === "cancelar" ? "#991b1b" : "var(--p)",
                                }}
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
            )
            }
        </div>
    )
        ;
}