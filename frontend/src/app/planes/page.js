"use client";
import { useState, useEffect } from "react";
import { getPlanes } from "@/lib/serviciosApi";
import { getApiErrorMessage } from "@/lib/api";
import Spinner from "@/components/ui/Spinner";
import Alert from "@/components/ui/Alert";
import Link from "next/link";

const FALLBACK_PLANES = [
  { _id: "basic", nombre: "Basic", precio: 4500, features: ["Consultas médicas generales","2 especialidades incluidas","Urgencias 24hs"], highlight: false },
  { _id: "prem",  nombre: "Premium", precio: 8900, features: ["Todas las especialidades","Prácticas incluidas","Urgencias 24hs","Medicamentos con descuento"], highlight: true },
  { _id: "fam",   nombre: "Familiar", precio: 14200, features: ["Todo lo de Premium","Hasta 4 integrantes","Pediatría sin costo adicional","Odontología básica"], highlight: false },
];

export default function PlanesPage() {
  const [planes, setPlanes]     = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        const data = await getPlanes();
        if (activo) setPlanes(data.length ? data : FALLBACK_PLANES);
      } catch (e) {
        if (activo) { setError(getApiErrorMessage(e, "No pudimos cargar los planes.")); setPlanes(FALLBACK_PLANES); }
      } finally {
        if (activo) setCargando(false);
      }
    })();
    return () => { activo = false; };
  }, []);

  return (
    <div>
      {/* Hero */}
      <div style={{ position: "relative", overflow: "hidden", padding: "clamp(24px,5vw,48px) var(--page-px) 40px" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#fdf5f6 0%,#f9eef0 40%,#f5e4e8 70%,#fdfaf8 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "var(--page-max)", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Literata', serif", fontSize: "clamp(26px,5vw,36px)", fontWeight: 700, color: "var(--p)", marginBottom: 8 }}>Planes de cobertura</h1>
          <p style={{ fontSize: 15, color: "var(--secondary)", maxWidth: 500 }}>Elegí el plan que mejor se adapte a tus necesidades de salud y tu familia.</p>
        </div>
      </div>

      <div style={{ maxWidth: "var(--page-max)", margin: "0 auto", padding: "0 var(--page-px) 56px" }}>
        {error && <Alert type="info" style={{ marginBottom: 20 }}>{error} Mostrando planes de referencia.</Alert>}
        {cargando ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 56 }}><Spinner size={32} /></div>
        ) : (
          <div className="planes-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 24, marginTop: 16 }}>
            {planes.map((plan, i) => {
              const hl = plan.highlight ?? i === 1;
              return (
                <div key={plan._id} className="plan-card" style={{ position: "relative", borderRadius: 20, padding: 24, border: `2px solid ${hl ? "var(--p)" : "var(--outline-v)"}`, background: hl ? "var(--p-fixed)" : "#fff", boxShadow: hl ? "0 12px 40px rgba(107,29,42,.13)" : "0 4px 16px rgba(107,29,42,.05)", transition: "all .2s" }}>
                  {hl && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", padding: "4px 16px", background: "var(--p)", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 999, whiteSpace: "nowrap" }}>Más elegido</div>}
                  <div style={{ fontFamily: "'Literata', serif", fontSize: 22, fontWeight: 700, color: "var(--p)", marginBottom: 4 }}>{plan.nombre}</div>
                  {plan.precio && (
                    <div style={{ fontFamily: "'Literata', serif", fontSize: 30, fontWeight: 700, color: "var(--p)", marginBottom: 16 }}>
                      ${plan.precio.toLocaleString("es-AR")}<span style={{ fontSize: 13, fontWeight: 400, color: "var(--secondary)" }}>/mes</span>
                    </div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                    {(plan.features ?? plan.coberturas ?? ["Cobertura médica básica"]).map((f, fi) => (
                      <div key={fi} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--on-surf-v)" }}>
                        <span style={{ color: "var(--p)", fontWeight: 700 }}>✓</span> {typeof f === "string" ? f : f.nombre ?? JSON.stringify(f)}
                      </div>
                    ))}
                  </div>
                  <Link href="/registro" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 44, width: "100%", background: hl ? "var(--p)" : "transparent", color: hl ? "#fff" : "var(--p)", border: "2px solid var(--p)", fontWeight: 700, borderRadius: 13, fontSize: 13, textAlign: "center", textDecoration: "none", transition: "all .2s" }}>
                    Seleccionar plan
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="glass-rose planes-cta" style={{ borderRadius: 20, padding: "32px 36px", marginTop: 36, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Literata', serif", fontSize: 22, fontWeight: 700, color: "var(--p)", marginBottom: 6 }}>¿Tenés obra social?</div>
            <div style={{ fontSize: 13, color: "var(--secondary)", maxWidth: 400 }}>Podés asociar tu obra social y plan al crear tu cuenta. Accedés a descuentos automáticos en cada turno.</div>
          </div>
          <Link href="/registro" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: "var(--p)", color: "#fff", fontWeight: 700, borderRadius: 999, fontSize: 14, textDecoration: "none", border: "2px solid var(--p)", whiteSpace: "nowrap" }}>
            Crear cuenta gratis
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .planes-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
      
        @media (max-width: 760px) {
          .planes-grid {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }
      
          .plan-card {
            padding: 22px !important;
          }
      
          .planes-cta {
            padding: 24px !important;
            align-items: stretch !important;
          }
      
          .planes-cta a {
            width: 100%;
            justify-content: center;
          }
      
          h1 {
            font-size: 30px !important;
            line-height: 1.15 !important;
          }
        }
      `}</style>

    </div>
  );
}
