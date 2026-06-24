"use client";
import {useState, useEffect, useCallback} from "react";
import {buscarTurnosDisponibles} from "@/lib/turnosApi";
import {getServicios, getSedes} from "@/lib/serviciosApi";
import {getApiErrorMessage} from "@/lib/api";
import {useCarrito} from "@/context/CarritoContext";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import Link from "next/link";
import {useAuth} from "@/context/AuthContext";
import {RolUsuario} from "@/lib/roles";

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

function TurnoCard({turno, onAgregar, enCarrito}) {
    const cobertura = turno.cobertura ?? "NO_CUBIERTA";
    const es = turno.servicio?.tipoServicio === "ESPECIALIDAD";
    const nombre = turno.servicio?.nombre;
    const medico = turno.medico?.nombre ?? "-";
    const sede = turno.sede?.nombre ?? "-";
    console.log(turno);

    const fecha = turno.fechaHoraInicio ? new Date(turno.fechaHoraInicio).toLocaleString("es-AR", {
        dateStyle: "medium",
        timeStyle: "short"
    }) : "-";
    const costo = turno.costo != null ? `$${Number(turno.costo).toLocaleString("es-AR")}` : "–";

    return (
        <div className="wellness-card" style={{
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
                {es ? "🩺" : "🔬"}
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
                    {[["📅", fecha], ["📍", sede], ["⏱", `${turno.duracionEnMins ?? "?"} min`]].map(([icon, val]) => (
                        <span key={val} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 12,
                            color: "var(--on-surf-v)"
                        }}>{icon} {val}</span>
                    ))}
                </div>
            </div>
            <div style={{flexShrink: 0, textAlign: "right", minWidth: 80}}>
                <div style={{fontSize: 10, color: "var(--secondary)", marginBottom: 2}}>Costo estimado</div>
                <div style={{
                    fontFamily: "'Literata', serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "var(--p)"
                }}>{costo}</div>
            </div>
            <button
                onClick={() => enCarrito ? null : onAgregar(turno)}
                style={{
                    flexShrink: 0,
                    padding: "10px 18px",
                    background: enCarrito ? "transparent" : "var(--p)",
                    color: enCarrito ? "var(--p)" : "#fff",
                    fontWeight: 700,
                    borderRadius: 12,
                    fontSize: 13,
                    border: enCarrito ? "2px solid var(--p)" : "2px solid var(--p)",
                    cursor: enCarrito ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "inherit",
                    whiteSpace: "nowrap",
                    transition: "all .15s"
                }}
            >
                {enCarrito ? "✓ Agregado" : "+ Agregar"}
            </button>
        </div>
    );
}

export default function TurnosPage() {
    const {agregar, estaEnCarrito} = useCarrito();

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
        servicioId: "",
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
    const busquedaDeshabilitada = cargando || authCargando || !esPaciente;

    const [especialidades, setEspecialidades] = useState([]);
    const [practicas, setPracticas] = useState([]);
    const [sedes, setSedes] = useState([]);

    useEffect(() => {
        Promise.all([getServicios(), getSedes()])
            .then(([ss, s]) => {
                setEspecialidades(ss.filter(s => s.tipoServicio === "ESPECIALIDAD"));
                setPracticas(ss.filter(s => s.tipoServicio === "PRACTICA"));
                setSedes(s);
            })
            .catch(() => {
            });
    }, []);

    const serviciosDisponibles = filtros.tipoServicio === "PRACTICA" ? practicas : especialidades;

    const buscar = useCallback(async (p = 1) => {
        console.log("Entré a buscar");

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

        setCargando(true);
        setError("");
        setBuscado(true);

        const params = {
            ...filtros,
            page: p,
            limit: LIMIT,
        };

        console.log(params);

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
    ]);

    const totalPages = Math.ceil(total / LIMIT);

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
                    style={{position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "36px 40px 0"}}>
                    <h1 style={{
                        fontFamily: "'Literata', serif",
                        fontSize: 28,
                        fontWeight: 700,
                        color: "var(--p)",
                        marginBottom: 5
                    }}>Buscar turnos disponibles</h1>
                    <p style={{fontSize: 13, color: "var(--secondary)", marginBottom: 22}}>Encontrá el especialista que
                        necesitás y reservá en minutos.</p>

                    {/* Filter card */}
                    <div className="glass" style={{borderRadius: "20px 20px 0 0", padding: "20px 24px"}}>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
                            gap: 14,
                            alignItems: "end"
                        }}>
                            <div>
                                <span style={S.label}>Tipo de servicio</span>
                                <select style={S.select} value={filtros.tipoServicio} onChange={e => setFiltros(f => ({
                                    ...f,
                                    tipoServicio: e.target.value,
                                    servicioId: ""
                                }))}>
                                    <option value="">Todos</option>
                                    <option value="ESPECIALIDAD">Especialidad</option>
                                    <option value="PRACTICA">Práctica</option>
                                </select>
                            </div>
                            <div>
                                <span
                                    style={S.label}>{filtros.tipoServicio === "PRACTICA" ? "Práctica" : /*filtros.tipoServicio === "ESPECIALIDAD" ?*/ "Especialidad" /*: "Servicio"*/}</span>
                                <select
                                    style={S.select} value={filtros.servicioId}
                                        onChange={e => setFiltros(f => ({...f, servicioId: e.target.value}))}>
                                    <option value="">Todas</option>
                                    {serviciosDisponibles.map(s => <option key={s._id} value={s._id}>{s.nombre}</option>)}
                                </select>

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
                                    {cargando ? <Spinner size={14}/> : "🔍"} Buscar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div style={{maxWidth: 1200, margin: "0 auto", padding: "20px 40px 48px"}}>
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
                        <div style={{fontSize: 48, marginBottom: 14}}>📅</div>
                        <div style={{
                            fontFamily: "'Literata', serif",
                            fontSize: 20,
                            color: "var(--p)",
                            marginBottom: 8
                        }}>No encontramos turnos disponibles
                        </div>
                        <div style={{fontSize: 13, color: "var(--secondary)"}}>Probá con otros filtros o fechas.</div>
                    </div>
                )}

                {!cargando && !buscado && (
                    <div style={{textAlign: "center", padding: "56px 20px"}}>
                        <div style={{fontSize: 48, marginBottom: 14}}>🔍</div>
                        <div style={{
                            fontFamily: "'Literata', serif",
                            fontSize: 20,
                            color: "var(--p)",
                            marginBottom: 8
                        }}>Usá los filtros para buscar turnos
                        </div>
                        <div style={{fontSize: 13, color: "var(--secondary)"}}>Podés filtrar por especialidad, sede y
                            fecha.
                        </div>
                    </div>
                )}

                <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                    {turnos.map(t => (
                        <TurnoCard key={t._id} turno={t} onAgregar={agregar} enCarrito={estaEnCarrito(t._id)}/>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div style={{display: "flex", gap: 8, justifyContent: "center", marginTop: 24}}>
                        {Array.from({length: totalPages}, (_, i) => i + 1).map(n => (
                            <button key={n} onClick={() => buscar(n)} style={{
                                width: 34,
                                height: 34,
                                borderRadius: "50%",
                                border: "1.5px solid",
                                borderColor: n === page ? "var(--p)" : "var(--outline-v)",
                                background: n === page ? "var(--p)" : "#fff",
                                color: n === page ? "#fff" : "var(--on-surf-v)",
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: "pointer",
                                fontFamily: "inherit",
                                transition: "all .15s"
                            }}>
                                {n}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
