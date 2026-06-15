"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCarrito } from "@/context/CarritoContext";
import { useAuth } from "@/context/AuthContext";
import { reservarTurno } from "@/lib/turnosApi";
import { getApiErrorMessage } from "@/lib/api";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";

export default function CarritoPage() {
  const { items, quitar, vaciar, total } = useCarrito();
  const { usuario } = useAuth();
  const router = useRouter();

  const [confirmando, setConfirmando] = useState(false);
  const [error, setError]             = useState("");
  const [exito, setExito]             = useState(false);
  const [resultados, setResultados]   = useState([]);

  const fmt = (n) => (n != null ? `$${Number(n).toLocaleString("es-AR")}` : "–");
  const fmtFecha = (d) =>
    d ? new Date(d).toLocaleString("es-AR", { dateStyle: "medium", timeStyle: "short" }) : "–";

  const handleConfirmar = async () => {
    if (!usuario) { router.push("/login"); return; }
    if (!usuario.pacienteId) {
      setError("Solo los pacientes pueden reservar turnos.");
      return;
    }

    setConfirmando(true);
    setError("");

    // Reservamos cada turno del carrito en paralelo,
    // capturando individualmente los que fallan
    const resultados = await Promise.allSettled(
      items.map((t) => reservarTurno(t._id))
    );

    const exitosos = resultados.filter((r) => r.status === "fulfilled").length;
    const fallidos = resultados
      .map((r, i) => ({ ...r, turno: items[i] }))
      .filter((r) => r.status === "rejected");

    setResultados({ exitosos, fallidos });
    setConfirmando(false);

    if (exitosos > 0) {
      // Quitamos del carrito solo los que se reservaron bien
      resultados.forEach((r, i) => {
        if (r.status === "fulfilled") quitar(items[i]._id);
      });
      setExito(true);
    }

    if (fallidos.length > 0) {
      setError(
        `${fallidos.length} turno(s) no pudieron reservarse: ` +
          fallidos
            .map((f) => {
              const nombre =
                f.turno.tipoServicio === "ESPECIALIDAD"
                  ? f.turno.especialidad?.nombre
                  : f.turno.practica?.nombre;
              return `${nombre} — ${getApiErrorMessage(f.reason, "error desconocido")}`;
            })
            .join(". ")
      );
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 40px 56px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <span style={{ fontSize: 26, color: "var(--p)" }}>🛒</span>
        <h1 style={{ fontFamily: "'Literata', serif", fontSize: 28, fontWeight: 700, color: "var(--p)", margin: 0 }}>
          Mis turnos seleccionados
        </h1>
        {items.length > 0 && (
          <span style={{ padding: "3px 12px", background: "var(--p)", color: "#fff", fontSize: 12, fontWeight: 700, borderRadius: 999 }}>
            {items.length}
          </span>
        )}
      </div>

      {exito && (
        <Alert type="success" style={{ marginBottom: 20 }}>
          ✅ {resultados.exitosos} turno(s) reservado(s) correctamente.{" "}
          <Link href="/perfil" style={{ fontWeight: 700, color: "inherit" }}>
            Ver en mi perfil →
          </Link>
        </Alert>
      )}
      {error && <Alert type="error" style={{ marginBottom: 20 }}>{error}</Alert>}

      {items.length === 0 && !exito ? (
        <div style={{ textAlign: "center", padding: "64px 20px" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
          <div style={{ fontFamily: "'Literata', serif", fontSize: 22, color: "var(--p)", marginBottom: 8 }}>
            Tu carrito está vacío
          </div>
          <div style={{ fontSize: 13, color: "var(--secondary)", marginBottom: 24 }}>
            Buscá turnos y agregálos desde el buscador.
          </div>
          <Link href="/turnos" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: "var(--p)", color: "#fff", fontWeight: 700, borderRadius: 999, fontSize: 14, textDecoration: "none", border: "2px solid var(--p)" }}>
            🔍 Buscar turnos
          </Link>
        </div>
      ) : items.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 22 }}>
          {/* Lista de items */}
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
                      Dr/a. {t.medico?.nombre ?? "–"} · 📅 {fmtFecha(t.fechaHoraInicio)} · 📍 {t.sede?.nombre ?? "–"}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Literata', serif", fontSize: 18, fontWeight: 700, color: "var(--p)", flexShrink: 0 }}>
                    {fmt(t.costo)}
                  </div>
                  <button onClick={() => quitar(t._id)} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid var(--outline-v)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 15, color: "var(--secondary)", flexShrink: 0 }}>
                    🗑
                  </button>
                </div>
              );
            })}
          </div>

          {/* Panel de resumen */}
          <div className="wellness-card" style={{ borderRadius: 16, padding: 20, alignSelf: "start", position: "sticky", top: 90 }}>
            <h2 style={{ fontFamily: "'Literata', serif", fontSize: 18, fontWeight: 700, color: "var(--p)", marginBottom: 16 }}>Resumen</h2>
            {items.map((t) => {
              const nombre = t.tipoServicio === "ESPECIALIDAD" ? t.especialidad?.nombre : t.practica?.nombre;
              return (
                <div key={t._id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8, color: "var(--secondary)" }}>
                  <span style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nombre}</span>
                  <span style={{ fontWeight: 600, color: "var(--on-surf)" }}>{fmt(t.costo)}</span>
                </div>
              );
            })}
            <div style={{ borderTop: "1px solid var(--outline-v)", margin: "14px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Total estimado</span>
              <span style={{ fontFamily: "'Literata', serif", fontSize: 26, fontWeight: 700, color: "var(--p)" }}>{fmt(total)}</span>
            </div>

            {!usuario && (
              <p style={{ fontSize: 11, color: "var(--p)", marginTop: 12, textAlign: "center" }}>
                ⚠️ <Link href="/login" style={{ fontWeight: 700, color: "var(--p)" }}>Iniciá sesión</Link> para confirmar los turnos.
              </p>
            )}

            <button
              onClick={handleConfirmar}
              disabled={confirmando || !usuario}
              style={{ width: "100%", marginTop: 14, padding: "13px 0", background: "var(--p)", color: "#fff", fontWeight: 700, borderRadius: 13, fontSize: 13, border: "none", cursor: confirmando || !usuario ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", opacity: confirmando || !usuario ? 0.7 : 1 }}
            >
              {confirmando ? <Spinner size={16} /> : "✅"} {confirmando ? "Reservando..." : "Confirmar turnos"}
            </button>
            <Link href="/turnos" style={{ display: "block", width: "100%", marginTop: 10, padding: "11px 0", background: "transparent", border: "2px solid var(--p)", color: "var(--p)", fontWeight: 700, borderRadius: 13, fontSize: 12, textAlign: "center", textDecoration: "none" }}>
              ← Seguir buscando
            </Link>
            <p style={{ fontSize: 10, color: "var(--on-surf-v)", textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>
              Precios estimados. Pueden variar según tu cobertura de obra social.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
