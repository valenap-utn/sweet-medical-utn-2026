"use client";
import {useCallback, useEffect, useState} from "react";
import {buscarTurnosDisponibles} from "@/lib/turnosApi";
import {getEspecialidades, getPracticas, getSedes} from "@/lib/serviciosApi";
import {getApiErrorMessage} from "@/lib/api";
import {useCarrito} from "@/context/CarritoContext";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import Link from "next/link";
import {useAuth} from "@/context/AuthContext";
import {RolUsuario} from "@/lib/roles";
import {
    FaCalendarAlt,
    FaCheck, FaChevronLeft, FaChevronRight,
    FaClock,
    FaFlask,
    FaMapMarkerAlt,
    FaPlus,
    FaSearch,
    FaStethoscope,
} from "react-icons/fa";
import { notify } from "@/lib/toast";

const S = {
    label: {
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: ".07em",
        color: "var(--on-surf-v)",
        display: "block",
        marginBottom: 6
    },
    select: {
        width: "100%",
        padding: "10px 12px",
        borderRadius: 11,
        border: "1.5px solid var(--outline-v)",
        background: "#fff",
        color: "var(--on-surf)",
        fontSize: 13,
        fontFamily: "'Hanken Grotesk',system-ui,sans-serif",
        outline: "none"
    },
    input: {
        width: "100%",
        padding: "10px 12px",
        borderRadius: 11,
        border: "1.5px solid var(--outline-v)",
        background: "#fff",
        color: "var(--on-surf)",
        fontSize: 13,
        fontFamily: "'Hanken Grotesk',system-ui,sans-serif",
        outline: "none"
    },
};

function TurnoCard({turno, onAgregar, onQuitar, enCarrito}) {
    const cobertura = turno.cobertura ?? "NO_CUBIERTA";
    const es = turno.tipoServicio === "ESPECIALIDAD";
    const nombre = es ? turno.especialidad?.nombre : turno.practica?.nombre;
    const medico = turno.medico?.nombre ?? "-";
    const sede = turno.sede?.nombre ?? "-";

    const fecha = turno.fechaHoraInicio ? new Date(turno.fechaHoraInicio).toLocaleString("es-AR", {
        dateStyle: "medium",
        timeStyle: "short"
    }) : "-";
    const costo = turno.costo != null ? `$${Number(turno.costo).toLocaleString("es-AR")}` : "–";

    return (
        <div className="wellness-card turno-card" style={{
            borderRadius: 16,
            padding: "17px 20px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            transition: "all .2s"
        }}>
            <div style={{
                width: 50,
                height: 50,
                borderRadius: 14,
                background: es ? "var(--p-fixed)" : "#f0e8ea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 24
            }}>
                {/*{es ? "🩺" : "🔬"}*/}
                {es ? <FaStethoscope size={22} color="var(--p)"/> : <FaFlask size={22} color="var(--p)"/>}
            </div>
            <div style={{flex: 1, minWidth: 0}}>
        <span style={{
            display: "inline-block",
            padding: "2px 9px",
            borderRadius: 999,
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            marginBottom: 4,
            background: es ? "var(--p-fixed)" : "#f0eded",
            color: es ? "var(--p)" : "var(--on-surf-v)"
        }}>
          {es ? "Especialidad" : "Práctica"}
        </span>
                <div style={{fontSize: 15, fontWeight: 700, color: "var(--p)", marginBottom: 2}}>{nombre ?? "–"}</div>
                <div style={{fontSize: 12, color: "var(--secondary)", marginBottom: 8}}>{medico} · {sede}</div>
                <div
                    style={{
                        fontSize: 11,
                        color: "var(--secondary)",
                        marginBottom: 8,
                    }}
                >
                    Cobertura: {cobertura}
                </div>
                <div style={{display: "flex", gap: 14, flexWrap: "wrap"}}>
                    {[
                        [FaCalendarAlt, fecha],
                        [FaMapMarkerAlt, sede],
                        [
                            FaClock,
                            `${
                                es
                                    ? turno.especialidad?.duracionTurnoEnMins
                                    : turno.practica?.duracionTurnoEnMins
                            } min`,
                        ],
                    ].map(([Icon, val]) => (
                        <span
                            key={String(val)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                fontSize: 12,
                                color: "var(--on-surf-v)",
                            }}
                        >
                            <Icon size={12}/>
                            {val}
                        </span>
                    ))}
                </div>
            </div>
            <div className="turno-price" style={{flexShrink: 0, textAlign: "right", minWidth: 80}}>
                <div style={{fontSize: 10, color: "var(--secondary)", marginBottom: 2}}>Costo estimado</div>
                <div style={{
                    fontFamily: "'Literata', serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "var(--p)"
                }}>{costo}</div>
            </div>
            <button
                className="turno-action"
                onClick={() => enCarrito ? onQuitar(turno) : onAgregar(turno)}
                style={{
                    flexShrink: 0,
                    padding: "10px 18px",
                    background: enCarrito ? "transparent" : "var(--p)",
                    color: enCarrito ? "var(--p)" : "#fff",
                    fontWeight: 700,
                    borderRadius: 12,
                    fontSize: 13,
                    border: enCarrito ? "2px solid var(--p)" : "2px solid var(--p)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "inherit",
                    whiteSpace: "nowrap",
                    transition: "all .15s"
                }}
            >
                {/*{enCarrito ? "✓ Agregado" : "+ Agregar"}*/}
                <>
                    {enCarrito ? (
                        <>
                            <FaCheck size={12}/>
                            Quitar
                        </>
                    ) : (
                        <>
                            <FaPlus size={12}/>
                            Agregar
                        </>
                    )}
                </>
            </button>
        </div>
    );
}

export default function TurnosPage() {
    const {agregar, quitar, estaEnCarrito} = useCarrito();

    const {
        usuario,
        cargando: authCargando,
    } = useAuth();

    const esPaciente =
        usuario?.rol === RolUsuario.PACIENTE;

    const esMedico =
        usuario?.rol === RolUsuario.MEDICO;

    const [filtros, setFiltros] = useState({
        tipoServicio: "",
        especialidadId: "",
        practicaId: "",
        sedeId: "",
        fechaDesde: "",
        sortOrder: "asc"
    });
    const [page, setPage] = useState(1);
    const LIMIT = 10;

    const [turnos, setTurnos] = useState([]);
    const [total, setTotal] = useState(0);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");
    const [buscado, setBuscado] = useState(false);
    const hayFiltroSeleccionado =
        Boolean(filtros.tipoServicio) ||
        Boolean(filtros.especialidadId) ||
        Boolean(filtros.practicaId) ||
        Boolean(filtros.sedeId) ||
        Boolean(filtros.fechaDesde);
    const busquedaDeshabilitada = cargando || authCargando || !esPaciente;

    const [especialidades, setEspecialidades] = useState([]);
    const [practicas, setPracticas] = useState([]);
    const [sedes, setSedes] = useState([]);

    useEffect(() => {
        Promise.all([getEspecialidades(), getPracticas(), getSedes()])
            .then(([e, p, s]) => {
                setEspecialidades(e);
                setPracticas(p);
                setSedes(s);
            })
            .catch(() => {
            });
    }, []);

    const buscar = useCallback(async (p = 1) => {
        if (authCargando) {
            return;
        }

        if (!usuario) {
            setError(
                "Iniciá sesión como paciente para buscar turnos."
            );
            return;
        }

        if (!esPaciente) {
            setError(
                "Solo los pacientes pueden buscar turnos."
            );
            return;
        }

        if (!hayFiltroSeleccionado) {
            setBuscado(false);
            setTurnos([]);
            setTotal(0);
            setError("Seleccioná al menos un filtro para buscar turnos disponibles.");
            return;
        }

        setCargando(true);
        setError("");
        setBuscado(true);

        const params = {
            ...filtros,
            page: p,
            limit: LIMIT,
        };

        if (filtros.tipoServicio === "ESPECIALIDAD") {
            delete params.practicaId;
        }

        if (filtros.tipoServicio === "PRACTICA") {
            delete params.especialidadId;
        }

        try {
            const res =
                await buscarTurnosDisponibles(params);

            setTurnos(res.turnos ?? []);
            setTotal(res.total ?? 0);
            setPage(p);
        } catch (e) {
            setError(
                getApiErrorMessage(
                    e,
                    "Error al buscar turnos."
                )
            );
        } finally {
            setCargando(false);
        }
    }, [
        filtros,
        usuario,
        esPaciente,
        authCargando,
        hayFiltroSeleccionado,
    ]);

    const totalPages = Math.ceil(total / LIMIT);

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

    // Toasts
    const handleAgregarTurno = (turno) => {
        agregar(turno);
        notify.success("Turno agregado a seleccionados.");
    };

    const handleQuitarTurno = (turno) => {
        quitar(turno._id);
        notify.info("Turno quitado de seleccionados.");
    };

    return (
        <div>
            {/* Header buscador */}
            <div style={{position: "relative", overflow: "hidden"}}>
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg,#fdf5f6 0%,#f9eef0 40%,#f5e4e8 70%,#fdf5f6 100%)"
                }}/>
                <div style={{
                    position: "absolute",
                    width: 400,
                    height: 400,
                    borderRadius: "50%",
                    background: "radial-gradient(circle,rgba(107,29,42,.09) 0%,transparent 70%)",
                    top: -100,
                    right: -60,
                    pointerEvents: "none"
                }}/>
                <div
                    style={{
                        position: "relative",
                        zIndex: 1,
                        maxWidth: "var(--page-max)",
                        margin: "0 auto",
                        padding: "clamp(20px,4vw,36px) var(--page-px) 0"
                    }}>
                    <h1 style={{
                        fontFamily: "'Literata', serif",
                        fontSize: "clamp(22px,4vw,30px)",
                        fontWeight: 700,
                        color: "var(--p)",
                        marginBottom: 5
                    }}>Buscar turnos disponibles</h1>
                    <p style={{fontSize: 13, color: "var(--secondary)", marginBottom: 22}}>Encontrá el especialista que
                        necesitás y reservá en minutos.</p>

                    {/* Filter card */}
                    {/*<div className="glass" style={{borderRadius: "20px 20px 0 0", padding: "20px 24px"}}>*/}
                    <div className="glass"
                         style={{borderRadius: 20, padding: "20px 24px", marginBottom: 28}}>
                        <div className="turnos-filtros-grid" style={{
                            display: "grid",
                            // gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr)) auto",
                            gridTemplateColumns: "repeat(4, minmax(0, 1fr)) auto",
                            gap: 14,
                            alignItems: "end"
                        }}>
                            <div>
                                <span style={S.label}>Tipo de servicio</span>
                                <select style={S.select} value={filtros.tipoServicio} onChange={e => setFiltros(f => ({
                                    ...f,
                                    tipoServicio: e.target.value,
                                    especialidadId: "",
                                    practicaId: ""
                                }))}>
                                    <option value="">Todos</option>
                                    <option value="ESPECIALIDAD">Especialidad</option>
                                    <option value="PRACTICA">Práctica</option>
                                </select>
                            </div>
                            <div>
                                <span
                                    style={S.label}>{filtros.tipoServicio === "PRACTICA" ? "Práctica" : "Especialidad"}</span>
                                {filtros.tipoServicio === "PRACTICA" ? (
                                    <select style={S.select} value={filtros.practicaId}
                                            onChange={e => setFiltros(f => ({...f, practicaId: e.target.value}))}>
                                        <option value="">Todas</option>
                                        {practicas.map(p => <option key={p._id} value={p._id}>{p.nombre}</option>)}
                                    </select>
                                ) : (
                                    <select style={S.select} value={filtros.especialidadId}
                                            onChange={e => setFiltros(f => ({...f, especialidadId: e.target.value}))}>
                                        <option value="">Todas</option>
                                        {especialidades.map(e => <option key={e._id} value={e._id}>{e.nombre}</option>)}
                                    </select>
                                )}
                            </div>
                            <div>
                                <span style={S.label}>Sede</span>
                                <select style={S.select} value={filtros.sedeId}
                                        onChange={e => setFiltros(f => ({...f, sedeId: e.target.value}))}>
                                    <option value="">Todas las sedes</option>
                                    {sedes.map(s => <option key={s._id} value={s._id}>{s.nombre}</option>)}
                                </select>
                            </div>
                            <div>
                                <span style={S.label}>Fecha desde</span>
                                <input type="date" style={S.input} value={filtros.fechaDesde}
                                       onChange={e => setFiltros(f => ({...f, fechaDesde: e.target.value}))}/>
                            </div>
                            <div>
                                <button onClick={() => buscar(1)} disabled={busquedaDeshabilitada} style={{
                                    padding: "11px 22px",
                                    background: "var(--p)",
                                    color: "#fff",
                                    fontWeight: 700,
                                    borderRadius: 11,
                                    fontSize: 13,
                                    border: "none",
                                    cursor: busquedaDeshabilitada ? "not-allowed" : "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 7,
                                    fontFamily: "inherit",
                                    whiteSpace: "nowrap",
                                    opacity: busquedaDeshabilitada ? .7 : 1
                                }}>
                                    {/*{cargando ? <Spinner size={14}/> : "🔍"} Buscar*/}
                                    <>
                                        {cargando ? <Spinner size={14}/> : <FaSearch size={13}/>}
                                        Buscar
                                    </>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results */}
            {/*<div style={{maxWidth: "var(--page-max)", margin: "0 auto", padding: "16px var(--page-px) 48px"}}>*/}
            <div style={{maxWidth: "var(--page-max)", margin: "0 auto", padding: "28px var(--page-px) 48px"}}>
                {!authCargando && !usuario && (
                    <Alert
                        type="info"
                        style={{marginBottom: 16}}
                    >
                        Para consultar turnos según tu cobertura,{" "}
                        <Link
                            href="/login"
                            style={{
                                color: "inherit",
                                fontWeight: 700,
                            }}
                        >
                            iniciá sesión como paciente
                        </Link>.
                    </Alert>
                )}

                {!authCargando && esMedico && (
                    <Alert
                        type="info"
                        style={{marginBottom: 16}}
                    >
                        La búsqueda y reserva de turnos está disponible
                        solamente para pacientes.
                    </Alert>
                )}


                {error && <Alert type="error" style={{marginBottom: 16}}>{error}</Alert>}

                {buscado && !cargando && (
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16
                    }}>
                        <p style={{fontSize: 13, color: "var(--on-surf-v)"}}>
                            <strong
                                style={{color: "var(--on-surf)"}}>{total} turno{total !== 1 ? "s" : ""}</strong> disponible{total !== 1 ? "s" : ""}
                        </p>
                        <select style={{...S.select, width: "auto"}} value={filtros.sortOrder}
                                onChange={e => setFiltros(f => ({...f, sortOrder: e.target.value}))}>
                            <option value="asc">Fecha más cercana</option>
                            <option value="desc">Fecha más lejana</option>
                        </select>
                    </div>
                )}

                {cargando && (
                    <div style={{display: "flex", justifyContent: "center", padding: "48px 0"}}><Spinner size={32}/>
                    </div>
                )}

                {!cargando && buscado && turnos.length === 0 && !error && (
                    <div style={{textAlign: "center", padding: "56px 20px"}}>
                        {/*<div style={{fontSize: 48, marginBottom: 14}}>📅</div>*/}
                        <div
                            style={{
                                width: 64,
                                height: 64,
                                margin: "0 auto 14px",
                                borderRadius: 18,
                                background: "var(--p-fixed)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "var(--p)",
                            }}
                        >
                            <FaCalendarAlt size={28}/>
                        </div>
                        <div style={{
                            fontFamily: "'Literata', serif",
                            fontSize: "clamp(17px,3vw,20px)",
                            color: "var(--p)",
                            marginBottom: 8
                        }}>No encontramos turnos disponibles
                        </div>
                        <div style={{fontSize: 13, color: "var(--secondary)"}}>Probá con otros filtros o fechas.</div>
                    </div>
                )}

                {!cargando && !buscado && (
                    <div style={{textAlign: "center", padding: "56px 20px"}}>
                        {/*<div style={{fontSize: 48, marginBottom: 14}}>🔍</div>*/}
                        <div
                            style={{
                                width: 64,
                                height: 64,
                                margin: "0 auto 14px",
                                borderRadius: 18,
                                background: "var(--p-fixed)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "var(--p)",
                            }}
                        >
                            <FaSearch size={26}/>
                        </div>
                        <div style={{
                            fontFamily: "'Literata', serif",
                            fontSize: "clamp(17px,3vw,20px)",
                            color: "var(--p)",
                            marginBottom: 8
                        }}>Seleccioná al menos un filtro para buscar turnos
                        </div>
                        <div style={{fontSize: 13, color: "var(--secondary)"}}>Podés filtrar por especialidad, sede y
                            fecha.
                        </div>
                    </div>
                )}

                <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                    {turnos.map(t => (
                        <TurnoCard
                            key={t._id}
                            turno={t}
                            onAgregar={handleAgregarTurno}
                            onQuitar={handleQuitarTurno}
                            enCarrito={estaEnCarrito(t._id)}
                        />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div style={{
                        display: "flex",
                        gap: 8,
                        justifyContent: "center",
                        marginTop: 24,
                        alignItems: "center",
                        flexWrap: "wrap"
                    }}>
                        <button
                            onClick={() => buscar(page - 1)}
                            onMouseEnter={(e) => {
                                if (page !== 1) {
                                    e.currentTarget.style.background = "var(--p-fixed)";
                                    e.currentTarget.style.borderColor = "var(--p)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (page !== 1) {
                                    e.currentTarget.style.background = "#fff";
                                    e.currentTarget.style.borderColor = "var(--outline-v)";
                                }
                            }}
                            disabled={page === 1}
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
                            <FaChevronLeft size={12} />
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
                                        onClick={() => buscar(n)}
                                        onMouseEnter={(e) => {
                                            if (n !== page) {
                                                e.currentTarget.style.background = "var(--p-fixed)";
                                                e.currentTarget.style.borderColor = "var(--p)";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (n !== page) {
                                                e.currentTarget.style.background = "#fff";
                                                e.currentTarget.style.borderColor = "var(--outline-v)";
                                            }
                                        }}
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
                            onClick={() => buscar(page + 1)}
                            onMouseEnter={(e) => {
                                if (page !== totalPages) {
                                    e.currentTarget.style.background = "var(--p-fixed)";
                                    e.currentTarget.style.borderColor = "var(--p)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (page !== totalPages) {
                                    e.currentTarget.style.background = "#fff";
                                    e.currentTarget.style.borderColor = "var(--outline-v)";
                                }
                            }}
                            disabled={page === totalPages}
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
                            <FaChevronRight size={12} />
                        </button>
                    </div>
                )}
            </div>

            <style>{`
              @media (max-width: 900px) {
                .turnos-filtros-grid {
                  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                }
            
                .turnos-filtros-grid > div:last-child {
                  grid-column: 1 / -1;
                }
            
                .turnos-filtros-grid button {
                  width: 100%;
                  justify-content: center;
                }
              }
            
              @media (max-width: 700px) {
                .turnos-filtros-grid {
                  grid-template-columns: 1fr !important;
                }
            
                .turnos-filtros-card {
                  padding: 18px !important;
                }
              }
            
              @media (max-width: 520px) {
                h1 {
                  font-size: 26px !important;
                  line-height: 1.15 !important;
                }
              }

              @media (max-width: 600px) {
                .turno-card {
                  flex-wrap: wrap !important;
                  gap: 12px !important;
                }
                .turno-price {
                  text-align: left !important;
                  min-width: 0 !important;
                }
                .turno-action {
                  width: 100% !important;
                  justify-content: center !important;
                }
              }
            `}</style>

        </div>
    );
}
