"use client";
import Link from "next/link";
const OPTS = [
  { href: "/registro/paciente", emoji: "🧑‍⚕️", title: "Soy paciente", desc: "Quiero buscar especialidades y prácticas, y reservar turnos médicos." },
  { href: "/registro/medico",   emoji: "🩺",    title: "Soy médico",  desc: "Quiero gestionar mi agenda, mis especialidades y atender pacientes." },
];
export default function RegistroPage() {
  return (
    <div style={{ minHeight: "calc(100vh - 140px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", background: "linear-gradient(135deg,#fdfaf8,#f9eef0 50%,#fdfaf8)" }}>
      <div style={{ width: "100%", maxWidth: 640 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontFamily: "'Literata', serif", fontSize: 20, fontWeight: 700, color: "var(--p)", marginBottom: 20 }}>Sweet Medical</div>
          <h1 style={{ fontFamily: "'Literata', serif", fontSize: 32, fontWeight: 700, color: "var(--p)", marginBottom: 8 }}>Creá tu cuenta</h1>
          <p style={{ fontSize: 14, color: "var(--secondary)" }}>Contanos quién sos para mostrarte lo que necesitás.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {OPTS.map((o) => (
            <Link key={o.href} href={o.href} style={{ display: "block", background: "#fff", border: "2px solid var(--outline-v)", borderRadius: 20, padding: 28, textDecoration: "none", transition: "all .2s", boxShadow: "0 4px 16px rgba(107,29,42,.05)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--p)"; e.currentTarget.style.background = "var(--p-fixed)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--outline-v)"; e.currentTarget.style.background = "#fff"; }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--p-fixed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 16 }}>{o.emoji}</div>
              <h2 style={{ fontFamily: "'Literata', serif", fontSize: 18, fontWeight: 700, color: "var(--p)", marginBottom: 6 }}>{o.title}</h2>
              <p style={{ fontSize: 13, color: "var(--secondary)", lineHeight: 1.5, marginBottom: 14 }}>{o.desc}</p>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--p)", display: "flex", alignItems: "center", gap: 4 }}>Continuar →</span>
            </Link>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--secondary)", marginTop: 24 }}>
          ¿Ya tenés cuenta? <Link href="/login" style={{ fontWeight: 700, color: "var(--p)", textDecoration: "none" }}>Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
}
