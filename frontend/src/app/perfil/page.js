"use client";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/AuthContext";
import {buscarTurnosDisponibles, cancelarTurno, obtenerHistorialPaciente, reservarTurno,} from "@/lib/turnosApi";
import {getApiErrorMessage} from "@/lib/api";
import {RolUsuario} from "@/lib/roles";
import Spinner from "@/components/ui/Spinner";
import Alert from "@/components/ui/Alert";
import {obtenerPerfilCompleto} from "../../lib/turnosApi";
import ConfirmLogoutModal from "@/components/common/ConfirmLogout";

const MENU = [
    {id: "turnos", label: "Mis turnos", icon: "📅"},
    {id: "datos", label: "Mis datos", icon: "👤"},
    {id: "cobertura", label: "Cobertura", icon: "🛡"},
    {id: "notificaciones", label: "Notificaciones", icon: "🔔"},
];

const STATUS_STYLE = {
    Reservado: {bg: "var(--p-fixed)", color: "var(--p)"},
    Realizado: {bg: "#e6f4eb", color: "#166534"},
    Cancelado: {bg: "#fce8e8", color: "#991b1b"},
    Disponible: {bg: "#f0eded", color: "var(--on-surf-v)"},
    Confirmado: {bg: "#e6f0fb", color: "#1a4f91"},
};

const fmtFecha = (d) =>
    d ? new Date(d).toLocaleString("es-AR", {dateStyle: "long", timeStyle: "short"}) : "–";
const fmtCorta = (d) =>
    d ? new Date(d).toLocaleString("es-AR", {dateStyle: "medium", timeStyle: "short"}) : "–";

function TurnoDetalle({turno, onClose, onSolicitarCambio}) {
    const es = turno.tipoServicio === "ESPECIALIDAD";
    const nombre = es ? turno.especialidad?.nombre : turno.practica?.nombre;
    const ss = STATUS_STYLE[turno.estado] ?? STATUS_STYLE.Disponible;

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-box">
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18}}>
                    <h2 style={{
                        fontFamily: "'Literata',serif",
                        fontSize: "clamp(18px,3vw,22px)",
                        fontWeight: 700,
                        color: "var(--p)",
                        margin: 0
                    }}>
                        Detalle del turno
                    </h2>
                    <button onClick={onClose} style={{
                        background: "transparent",
                        border: "none",
                        fontSize: 20,
                        cursor: "pointer",
                        color: "var(--secondary)"
                    }}>✕
                    </button>
                </div>

                <span style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    background: ss.bg,
                    color: ss.color,
                    marginBottom: 16
                }}>
          {turno.estado}
        </span>

                <div style={{background: "var(--p-fixed)", borderRadius: 14, padding: "12px 16px", marginBottom: 14}}>
                    <div style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: ".07em",
                        color: "var(--on-surf-v)",
                        marginBottom: 4
                    }}>
                        {es ? "Especialidad" : "Práctica"}
                    </div>
                    <div style={{fontSize: 17, fontWeight: 700, color: "var(--p)"}}>{nombre ?? "–"}</div>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
                    gap: 10,
                    marginBottom: 18
                }}>
                    {[
                        ["🩺 Médico", turno.medico?.nombre ?? "–"],
                        ["📍 Sede", turno.sede?.nombre ?? "–"],
                        ["📅 Fecha", fmtFecha(turno.fechaHoraInicio)],
                        ["⏱ Duración", turno.duracionEnMins ? `${turno.duracionEnMins} min` : "–"],
                        ["💰 Costo", turno.costo ? `$${Number(turno.costo).toLocaleString("es-AR")}` : "–"],
                    ].map(([label, val]) => (
                        <div key={label} style={{
                            background: "#fdfaf8",
                            borderRadius: 10,
                            padding: "10px 12px",
                            border: "1px solid var(--outline-v)"
                        }}>
                            <div style={{
                                fontSize: 10,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: ".06em",
                                color: "var(--on-surf-v)",
                                marginBottom: 3
                            }}>{label}</div>
                            <div style={{fontSize: 13, fontWeight: 600, color: "var(--on-surf)"}}>{val}</div>
                        </div>
                    ))}
                </div>

                {turno.estado === "Reservado" && (
                    <button
                        onClick={() => onSolicitarCambio(turno)}
                        style={{
                            width: "100%",
                            padding: "12px 0",
                            background: "var(--p)",
                            color: "#fff",
                            fontWeight: 700,
                            borderRadius: 12,
                            fontSize: 14,
                            border: "none",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            marginBottom: 10
                        }}>
                        🔄 Solicitar cambio de fecha
                    </button>
                )}
                <button onClick={onClose}
                        style={{
                            width: "100%",
                            padding: "10px 0",
                            background: "transparent",
                            border: "2px solid var(--outline-v)",
                            color: "var(--on-surf-v)",
                            fontWeight: 600,
                            borderRadius: 12,
                            fontSize: 13,
                            cursor: "pointer",
                            fontFamily: "inherit"
                        }}>
                    Cerrar
                </button>
            </div>
        </div>
    );
}

function CambioFechaModal({turno, onClose, onConfirm}) {
    const es = turno.tipoServicio === "ESPECIALIDAD";
    const nombre = es ? turno.especialidad?.nombre : turno.practica?.nombre;

    const [nuevaFecha, setNuevaFecha] = useState("");
    const [turnosDisp, setTurnosDisp] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [buscado, setBuscado] = useState(false);
    const [turnoElegido, setTurnoElegido] = useState(null);
    const [error, setError] = useState("");
    const [confirmando, setConfirmando] = useState(false);

    const buscar = async () => {
        if (!nuevaFecha) return;
        setCargando(true);
        setError("");
        setBuscado(false);
        setTurnoElegido(null);
        try {
            const p = {
                tipoServicio: turno.tipoServicio,
                sedeId: turno.sede?._id ?? turno.sede,
                fechaDesde: nuevaFecha,
                limit: 20,
            };
            if (es && turno.especialidad?._id) p.especialidadId = turno.especialidad._id;
            if (!es && turno.practica?._id) p.practicaId = turno.practica._id;
            const res = await buscarTurnosDisponibles(p);
            setTurnosDisp(res.turnos ?? []);
            setBuscado(true);
        } catch (e) {
            setError(getApiErrorMessage(e, "No se pudieron cargar los turnos."));
        } finally {
            setCargando(false);
        }
    };

    const handleConfirmar = async () => {
        if (!turnoElegido) return;
        setConfirmando(true);
        try {
            await onConfirm(turno._id, turnoElegido._id);
            onClose();
        } catch (e) {
            setError(getApiErrorMessage(e, "No se pudo realizar el cambio."));
            setConfirmando(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-box">
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16}}>
                    <h2 style={{
                        fontFamily: "'Literata',serif",
                        fontSize: "clamp(17px,3vw,20px)",
                        fontWeight: 700,
                        color: "var(--p)",
                        margin: 0
                    }}>
                        🔄 Cambio de fecha
                    </h2>
                    <button onClick={onClose} style={{
                        background: "transparent",
                        border: "none",
                        fontSize: 20,
                        cursor: "pointer",
                        color: "var(--secondary)"
                    }}>✕
                    </button>
                </div>

                <div style={{
                    background: "var(--p-fixed)",
                    borderRadius: 12,
                    padding: "10px 14px",
                    marginBottom: 14,
                    fontSize: 13,
                    color: "var(--on-surf)"
                }}>
                    <strong>{nombre}</strong> · {fmtCorta(turno.fechaHoraInicio)}
                </div>

                {error && <Alert type="error" style={{marginBottom: 12}}>{error}</Alert>}

                <div style={{marginBottom: 14}}>
                    <label style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: ".06em",
                        color: "var(--on-surf-v)",
                        marginBottom: 6
                    }}>
                        Nueva fecha desde
                    </label>
                    <div style={{display: "flex", gap: 10}}>
                        <input
                            type="date"
                            value={nuevaFecha}
                            onChange={e => setNuevaFecha(e.target.value)}
                            min={new Date().toISOString().slice(0, 10)}
                            style={{
                                flex: 1,
                                padding: "10px 12px",
                                borderRadius: 11,
                                border: "1.5px solid var(--outline-v)",
                                fontSize: 13,
                                background: "#fff",
                                color: "var(--on-surf)",
                                fontFamily: "inherit"
                            }}
                        />
                        <button onClick={buscar} disabled={!nuevaFecha || cargando}
                                style={{
                                    padding: "10px 16px",
                                    background: "var(--p)",
                                    color: "#fff",
                                    fontWeight: 700,
                                    borderRadius: 11,
                                    fontSize: 13,
                                    border: "none",
                                    cursor: !nuevaFecha || cargando ? "not-allowed" : "pointer",
                                    fontFamily: "inherit",
                                    opacity: !nuevaFecha || cargando ? 0.7 : 1,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6
                                }}>
                            {cargando ? <Spinner size={14}/> : "Buscar"}
                        </button>
                    </div>
                </div>

                {buscado && !cargando && turnosDisp.length === 0 && (
                    <div style={{
                        textAlign: "center",
                        padding: "20px 12px",
                        color: "var(--secondary)",
                        fontSize: 13,
                        border: "1px dashed var(--outline-v)",
                        borderRadius: 12,
                        marginBottom: 14
                    }}>
                        No hay turnos disponibles en esa fecha para la misma sede y servicio.
                    </div>
                )}

                {turnosDisp.length > 0 && (
                    <div style={{
                        maxHeight: 210,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        marginBottom: 14
                    }}>
                        {turnosDisp.map(t => (
                            <div key={t._id} onClick={() => setTurnoElegido(t)}
                                 style={{
                                     padding: "10px 14px",
                                     borderRadius: 11,
                                     border: `2px solid ${turnoElegido?._id === t._id ? "var(--p)" : "var(--outline-v)"}`,
                                     background: turnoElegido?._id === t._id ? "var(--p-fixed)" : "#fff",
                                     cursor: "pointer",
                                     fontSize: 13,
                                     display: "flex",
                                     justifyContent: "space-between",
                                     alignItems: "center",
                                     transition: "all .15s"
                                 }}>
                                <div>
                                    <div
                                        style={{fontWeight: 700, color: "var(--p)"}}>{fmtFecha(t.fechaHoraInicio)}</div>
                                    <div style={{fontSize: 11, color: "var(--secondary)", marginTop: 2}}>
                                        {t.sede?.nombre ?? "–"} · {t.duracionEnMins ?? "?"} min
                                    </div>
                                </div>
                                {turnoElegido?._id === t._id && (
                                    <span style={{color: "var(--p)", fontWeight: 700, fontSize: 16}}>✓</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {turnoElegido && (
                    <div style={{
                        background: "#e6f4eb",
                        borderRadius: 10,
                        padding: "10px 14px",
                        marginBottom: 12,
                        fontSize: 12,
                        color: "#166534"
                    }}>
                        ✅ Nuevo turno seleccionado: <strong>{fmtFecha(turnoElegido.fechaHoraInicio)}</strong>
                    </div>
                )}

                <button onClick={handleConfirmar} disabled={!turnoElegido || confirmando}
                        style={{
                            width: "100%",
                            padding: "12px 0",
                            background: "var(--p)",
                            color: "#fff",
                            fontWeight: 700,
                            borderRadius: 12,
                            fontSize: 14,
                            border: "none",
                            cursor: !turnoElegido || confirmando ? "not-allowed" : "pointer",
                            fontFamily: "inherit",
                            opacity: !turnoElegido || confirmando ? 0.7 : 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            marginBottom: 8
                        }}>
                    {confirmando ? <Spinner size={14}/> : "🔄"} {confirmando ? "Procesando..." : "Confirmar cambio"}
                </button>
                <button onClick={onClose}
                        style={{
                            width: "100%",
                            padding: "10px 0",
                            background: "transparent",
                            border: "2px solid var(--outline-v)",
                            color: "var(--on-surf-v)",
                            fontWeight: 600,
                            borderRadius: 12,
                            fontSize: 13,
                            cursor: "pointer",
                            fontFamily: "inherit"
                        }}>
                    Cancelar
                </button>
            </div>
        </div>
    );
}

export default function PerfilPage() {
    const {usuario, cargando: authCargando, logout} = useAuth();
    const router = useRouter();

    const [tab, setTab] = useState("turnos");
    const [historial, setHistorial] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const [turnoDetalle, setTurnoDetalle] = useState(null);
    const [turnoCambio, setTurnoCambio] = useState(null);
    const [exitoCambio, setExitoCambio] = useState(false);

    const esPaciente = usuario?.rol === RolUsuario.PACIENTE;

    const [perfil, setPerfil] = useState(null);
    const [cargandoPerfil, setCargandoPerfil] = useState(false);
    const [errorPerfil, setErrorPerfil] = useState("");

    // Logout
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const [confirmLogout, setConfirmLogout] = useState(false);

    useEffect(() => {
        function handleClick(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);


    useEffect(() => {
        if (!authCargando && !usuario) router.push("/login");
    }, [usuario, authCargando, router]);

    // Para mostrar datos personales del usuario en Perfil
    useEffect(() => {
        if (!esPaciente || tab !== "turnos") return;
        let activo = true;

        const cargarHistorial = async () => {
            setCargando(true);
            setError("");

            try {
                const data = await obtenerHistorialPaciente();
                if (activo) {
                    setHistorial(Array.isArray(data) ? data : []);
                }
            } catch (e) {
                if (activo) {
                    setError(getApiErrorMessage(e, "Error al cargar historial."));
                }
            } finally {
                if (activo) {
                    setCargando(false);
                }
            }
        };

        cargarHistorial();

        return () => {
            activo = false;
        };
    }, [esPaciente, tab]);

    useEffect(() => {
        if (tab !== "datos") return;
        let activo = true;
        (async () => {
            setCargandoPerfil(true);
            setErrorPerfil("");
            try {
                const data = await obtenerPerfilCompleto();
                if (activo) setPerfil(data);
            } catch (e) {
                if (activo) setErrorPerfil(getApiErrorMessage(e, "Error al cargar perfil."));
            } finally {
                if (activo) setCargandoPerfil(false);
            }
        })();
        return () => {
            activo = false;
        };
    }, [tab]);

    const handleConfirmarCambio = async (viejoId, nuevoId) => {
        await cancelarTurno(viejoId, "Cambio de fecha solicitado por el paciente");
        await reservarTurno(nuevoId);
        const data = await obtenerHistorialPaciente();
        setHistorial(Array.isArray(data) ? data : []);
        setExitoCambio(true);
        setTimeout(() => setExitoCambio(false), 4000);
    };

    if (authCargando) return (
        <div style={{display: "flex", justifyContent: "center", padding: 80}}>
            <Spinner size={36}/>
        </div>
    );
    if (!usuario) return null;

    const menuItems = esPaciente ? MENU : MENU.filter(m => m.id === "datos");

    return (
        <>
            <div style={{
                maxWidth: "var(--page-max)",
                margin: "0 auto",
                padding: "clamp(20px,3vw,36px) var(--page-px) 56px"
            }}>

                {exitoCambio && (
                    <Alert type="success" style={{marginBottom: 16}}>
                        ✅ Cambio de turno realizado correctamente.
                    </Alert>
                )}

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "clamp(190px,22%,250px) 1fr",
                    gap: 22,
                    alignItems: "start"
                }} className="perfil-grid">

                    {/* Sidebar */}
                    <div className="wellness-card" style={{borderRadius: 20, padding: 22}}>
                        <div style={{
                            width: 60,
                            height: 60,
                            borderRadius: 16,
                            background: "var(--p-fixed)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 28,
                            marginBottom: 12
                        }}>👤
                        </div>
                        <div style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: "var(--p)"
                        }}>{usuario.nombreUsuario ?? "Mi cuenta"}</div>
                        <div style={{fontSize: 12, color: "var(--secondary)", marginTop: 2, marginBottom: 20}}>
                            {esPaciente ? "Paciente" : "Médico"}
                        </div>
                        {menuItems.map(m => (
                            <div key={m.id} onClick={() => setTab(m.id)}
                                 style={{
                                     display: "flex",
                                     alignItems: "center",
                                     gap: 9,
                                     padding: "10px 12px",
                                     borderRadius: 11,
                                     fontSize: 13,
                                     fontWeight: tab === m.id ? 700 : 500,
                                     color: tab === m.id ? "var(--p)" : "var(--on-surf-v)",
                                     background: tab === m.id ? "var(--p-fixed)" : "transparent",
                                     cursor: "pointer",
                                     marginBottom: 3,
                                     transition: "all .15s"
                                 }}>
                                <span>{m.icon}</span> {m.label}
                            </div>
                        ))}
                        <div>
                            <button
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 9,
                                    padding: "10px 12px",
                                    borderRadius: 11,
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "#991b1b",
                                    cursor: "pointer",
                                    marginTop: 16
                                }}
                                onClick={() => {
                                    setOpen(false);
                                    setConfirmLogout(true);
                                }}
                            >
                                🚪 Cerrar sesión
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        {tab === "turnos" && (
                            <>
                                <h2 style={{
                                    fontFamily: "'Literata',serif",
                                    fontSize: "clamp(18px,3vw,22px)",
                                    fontWeight: 700,
                                    color: "var(--p)",
                                    marginBottom: 18
                                }}>
                                    Historial de turnos
                                </h2>
                                {error && <Alert type="error" style={{marginBottom: 16}}>{error}</Alert>}
                                {cargando && (
                                    <div style={{display: "flex", justifyContent: "center", padding: 48}}>
                                        <Spinner size={28}/>
                                    </div>
                                )}
                                {!cargando && historial.length === 0 && !error && (
                                    <div style={{textAlign: "center", padding: "48px 20px"}}>
                                        <div style={{fontSize: 48, marginBottom: 14}}>📅</div>
                                        <div style={{
                                            fontFamily: "'Literata',serif",
                                            fontSize: 18,
                                            color: "var(--p)",
                                            marginBottom: 6
                                        }}>Sin historial todavía
                                        </div>
                                        <div style={{fontSize: 13, color: "var(--secondary)"}}>Tus turnos aparecerán acá
                                            una vez que reserves.
                                        </div>
                                    </div>
                                )}

                                {historial.map(t => {
                                    const es = t.tipoServicio === "ESPECIALIDAD";
                                    const nombre = es ? t.especialidad?.nombre : t.practica?.nombre;
                                    const ss = STATUS_STYLE[t.estado] ?? STATUS_STYLE.Disponible;
                                    const clickeable = ["Reservado", "Confirmado"].includes(t.estado);

                                    return (
                                        <div key={t._id} className="wellness-card"
                                             onClick={() => clickeable && setTurnoDetalle(t)}
                                             style={{
                                                 borderRadius: 14,
                                                 padding: "14px 18px",
                                                 display: "flex",
                                                 alignItems: "center",
                                                 gap: 12,
                                                 marginBottom: 10,
                                                 cursor: clickeable ? "pointer" : "default",
                                                 flexWrap: "wrap"
                                             }}>
                                            <div style={{
                                                width: 38,
                                                height: 38,
                                                borderRadius: 10,
                                                background: es ? "var(--p-fixed)" : "#f5e8ec",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                                fontSize: 18
                                            }}>
                                                {es ? "🩺" : "🔬"}
                                            </div>
                                            <div style={{flex: 1, minWidth: 150}}>
                                                <div style={{fontSize: 13, fontWeight: 700, color: "var(--p)"}}>
                                                    {nombre ?? "–"} · {t.medico?.nombre ?? "–"}
                                                </div>
                                                <div style={{fontSize: 11, color: "var(--secondary)", marginTop: 2}}>
                                                    {fmtCorta(t.fechaHoraInicio)} · {t.sede?.nombre ?? "–"}
                                                </div>
                                            </div>
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                                flexShrink: 0,
                                                flexWrap: "wrap"
                                            }}>
                      <span style={{
                          padding: "3px 11px",
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 700,
                          background: ss.bg,
                          color: ss.color
                      }}>
                        {t.estado}
                      </span>
                                                {clickeable && (
                                                    <span style={{fontSize: 11, color: "var(--p)", fontWeight: 600}}>Ver →</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}

                        {tab === "datos" && (
                            <div className="wellness-card" style={{borderRadius: 20, padding: 28}}>
                                <h2 style={{
                                    fontFamily: "'Literata', serif",
                                    fontSize: 22,
                                    fontWeight: 700,
                                    color: "var(--p)",
                                    marginBottom: 18
                                }}>
                                    Mis datos
                                </h2>

                                {errorPerfil && <Alert type="error" style={{marginBottom: 16}}>{errorPerfil}</Alert>}

                                {cargandoPerfil && (
                                    <div style={{display: "flex", justifyContent: "center", padding: 48}}>
                                        <Spinner size={28}/>
                                    </div>
                                )}

                                {!cargandoPerfil && perfil && (() => {
                                    const camposBase = [
                                        ["Usuario", usuario.nombreUsuario],
                                        ["Nombre completo", perfil.nombre ?? "–"],
                                        ["Tipo de cuenta", esPaciente ? "Paciente" : "Médico"],
                                    ];

                                    const camposRol = esPaciente
                                        ? [
                                            ["DNI", perfil.dni ?? "–"],
                                            ["Obra social", perfil.obraSocial ?? "–"],
                                            ["Plan", perfil.plan ?? "–"],
                                        ]
                                        : [
                                            ["Matrícula", perfil.matricula ?? "–"],
                                        ];

                                    return (
                                        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16}}>
                                            {[...camposBase, ...camposRol].map(([label, valor]) => (
                                                <div key={label}>
                                                    <div style={{
                                                        fontSize: 10,
                                                        fontWeight: 700,
                                                        textTransform: "uppercase",
                                                        letterSpacing: ".06em",
                                                        color: "var(--on-surf-v)",
                                                        marginBottom: 5,
                                                    }}>
                                                        {label}
                                                    </div>
                                                    <div style={{
                                                        fontSize: 14,
                                                        fontWeight: 600,
                                                        color: "var(--on-surf)",
                                                        padding: "10px 14px",
                                                        background: "var(--p-fixed)",
                                                        borderRadius: 11,
                                                    }}>
                                                        {valor}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {(tab === "cobertura" || tab === "notificaciones") && (
                            <div style={{textAlign: "center", padding: "56px 20px"}}>
                                <div style={{fontSize: 48, marginBottom: 14}}>🚧</div>
                                <div style={{
                                    fontFamily: "'Literata',serif",
                                    fontSize: 20,
                                    color: "var(--p)",
                                    marginBottom: 8
                                }}>Próximamente
                                </div>
                                <div style={{fontSize: 13, color: "var(--secondary)"}}>Esta sección está en
                                    desarrollo.
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {turnoDetalle && (
                    <TurnoDetalle
                        turno={turnoDetalle}
                        onClose={() => setTurnoDetalle(null)}
                        onSolicitarCambio={t => {
                            setTurnoDetalle(null);
                            setTurnoCambio(t);
                        }}
                    />
                )}
                {turnoCambio && (
                    <CambioFechaModal
                        turno={turnoCambio}
                        onClose={() => setTurnoCambio(null)}
                        onConfirm={handleConfirmarCambio}
                    />
                )}
                <style>{`
                    @media (max-width: 700px) {
                      .perfil-grid { grid-template-columns: 1fr !important; }
                    }
                `}</style>
            </div>

            <ConfirmLogoutModal
                open={confirmLogout}
                onCancel={() => setConfirmLogout(false)}
                onConfirm={() => {
                    setConfirmLogout(false);
                    onLogout();
                }}
            />
        </>
    );
}
