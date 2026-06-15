"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const DOCTORS = [
  { name: "Dr. Alejandro Sosa", spec: "Cardiología Clínica", rating: "4.9", avail: "Disponible hoy",    tags: ["Ecografía","Chequeo"] },
  { name: "Dra. Martina Ruiz",  spec: "Pediatría",           rating: "5.0", avail: "Próx. Jueves",      tags: ["Vacunación","Recién nacido"] },
  { name: "Dr. Julian Valles",  spec: "Dermatología",        rating: "4.8", avail: "Disponible mañana", tags: ["Acné","Cirugía menor"] },
];

const FEATS = [
  { icon: "🕐", title: "Sin esperas",        desc: "Reservas instantáneas con confirmación por email y SMS." },
  { icon: "📋", title: "Atención integral",  desc: "Historial clínico, resultados y cobertura en un solo lugar." },
  { icon: "✅", title: "Médicos verificados",desc: "Todos los profesionales certificados y evaluados por pacientes." },
];

export default function HomePage() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let n = 0;
    const t = setInterval(() => { n += 3; setCount(n); if (n >= 47) clearInterval(t); }, 30);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", padding: "64px 40px 52px" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#fdfaf8 0%,#f9eef0 45%,#f5e4e8 70%,#fdfaf8 100%)" }} />
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(107,29,42,.12) 0%,transparent 70%)", top: -120, right: -80, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle,rgba(107,29,42,.07) 0%,transparent 70%)", bottom: -80, left: 20, pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 310px", gap: 56, alignItems: "center" }}>
          {/* Left */}
          <div>
            <span className="glass-rose" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--p)", marginBottom: 20 }}>
              ✦ Tu salud, sin vueltas
            </span>
            <h1 style={{ fontFamily: "'Literata', serif", fontSize: 52, fontWeight: 700, color: "var(--p)", lineHeight: 1.05, letterSpacing: "-.025em", marginBottom: 16 }}>
              Reservá turnos<br /><span style={{ color: "var(--p-mid)" }}>médicos</span> en<br />minutos
            </h1>
            <p style={{ fontSize: 16, color: "var(--secondary)", lineHeight: 1.65, maxWidth: 430, marginBottom: 28 }}>
              Buscá especialidades y prácticas, elegí el horario que más te convenga y confirmá tu turno sin llamadas ni esperas.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/turnos" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", background: "var(--p)", color: "#fff", fontWeight: 700, borderRadius: 999, fontSize: 15, textDecoration: "none", border: "2px solid var(--p)", boxShadow: "0 8px 28px rgba(107,29,42,.25)", transition: "all .2s" }}>
                🔍 Buscar turnos
              </Link>
              <Link href="/registro" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", background: "transparent", color: "var(--p)", fontWeight: 700, borderRadius: 999, fontSize: 15, textDecoration: "none", border: "2px solid var(--p)", transition: "all .2s" }}>
                Crear cuenta
              </Link>
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
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--p-fixed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🩺</div>
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
      <section style={{ padding: "28px 40px", maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {FEATS.map((f) => (
          <div key={f.title} className="glass wellness-card" style={{ borderRadius: 18, padding: 22 }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--p)", marginBottom: 4 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: "var(--secondary)", lineHeight: 1.55 }}>{f.desc}</div>
          </div>
        ))}
      </section>

      {/* STATS */}
      <section style={{ background: "var(--p)", padding: "26px 40px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", textAlign: "center", maxWidth: "100%" }}>
        {[["500k+","Pacientes"],["1.2k+","Profesionales"],["40+","Especialidades"],["98%","Satisfacción"]].map(([n,l]) => (
          <div key={l}>
            <div style={{ fontFamily: "'Literata', serif", fontSize: 34, fontWeight: 700, color: "var(--p-fixed)" }}>{n}</div>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: "rgba(249,238,240,.55)", marginTop: 3 }}>{l}</div>
          </div>
        ))}
      </section>

      {/* DOCTORS */}
      <section style={{ padding: "36px 40px 48px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 22 }}>
          <div>
            <h2 style={{ fontFamily: "'Literata', serif", fontSize: 28, fontWeight: 700, color: "var(--p)", margin: 0 }}>Profesionales destacados</h2>
            <p style={{ fontSize: 13, color: "var(--secondary)", margin: "4px 0 0" }}>Elegí atención de primer nivel cerca de vos.</p>
          </div>
          <Link href="/turnos" style={{ fontSize: 13, fontWeight: 700, color: "var(--p)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            Ver todos →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {DOCTORS.map((d, i) => (
            <div key={d.name} className="wellness-card" style={{ borderRadius: 20, overflow: "hidden" }}>
              <div style={{ height: 130, background: `linear-gradient(135deg,${["#f9eef0","#f5e4e8","#f0d4d9"][i]},${["#f0d4d9","#f9eef0","#e8c4cb"][i]})`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <span style={{ fontSize: 60, opacity: .25 }}>👤</span>
                <span style={{ position: "absolute", top: 10, right: 10, padding: "4px 10px", background: "rgba(255,255,255,.88)", backdropFilter: "blur(8px)", color: "var(--p)", fontSize: 10, fontWeight: 700, borderRadius: 999, border: "1px solid var(--p-fixed-dim)" }}>{d.avail}</span>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--p)" }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: "var(--secondary)" }}>{d.spec}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--p)", display: "flex", alignItems: "center", gap: 2 }}>⭐ {d.rating}</div>
                </div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 8 }}>
                  {d.tags.map(t => <span key={t} style={{ padding: "3px 9px", background: "var(--p-fixed)", color: "var(--p)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", borderRadius: 999 }}>{t}</span>)}
                </div>
                <Link href="/turnos" style={{ display: "block", width: "100%", marginTop: 12, padding: "9px 0", border: "2px solid var(--p)", color: "var(--p)", fontWeight: 700, fontSize: 12, borderRadius: 12, textAlign: "center", textDecoration: "none", transition: "all .2s" }}>
                  Reservar Turno
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
