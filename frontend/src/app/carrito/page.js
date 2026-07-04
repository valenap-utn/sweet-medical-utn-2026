"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCarrito } from "@/context/CarritoContext";
import { useAuth } from "@/context/AuthContext";
import { reservarTurno } from "@/lib/turnosApi";
import { getApiErrorMessage } from "@/lib/api";
import { RolUsuario } from "@/lib/roles";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import {
  FaCalendarAlt,
  FaCheck,
  FaClock,
  FaFlask,
  FaMapMarkerAlt,
  FaPlus,
  FaSearch,
  FaStethoscope,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";
import ConfirmActionModal from "@/components/common/ConfirmActionModal";
import { notify } from "@/lib/toast";

export default function CarritoPage() {
  const { items, quitar, total } = useCarrito();
  const { usuario } = useAuth();
  const router = useRouter();
  const esPaciente = usuario?.rol === RolUsuario.PACIENTE;

  const [confirmando, setConfirmando] = useState(false);
  // const [error, setError]             = useState("");
  const [exito, setExito]             = useState(false);
  const [resultados, setResultados]   = useState(null);

  const [turnoAQuitar, setTurnoAQuitar] = useState(null);

  const fmt      = (n) => n != null ? `$${Number(n).toLocaleString("es-AR")}` : "–";
  const fmtFecha = (d) => d ? new Date(d).toLocaleString("es-AR",{dateStyle:"medium",timeStyle:"short"}) : "–";

  const handleConfirmar = async () => {
    if (!usuario)  { router.push("/login"); return; }
    if (!esPaciente) {
      notify.error("Solo los pacientes pueden reservar turnos.");
      return;
    }
    setConfirmando(true);
    const res = await Promise.allSettled(items.map(t => reservarTurno(t._id)));
    const exitosos = res.filter(r => r.status === "fulfilled").length;
    const fallidos = res.map((r,i)=>({...r,turno:items[i]})).filter(r=>r.status==="rejected");
    setResultados({ exitosos, fallidos });
    if (exitosos > 0) {
      res.forEach((r,i) => { if(r.status==="fulfilled") quitar(items[i]._id); });
      setExito(true);
      notify.success(`${exitosos} turno(s) reservado(s) correctamente.`);
    }
    if (fallidos.length > 0) {
      notify.error(`${fallidos.length} turno(s) no pudieron reservarse: ` +
          fallidos.map(f => {
            const nombre = f.turno.tipoServicio === "ESPECIALIDAD"
                ? f.turno.especialidad?.nombre
                : f.turno.practica?.nombre;

            return `${nombre} — ${getApiErrorMessage(f.reason, "error")}`;
          }).join(". "));
    }
    setConfirmando(false);
  };

  return (
    <div style={{ maxWidth:"var(--page-max)", margin:"0 auto", padding:"clamp(20px,4vw,36px) var(--page-px) 56px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28, flexWrap:"wrap" }}>
        {/*<span style={{ fontSize:26, color:"var(--p)" }}>🗓️</span>*/}
        <FaCalendarAlt
            size={24}
            color="var(--p)"
            style={{ flexShrink: 0 }}
        />
        <h1 style={{ fontFamily:"'Literata',serif", fontSize:"clamp(20px,4vw,28px)", fontWeight:700, color:"var(--p)", margin:0 }}>
          Mis turnos seleccionados
        </h1>
        {items.length > 0 && (
          <span style={{ padding:"3px 12px", background:"var(--p)", color:"#fff", fontSize:12, fontWeight:700, borderRadius:999 }}>
            {items.length}
          </span>
        )}
      </div>

      {exito && (
          <Alert type="success" style={{ marginBottom: 20 }}>
            <strong>¡Perfecto! Tus turnos fueron reservados.</strong>{" "}
            <Link href="/perfil" style={{ fontWeight: 700, color: "inherit" }}>
              Ver mis turnos →
            </Link>
          </Alert>
      )}

      {items.length === 0 && !exito ? (
        <div style={{ textAlign:"center", padding:"clamp(32px,8vw,64px) 20px" }}>
          {/*<div style={{ fontSize:56, marginBottom:16 }}>🗓️</div>*/}
          <div
              style={{
                width:72,
                height:72,
                margin:"0 auto 18px",
                borderRadius:20,
                background:"var(--p-fixed)",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                color:"var(--p)"
              }}
          >
            <FaCalendarAlt size={34}/>
          </div>
          <div style={{ fontFamily:"'Literata',serif", fontSize:"clamp(18px,3vw,22px)", color:"var(--p)", marginBottom:8 }}>Tu carrito está vacío</div>
          <div style={{ fontSize:13, color:"var(--secondary)", marginBottom:24 }}>Buscá turnos y agregálos desde el buscador.</div>
          <Link href="/turnos" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"13px 28px", background:"var(--p)", color:"#fff", fontWeight:700, borderRadius:999, fontSize:14, textDecoration:"none" }}>
            <>
              <FaSearch size={14}/>
              Buscar turnos
            </>
          </Link>
        </div>
      ) : items.length > 0 ? (
        <div className="carrito-grid" style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) minmax(240px,300px)", gap:22, alignItems:"start" }}>
          {/* Items */}
          <div>
            {items.map(t => {
              const es     = t.tipoServicio === "ESPECIALIDAD";
              const nombre = es ? t.especialidad?.nombre : t.practica?.nombre;
              return (
                <div key={t._id} className="wellness-card" style={{ borderRadius:16, padding:"clamp(12px,2vw,17px) clamp(14px,2vw,20px)", display:"flex", alignItems:"center", gap:12, marginBottom:12, flexWrap:"wrap" }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:es?"var(--p-fixed)":"#f5e8ec", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:22 }}>
                    {/*{es ? "🩺" : "🔬"}*/}
                    {es
                        ? <FaStethoscope size={20} color="var(--p)" />
                        : <FaFlask size={20} color="var(--p)" />
                    }
                  </div>
                  <div style={{ flex:1, minWidth:180 }}>
                    <span style={{ display:"inline-block", padding:"2px 7px", background:"var(--p-fixed)", color:"var(--p)", borderRadius:999, fontSize:9, fontWeight:700, textTransform:"uppercase", marginBottom:3 }}>
                      {es ? "Especialidad" : "Práctica"}
                    </span>
                    <div style={{ fontSize:13, fontWeight:700, color:"var(--p)" }}>{nombre ?? "–"}</div>
                    {/*<div style={{ fontSize:11, color:"var(--secondary)", marginTop:2 }}>
                      Dr/a. {t.medico?.nombre ?? "–"} · 📅 {fmtFecha(t.fechaHoraInicio)} · 📍 {t.sede?.nombre ?? "–"}
                    </div>*/}
                    <div
                        style={{
                          display:"flex",
                          gap:12,
                          flexWrap:"wrap",
                          marginTop:4,
                          fontSize:11,
                          color:"var(--secondary)"
                        }}
                    >
                      <span>Dr/a. {t.medico?.nombre ?? "–"}</span>

                      <span
                          style={{
                            display:"flex",
                            alignItems:"center",
                            gap:4
                          }}
                      >
                        <FaCalendarAlt size={10}/>
                        {fmtFecha(t.fechaHoraInicio)}
                      </span>

                      <span
                          style={{
                            display:"flex",
                            alignItems:"center",
                            gap:4
                          }}
                      >
                        <FaMapMarkerAlt size={10}/>
                        {t.sede?.nombre ?? "–"}
                      </span>

                    </div>
                  </div>
                  <div style={{ fontFamily:"'Literata',serif", fontSize:18, fontWeight:700, color:"var(--p)", flexShrink:0 }}>{fmt(t.costo)}</div>
                  <button onClick={() => setTurnoAQuitar(t)}
                          onMouseEnter={(e) => {
                              e.currentTarget.style.background = "var(--p-fixed)";
                              e.currentTarget.style.borderColor = "var(--p)";
                          }}
                          onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#fff";
                              e.currentTarget.style.borderColor = "var(--outline-v)";
                          }}
                          aria-label="Quitar turno" style={{ width:44, height:44, borderRadius:11, border:"1px solid var(--outline-v)", background:"transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:16, color:"var(--secondary)", flexShrink:0 }}>
                      <FaTrash size={15}/>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Resumen */}
          <div className="wellness-card" style={{ borderRadius:16, padding:20 }}>
            <h2 style={{ fontFamily:"'Literata',serif", fontSize:18, fontWeight:700, color:"var(--p)", marginBottom:16 }}>Resumen</h2>
            {items.map(t => {
              const nombre = t.tipoServicio==="ESPECIALIDAD" ? t.especialidad?.nombre : t.practica?.nombre;
              return (
                <div key={t._id} style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:8, color:"var(--secondary)" }}>
                  <span style={{ maxWidth:150, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{nombre}</span>
                  <span style={{ fontWeight:600, color:"var(--on-surf)" }}>{fmt(t.costo)}</span>
                </div>
              );
            })}
            <div style={{ borderTop:"1px solid var(--outline-v)", margin:"14px 0" }}/>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
              <span style={{ fontSize:13, fontWeight:700 }}>Total estimado</span>
              <span style={{ fontFamily:"'Literata',serif", fontSize:26, fontWeight:700, color:"var(--p)" }}>{fmt(total)}</span>
            </div>
            {!usuario && (
              <p style={{display:"flex", alignItems:"center",justifyContent:"center", gap:2, fontSize:11, color:"var(--p)", marginTop:12, textAlign:"center" }}>
                  <FaClock
                      size={12}
                      style={{ marginRight:4 }}
                  />️ <Link href="/login" style={{ fontWeight:700, color:"var(--p)" }}>Iniciá sesión</Link> para confirmar.
              </p>
            )}
            <button onClick={handleConfirmar} disabled={confirmando||!usuario||!esPaciente}
              style={{ width:"100%", marginTop:14, padding:"13px 0", background:"var(--p)", color:"#fff", fontWeight:700, borderRadius:13, fontSize:13, border:"none", cursor:confirmando||!usuario||!esPaciente?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"inherit", opacity:confirmando||!usuario||!esPaciente?0.7:1 }}>
                {confirmando
                    ? <Spinner size={16}/>
                    : <FaCheck size={14}/>
                }
                {confirmando ? "Reservando..." : "Confirmar turnos"}
            </button>
            <Link href="/turnos" style={{ display:"flex", alignItems:"center", justifyContent: "center", gap: 8, width:"100%", marginTop:10, padding:"11px 0", background:"transparent", border:"2px solid var(--p)", color:"var(--p)", fontWeight:700, borderRadius:13, fontSize:12, textAlign:"center", textDecoration:"none" }}>
                <FaArrowLeft size={12}/> Seguir buscando
            </Link>
            <p style={{ fontSize:10, color:"var(--on-surf-v)", textAlign:"center", marginTop:10, lineHeight:1.5 }}>
              Precios estimados. Varían según cobertura.
            </p>
          </div>
        </div>
      ) : null}

      <ConfirmActionModal
          open={!!turnoAQuitar}
          title="Quitar turno"
          message="¿Querés quitar este turno de tus seleccionados? Si cambiás de opinión, vas a poder volver a agregarlo desde el buscador."          confirmText="Quitar"
          cancelText="Cancelar"
          variant="danger"
          onCancel={() => setTurnoAQuitar(null)}
          onConfirm={() => {
            quitar(turnoAQuitar._id);
            setTurnoAQuitar(null);
          }}
      />

      <style>{`
        @media (max-width: 700px) {
          .carrito-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
