"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClipboardList,
  FaSearch,
  FaStar,
  FaStethoscope,
  FaUserCircle,
  FaClock,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

const DOCTORS = [
  { name: "Dr. Alejandro Sosa", spec: "Cardiología Clínica", rating: "4.9", avail: "Disponible hoy",    tags: ["Ecografía","Chequeo"] },
  { name: "Dra. Martina Ruiz",  spec: "Pediatría",           rating: "5.0", avail: "Próx. Jueves",      tags: ["Vacunación","Recién nacido"] },
  { name: "Dr. Julian Valles",  spec: "Dermatología",        rating: "4.8", avail: "Disponible mañana", tags: ["Acné","Cirugía menor"] },
];

const FEATS = [
  { icon: FaClock, title: "Sin esperas",        desc: "Reservas instantáneas con confirmación por email y SMS." },
  { icon: FaClipboardList, title: "Atención integral",  desc: "Historial clínico, resultados y cobertura en un solo lugar." },
  { icon: FaCheckCircle, title: "Médicos verificados",desc: "Todos los profesionales certificados y evaluados por pacientes." },
];

export default function HomePage() {
  const [count, setCount] = useState(0);

  const { usuario } = useAuth();

  useEffect(() => {
    let n = 0;
    const t = setInterval(() => { n += 3; setCount(n); if (n >= 47) clearInterval(t); }, 30);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", padding: "clamp(40px,6vw,72px) 0 clamp(32px,4vw,48px)" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#fdfaf8 0%,#f9eef0 45%,#f5e4e8 70%,#fdfaf8 100%)" }} />
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(107,29,42,.12) 0%,transparent 70%)", top: -120, right: -80, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle,rgba(107,29,42,.07) 0%,transparent 70%)", bottom: -80, left: 20, pointerEvents: "none" }} />

        <div className="hero-grid" style={{ position: "relative", zIndex: 1, maxWidth: "var(--page-max)", margin: "0 auto", padding:"0 var(--page-px)", display: "grid", gridTemplateColumns: "minmax(0,1fr) min(310px,40%)", gap: "clamp(32px,5vw,64px)", alignItems: "center" }}>
          {/* Left */}
          <div>
            <span className="glass-rose" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--p)", marginBottom: 20 }}>
              ✦ Tu salud, sin vueltas
            </span>
            <h1 style={{ fontFamily: "'Literata', serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, color: "var(--p)", lineHeight: 1.05, letterSpacing: "-.025em", marginBottom: 16 }}>
              Reservá turnos<br /><span style={{ color: "var(--p-mid)" }}>médicos</span> en<br />minutos
            </h1>
            <p style={{ fontSize: 16, color: "var(--secondary)", lineHeight: 1.65, maxWidth: 430, marginBottom: 28 }}>
              Buscá especialidades y prácticas, elegí el horario que más te convenga y confirmá tu turno sin llamadas ni esperas.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link
                  href="/turnos"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "14px 32px",
                    background: "var(--p)",
                    color: "#fff",
                    fontWeight: 700,
                    borderRadius: 999,
                    fontSize: 15,
                    textDecoration: "none",
                    border: "2px solid var(--p)",
                    boxShadow: "0 8px 28px rgba(107,29,42,.25)",
                    transition: "all .2s"
                  }}
              >
                <FaSearch size={14}/>
                Buscar turnos
              </Link>

              {!usuario && (
                  <Link
                      href="/registro"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "14px 32px",
                        background: "transparent",
                        color: "var(--p)",
                        fontWeight: 700,
                        borderRadius: 999,
                        fontSize: 15,
                        textDecoration: "none",
                        border: "2px solid var(--p)",
                        transition: "all .2s"
                      }}
                  >
                    Crear cuenta
                  </Link>
              )}
            </div>
          </div>

          {/* Right — glass card */}
          <div style={{ position: "relative" }}>
            <div className="glass" style={{ position: "absolute", top: -18, right: -10, borderRadius: 14, padding: "10px 16px", boxShadow: "0 8px 24px rgba(107,29,42,.12)", display: "flex", alignItems: "center", gap: 10, zIndex: 2 }}>
              <span className="animate-pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              <div>
                <div style={{ fontFamily: "'Literata', serif", fontWeight: 700, fontSize: 20, color: "var(--p)", lineHeight: 1 }}>{count}</div>
                <div style={{ fontSize: 10, color: "var(--secondary)" }}>Turnos hoy</div>
              </div>
            </div>

            <div className="glass" style={{ borderRadius: 24, padding: 22, boxShadow: "0 20px 60px rgba(107,29,42,.13)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--p-fixed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                  <FaStethoscope size={22} color="var(--p)" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--p)" }}>Dr. Alejandro Sosa</div>
                  <div style={{ fontSize: 11, color: "var(--secondary)" }}>Cardiología · Sede Centro</div>
                </div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--secondary)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>Próximos turnos</div>
              {[["10:30 hs","Reservar",false],["11:00 hs","Ocupado",true],["12:00 hs","Reservar",false]].map(([time, lbl, taken]) => (
                <div key={time} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: 11, background: "rgba(255,255,255,.75)", border: "1px solid rgba(255,255,255,.9)", marginBottom: 6, fontSize: 12 }}>
                  <span style={{ fontWeight: 700, color: "var(--p)" }}>{time}</span>
                  <span style={{ fontSize: 11, color: "var(--secondary)" }}>30 min</span>
                  <Link href="/turnos" style={{ padding: "4px 11px", background: taken ? "var(--p-fixed)" : "var(--p)", color: taken ? "var(--p)" : "#fff", border: "none", borderRadius: 999, fontSize: 10, fontWeight: 700, textDecoration: "none", cursor: taken ? "default" : "pointer" }}>
                    {lbl}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "clamp(32px,5vw,64px) var(--page-px)", maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "clamp(12px,2vw,24px)" }}>
        {FEATS.map((f) => (
          <div key={f.title} className="glass wellness-card" style={{ borderRadius: 18, padding: 22 }}>
            {/*<div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>*/}
            <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "var(--p-fixed)",
                  color: "var(--p)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
            >
              <f.icon size={20} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--p)", marginBottom: 4 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: "var(--secondary)", lineHeight: 1.55 }}>{f.desc}</div>
          </div>
        ))}
      </section>

      {/* STATS */}
      <section style={{ background: "var(--p)", padding: "clamp(32px,5vw,52px) var(--page-px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", textAlign: "center", maxWidth: "100%" }}>
        {[["500k+","Pacientes"],["1.2k+","Profesionales"],["40+","Especialidades"],["98%","Satisfacción"]].map(([n,l]) => (
          <div key={l}>
            <div style={{ fontFamily: "'Literata', serif", fontSize: "clamp(26px,4vw,34px)", fontWeight: 700, color: "var(--p-fixed)" }}>{n}</div>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: "rgba(249,238,240,.55)", marginTop: 3 }}>{l}</div>
          </div>
        ))}
      </section>

      {/* DOCTORS */}
      <section style={{ padding: "clamp(28px,4vw,48px) var(--page-px) clamp(48px,6vw,72px)", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: "'Literata', serif", fontSize: "clamp(22px,3.2vw,28px)", fontWeight: 700, color: "var(--p)", margin: 0 }}>Profesionales destacados</h2>
            <p style={{ fontSize: 13, color: "var(--secondary)", margin: "4px 0 0" }}>Elegí atención de primer nivel cerca de vos.</p>
          </div>
          <Link href="/turnos" style={{ fontSize: 13, fontWeight: 700, color: "var(--p)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            Ver todos →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}>
          {DOCTORS.map((d, i) => (
            <div key={d.name} className="wellness-card" style={{ borderRadius: 20, overflow: "hidden" }}>
              <div style={{ height: 130, background: `linear-gradient(135deg,${["#f9eef0","#f5e4e8","#f0d4d9"][i]},${["#f0d4d9","#f9eef0","#e8c4cb"][i]})`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <span style={{ fontSize: 60, opacity: .25 }}>
                  <FaUserCircle size={58} color="var(--p)" style={{ opacity: 0.25 }} />
                </span>
                <span style={{ position: "absolute", top: 10, right: 10, padding: "4px 10px", background: "rgba(255,255,255,.88)", backdropFilter: "blur(8px)", color: "var(--p)", fontSize: 10, fontWeight: 700, borderRadius: 999, border: "1px solid var(--p-fixed-dim)" }}>{d.avail}</span>
              </div>
              <div className="doctor-info" style={{ padding: 16 }}>
                <div className="doctor-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, flexDirection: "column", textAlign: "center", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--p)" }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: "var(--secondary)" }}>{d.spec}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--p)", display: "flex", alignItems: "center", gap: 2 }}>
                    <FaStar size={12} /> {d.rating}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 8 }}>
                  {d.tags.map(t => <span key={t} style={{ padding: "3px 9px", background: "var(--p-fixed)", color: "var(--p)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", borderRadius: 999 }}>{t}</span>)}
                </div>
                <Link href="/turnos" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 44, width: "100%", marginTop: 12, border: "2px solid var(--p)", color: "var(--p)", fontWeight: 700, fontSize: 12, borderRadius: 12, textAlign: "center", textDecoration: "none", transition: "all .2s" }}>
                  Reservar Turno
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        /* Default - applies to all */
        section {
          padding-left: clamp(16px, 4vw, 40px) !important;
          padding-right: clamp(16px, 4vw, 40px) !important;
          margin-bottom: clamp(32px, 4vw, 48px) !important;
        }

        section:first-of-type {
          margin-bottom: clamp(48px, 6vw, 80px) !important;
        }

        section:last-of-type {
          margin-bottom: 0 !important;
        }

        /* PC: >= 821px */
        @media (min-width: 821px) {
          section {
            padding-left: clamp(32px, 5vw, 60px) !important;
            padding-right: clamp(32px, 5vw, 60px) !important;
            margin-bottom: 32px !important;
          }
          section:first-of-type {
            margin-bottom: clamp(20px, 3vw, 32px) !important;
          }
          .hero-grid {
            grid-template-columns: minmax(0, 1fr) min(310px, 40%) !important;
            gap: clamp(48px, 6vw, 80px) !important;
          }
          .doctor-header {
            flex-direction: row !important;
            justify-content: space-between !important;
            text-align: left !important;
          }
        }

        /* TABLET: 641px - 820px */
        @media (min-width: 641px) and (max-width: 820px) {
          section {
            padding-left: clamp(20px, 3.5vw, 32px) !important;
            padding-right: clamp(20px, 3.5vw, 32px) !important;
            margin-bottom: clamp(40px, 5vw, 56px) !important;
          }
          section:first-of-type {
            margin-bottom: 24px !important;
          }
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: clamp(28px, 4vw, 40px) !important;
          }
          .hero-grid > div:nth-child(2) {
            order: 3;
            margin-top: 16px;
          }
          .doctor-header {
            flex-direction: row !important;
            justify-content: space-between !important;
            text-align: left !important;
          }
          .wellness-card {
            padding: 16px !important;
          }
        }

        /* CELULAR: <= 640px */
        @media (max-width: 640px) {
          section {
            padding-left: clamp(12px, 3vw, 20px) !important;
            padding-right: clamp(12px, 3vw, 20px) !important;
            margin-bottom: clamp(24px, 3.5vw, 36px) !important;
          }
          section:first-of-type {
            margin-bottom: 20px !important;
          }
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: clamp(20px, 3vw, 28px) !important;
          }
          .hero-grid > div:nth-child(2) {
            order: 3;
            margin-top: 12px;
          }
          .doctor-header {
            flex-direction: column !important;
            text-align: center !important;
          }
          .wellness-card {
            padding: 12px !important;
          }
        }
      `}</style>
    </div>
    
  );
}

