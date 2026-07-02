"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { obtenerHistorialPaciente, obtenerPerfilCompleto } from "@/lib/turnosApi";
import { getApiErrorMessage } from "@/lib/api";
import Spinner from "@/components/ui/Spinner";
import Alert from "@/components/ui/Alert";
import { RolUsuario } from "@/lib/roles";

const MENU = [
  { id: "turnos",        label: "Mis turnos",     icon: "📅" },
  { id: "datos",         label: "Mis datos",       icon: "👤" },
  { id: "cobertura",     label: "Cobertura",       icon: "🛡" },
  { id: "notificaciones",label: "Notificaciones",  icon: "🔔" },
];

const STATUS_STYLE = {
  Reservado:   { bg: "var(--p-fixed)", color: "var(--p)" },
  Realizado:   { bg: "#e6f4eb",        color: "#166534"  },
  Cancelado:   { bg: "#fce8e8",        color: "#991b1b"  },
  Disponible:  { bg: "#f0eded",        color: "var(--on-surf-v)" },
  Confirmado:  { bg: "#e6f0fb",        color: "#1a4f91"  },
};

export default function PerfilPage() {
  const { usuario, cargando: authCargando, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("turnos");
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError]     = useState("");
  const esPaciente =
      usuario?.rol === RolUsuario.PACIENTE;

  useEffect(() => {
    if (!authCargando && !usuario) router.push("/login");
  }, [usuario, authCargando, router]);

  useEffect(() => {
    if (!esPaciente || tab !== "turnos") return;

    let activo = true;

    (async () => {
      setCargando(true);
      setError("");
      try {
        const data = await obtenerHistorialPaciente();

        if (activo) {
          setHistorial(
              Array.isArray(data) ? data : []
          );
        }
      } catch (e) {
        if (activo) {
          setError(
              getApiErrorMessage(
                  e,
                  "Error al cargar historial."
              )
          );
        }
      } finally {
        if (activo) setCargando(false);
      }
    })();

    return () => {
      activo = false;
    };
  }, [esPaciente, tab]);

  const [perfil, setPerfil] = useState(null);
  const [cargandoPerfil, setCargandoPerfil] = useState(false);
  const [errorPerfil, setErrorPerfil] = useState("");

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
    return () => { activo = false; };
  }, [tab]);

  if (authCargando) return <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><Spinner size={36} /></div>;
  if (!usuario) return null;

  const fmtFecha = (d) => d ? new Date(d).toLocaleString("es-AR", { dateStyle: "medium", timeStyle: "short" }) : "–";

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 40px 56px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 }}>
        {/* Sidebar */}
        <div className="wellness-card" style={{ borderRadius: 20, padding: 22, alignSelf: "start", position: "sticky", top: 90 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--p-fixed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, marginBottom: 12 }}>👤</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--p)" }}>{usuario.nombreUsuario}</div>
          <div style={{ fontSize: 12, color: "var(--secondary)", marginTop: 2, marginBottom: 20 }}>
            {esPaciente ? "Paciente" : "Médico"}
          </div>
          {MENU.map((m) => (
            <div key={m.id} onClick={() => setTab(m.id)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 12px", borderRadius: 11, fontSize: 13, fontWeight: tab === m.id ? 700 : 500, color: tab === m.id ? "var(--p)" : "var(--on-surf-v)", background: tab === m.id ? "var(--p-fixed)" : "transparent", cursor: "pointer", marginBottom: 3, transition: "all .15s" }}>
              <span>{m.icon}</span> {m.label}
            </div>
          ))}
          <div onClick={async () => { await logout(); router.push("/"); }} style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 12px", borderRadius: 11, fontSize: 13, fontWeight: 600, color: "#991b1b", cursor: "pointer", marginTop: 16 }}>
            🚪 Cerrar sesión
          </div>
        </div>

        {/* Content */}
        <div>
          {esPaciente && tab === "turnos" && (
            <>
              <h2 style={{ fontFamily: "'Literata', serif", fontSize: 22, fontWeight: 700, color: "var(--p)", marginBottom: 18 }}>Historial de turnos</h2>
              {error && <Alert type="error" style={{ marginBottom: 16 }}>{error}</Alert>}
              {cargando && <div style={{ display: "flex", justifyContent: "center", padding: 48 }}><Spinner size={28} /></div>}
              {!cargando && historial.length === 0 && !error && (
                <div style={{ textAlign: "center", padding: "48px 20px" }}>
                  <div style={{ fontSize: 48, marginBottom: 14 }}>📅</div>
                  <div style={{ fontFamily: "'Literata', serif", fontSize: 18, color: "var(--p)", marginBottom: 6 }}>Sin historial todavía</div>
                  <div style={{ fontSize: 13, color: "var(--secondary)" }}>Tus turnos aparecerán acá una vez que reserves.</div>
                </div>
              )}
              {historial.map((t) => {
                const es = t.tipoServicio === "ESPECIALIDAD";
                const nombre = es ? t.especialidad?.nombre : t.practica?.nombre;
                const statusStyle = STATUS_STYLE[t.estado] ?? STATUS_STYLE.Disponible;
                return (
                  <div key={t._id} className="wellness-card" style={{ borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 13, marginBottom: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: es ? "var(--p-fixed)" : "#f5e8ec", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>
                      {es ? "🩺" : "🔬"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--p)" }}>{nombre ?? "–"} · {t.medico?.nombre ?? "–"}</div>
                      <div style={{ fontSize: 11, color: "var(--secondary)", marginTop: 2 }}>{fmtFecha(t.fechaHoraInicio)} · {t.sede?.nombre ?? "–"}</div>
                    </div>
                    <span style={{ padding: "3px 11px", borderRadius: 999, fontSize: 10, fontWeight: 700, background: statusStyle.bg, color: statusStyle.color, flexShrink: 0 }}>
                      {t.estado}
                    </span>
                  </div>
                );
              })}
            </>
          )}

          {!esPaciente && tab === "turnos" && (
              <div
                  style={{
                    textAlign: "center",
                    padding: "56px 20px",
                  }}
              >
                <div style={{ fontSize: 48, marginBottom: 14 }}>
                  🩺
                </div>

                <div
                    style={{
                      fontFamily: "'Literata', serif",
                      fontSize: 20,
                      color: "var(--p)",
                      marginBottom: 8,
                    }}
                >
                  Panel médico
                </div>

                <div
                    style={{
                      fontSize: 13,
                      color: "var(--secondary)",
                    }}
                >
                  La gestión de agenda médica está en desarrollo.
                </div>
              </div>
          )}

          {tab === "datos" && (
              <div className="wellness-card" style={{ borderRadius: 20, padding: 28 }}>
                <h2 style={{ fontFamily: "'Literata', serif", fontSize: 22, fontWeight: 700, color: "var(--p)", marginBottom: 18 }}>
                  Mis datos
                </h2>

                {errorPerfil && <Alert type="error" style={{ marginBottom: 16 }}>{errorPerfil}</Alert>}

                {cargandoPerfil && (
                    <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
                      <Spinner size={28} />
                    </div>
                )}

                {!cargandoPerfil && perfil && (() => {
                  const camposBase = [
                    ["Usuario",         usuario.nombreUsuario],
                    ["Nombre completo", perfil.nombre ?? "–"],
                    ["Tipo de cuenta",  esPaciente ? "Paciente" : "Médico"],
                  ];

                  const camposRol = esPaciente
                      ? [
                        ["DNI",        perfil.dni        ?? "–"],
                        ["Obra social", perfil.obraSocial ?? "–"],
                        ["Plan",        perfil.plan       ?? "–"],
                      ]
                      : [
                        ["Matrícula",   perfil.matricula  ?? "–"],
                      ];

                  return (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        {[...camposBase, ...camposRol].map(([label, valor]) => (
                            <div key={label}>
                              <div style={{
                                fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                                letterSpacing: ".06em", color: "var(--on-surf-v)", marginBottom: 5,
                              }}>
                                {label}
                              </div>
                              <div style={{
                                fontSize: 14, fontWeight: 600, color: "var(--on-surf)",
                                padding: "10px 14px", background: "var(--p-fixed)", borderRadius: 11,
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
            <div style={{ textAlign: "center", padding: "56px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>🚧</div>
              <div style={{ fontFamily: "'Literata', serif", fontSize: 20, color: "var(--p)", marginBottom: 8 }}>Próximamente</div>
              <div style={{ fontSize: 13, color: "var(--secondary)" }}>Esta sección está en desarrollo.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
