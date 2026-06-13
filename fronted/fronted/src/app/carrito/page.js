"use client";
import Link from "next/link";
import { useCarrito } from "@/context/CarritoContext";

export default function CarritoPage() {
  const { items, quitar, total } = useCarrito();
  const fmt = (n) => (n != null ? `$${Number(n).toLocaleString("es-AR")}` : "–");
  const fmtFecha = (d) => d ? new Date(d).toLocaleString("es-AR", { dateStyle: "medium", timeStyle: "short" }) : "–";

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 40px 56px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <span style={{ fontSize: 26, color: "var(--p)" }}>🛒</span>
        <h1 style={{ fontFamily: "'Literata', serif", fontSize: 28, fontWeight: 700, color: "var(--p)", margin: 0 }}>Mis turnos seleccionados</h1>
        {items.length > 0 && (
          <span style={{ padding: "3px 12px", background: "var(--p)", color: "#fff", fontSize: 12, fontWeight: 700, borderRadius: 999 }}>{items.length}</span>
        )}
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 20px" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
          <div style={{ fontFamily: "'Literata', serif", fontSize: 22, color: "var(--p)", marginBottom: 8 }}>Tu carrito está vacío</div>
          <div style={{ fontSize: 13, color: "var(--secondary)", marginBottom: 24 }}>Buscá turnos y agregálos desde el buscador.</div>
          <Link href="/turnos" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: "var(--p)", color: "#fff", fontWeight: 700, borderRadius: 999, fontSize: 14, textDecoration: "none", border: "2px solid var(--p)" }}>
            🔍 Buscar turnos
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 22 }}>
          <div>
            {items.map((t) => {
              const es = t.tipoServicio === "ESPECIALIDAD";
              const nombre = es ? t.especialidad?.nombre : t.practica?.nombre;
              return (
                <div key={t._id} className="wellness-card" style={{ borderRadius: 16, padding: "17px 20px", display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: es ? "var(--p-fixed)" : "#f5e8ec", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22 }}>
                    {es ? "🩺" : "🔬"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "inline-block", padding: "2px 7px", background: "var(--p-fixed)", color: "var(--p)", borderRadius: 999, fontSize: 9, fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>
                      {es ? "Especialidad" : "Práctica"}
                    </span>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--p)" }}>{nombre ?? "–"}</div>
                    <div style={{ fontSize: 11, color: "var(--secondary)", marginTop: 2 }}>
                      📅 {fmtFecha(t.fechaHoraInicio)} · 📍 {t.sede?.nombre ?? "–"}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Literata', serif", fontSize: 18, fontWeight: 700, color: "var(--p)", flexShrink: 0 }}>{fmt(t.costo)}</div>
                  <button onClick={() => quitar(t._id)} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid var(--outline-v)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 15, color: "var(--secondary)", flexShrink: 0 }}>
                    🗑
                  </button>
                </div>
              );
            })}
          </div>

          <div className="wellness-card" style={{ borderRadius: 16, padding: 20, alignSelf: "start", position: "sticky", top: 90 }}>
            <h2 style={{ fontFamily: "'Literata', serif", fontSize: 18, fontWeight: 700, color: "var(--p)", marginBottom: 16 }}>Resumen</h2>
            {items.map((t) => {
              const nombre = t.tipoServicio === "ESPECIALIDAD" ? t.especialidad?.nombre : t.practica?.nombre;
              return (
                <div key={t._id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8, color: "var(--secondary)" }}>
                  <span>{nombre}</span>
                  <span style={{ fontWeight: 600, color: "var(--on-surf)" }}>{fmt(t.costo)}</span>
                </div>
              );
            })}
            <div style={{ borderTop: "1px solid var(--outline-v)", margin: "14px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Total estimado</span>
              <span style={{ fontFamily: "'Literata', serif", fontSize: 26, fontWeight: 700, color: "var(--p)" }}>{fmt(total)}</span>
            </div>
            <button style={{ width: "100%", marginTop: 16, padding: "13px 0", background: "var(--p)", color: "#fff", fontWeight: 700, borderRadius: 13, fontSize: 13, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
              ✅ Confirmar turnos
            </button>
            <Link href="/turnos" style={{ display: "block", width: "100%", marginTop: 10, padding: "11px 0", background: "transparent", border: "2px solid var(--p)", color: "var(--p)", fontWeight: 700, borderRadius: 13, fontSize: 12, textAlign: "center", textDecoration: "none" }}>
              ← Seguir buscando
            </Link>
            <p style={{ fontSize: 10, color: "var(--on-surf-v)", textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>Precios estimados. Pueden variar según tu cobertura.</p>
          </div>
        </div>
      )}
    </div>
  );
}
