"use client";
import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {getPlanes} from "@/lib/serviciosApi";
import {getApiErrorMessage} from "@/lib/api";
import Spinner from "@/components/ui/Spinner";
import Link from "next/link";
import "./plan-detalle.css";
import {LuCircleCheck, LuCircleDashed, LuCircleX, LuCrown, LuStethoscope, LuUsers,} from "react-icons/lu";


// ── Datos fijos por plan (precio y features) ─────────────────────
const DATOS_FIJOS = {
    Basic: {
        precio: 4500,
        color: "#8B6870",
        gradiente: "linear-gradient(135deg,#fdf5f6,#f9eef0)",
        descripcion: "Una cobertura simple para consultas esenciales y atención médica general.",
        noIncluye: [
            "Resonancias magnéticas",
            "Internaciones de larga estadía",
            "Tratamientos estéticos",
        ],
        icono: LuStethoscope,
    },

    Premium: {
        precio: 8900,
        color: "#6B1D2A",
        gradiente: "linear-gradient(135deg,#6B1D2A,#8B2535)",
        descripcion: "Cobertura integral para acceder a una amplia red de profesionales y especialidades.",
        noIncluye: [
            "Tratamientos estéticos",
            "Cirugías electivas no urgentes",
        ],
        icono: LuCrown,
    },

    Familiar: {
        precio: 14200,
        color: "#4E1520",
        gradiente: "linear-gradient(135deg,#4E1520,#6B1D2A)",
        descripcion: "Pensado para grupos familiares que necesitan mayor alcance de cobertura.",
        noIncluye: [
            "Tratamientos estéticos",
        ],
        icono: LuUsers,
    },
};

const TODOS_LOS_PLANES_ORDEN = ["Basic", "Premium", "Familiar"];

function normalizarNivel(nivel) {
    if (!nivel) return "NO_CUBIERTA";
    return String(nivel).toUpperCase();
}

function textoNivel(nivel) {
    const n = normalizarNivel(nivel);
    if (n === "TOTAL") return "Total";
    if (n === "PARCIAL") return "Parcial";
    return "No cubierta";
}

function claseNivel(nivel) {
    const n = normalizarNivel(nivel);
    if (n === "TOTAL") return "total";
    if (n === "PARCIAL") return "partial";
    return "none";
}

function IconoNivel({nivel, className = ""}) {
    const n = normalizarNivel(nivel);

    if (n === "TOTAL") {
        return <LuCircleCheck className={`nivel-icon total ${className}`}/>;
    }

    if (n === "PARCIAL") {
        return <LuCircleDashed className={`nivel-icon partial ${className}`}/>;
    }

    return <LuCircleX className={`nivel-icon none ${className}`}/>;
}

function obtenerCoberturas(plan) {
    return [
        ...(plan.coberturasEspecialidad ?? []).map((c) => ({
            nombre: c.especialidad?.nombre ?? c.nombre ?? "Especialidad",
            nivel: c.nivel,
            tipo: "Especialidad",
        })),
        ...(plan.coberturasPractica ?? []).map((c) => ({
            nombre: c.practica?.nombre ?? c.nombre ?? "Práctica",
            nivel: c.nivel,
            tipo: "Práctica",
        })),
    ];
}

// ── FALLBACK si el backend no tiene planes ────────────────────────
const FALLBACK_PLANES = [
    {
        _id: "basic", nombre: "Basic",
        coberturasEspecialidad: [
            {nombre: "Cardiología", nivel: "PARCIAL"},
            {nombre: "Dermatología", nivel: "NO_CUBIERTA"},
            {nombre: "Pediatría", nivel: "TOTAL"},
        ],
        coberturasPractica: [
            {nombre: "Laboratorio", nivel: "TOTAL"},
            {nombre: "Electrocardiograma", nivel: "PARCIAL"},
            {nombre: "Resonancia", nivel: "NO_CUBIERTA"},
        ],
    },
    {
        _id: "prem", nombre: "Premium",
        coberturasEspecialidad: [
            {nombre: "Cardiología", nivel: "TOTAL"},
            {nombre: "Dermatología", nivel: "TOTAL"},
            {nombre: "Pediatría", nivel: "TOTAL"},
        ],
        coberturasPractica: [
            {nombre: "Laboratorio", nivel: "TOTAL"},
            {nombre: "Electrocardiograma", nivel: "TOTAL"},
            {nombre: "Resonancia", nivel: "PARCIAL"},
        ],
    },
    {
        _id: "fam", nombre: "Familiar",
        coberturasEspecialidad: [
            {nombre: "Cardiología", nivel: "TOTAL"},
            {nombre: "Dermatología", nivel: "TOTAL"},
            {nombre: "Pediatría", nivel: "TOTAL"},
        ],
        coberturasPractica: [
            {nombre: "Laboratorio", nivel: "TOTAL"},
            {nombre: "Electrocardiograma", nivel: "TOTAL"},
            {nombre: "Resonancia", nivel: "TOTAL"},
        ],
    },
];

export default function PlanDetallePage() {
    const {id} = useParams();
    const router = useRouter();

    const [planes, setPlanes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let activo = true;
        (async () => {
            try {
                const data = await getPlanes();
                if (activo) setPlanes(data.length ? data : FALLBACK_PLANES);
            } catch (e) {
                if (activo) {
                    setError(getApiErrorMessage(e, ""));
                    setPlanes(FALLBACK_PLANES);
                }
            } finally {
                if (activo) setCargando(false);
            }
        })();
        return () => {
            activo = false;
        };
    }, []);

    if (cargando) return (
        <div style={{display: "flex", justifyContent: "center", padding: 80}}>
            <Spinner size={36}/>
        </div>
    );

    const plan = planes.find((p) => p._id === id || p.nombre?.toLowerCase() === id?.toLowerCase());

    if (!plan) return (
        <div className="detalle-not-found">
            <div style={{fontSize: 52, marginBottom: 16}}>🔍</div>
            <div className="detalle-not-found-title">Plan no encontrado</div>
            <Link href="/planes" className="detalle-back-btn">← Volver a planes</Link>
        </div>
    );

    const datos = DATOS_FIJOS[plan.nombre] ?? DATOS_FIJOS.Basic;
    const coberturas = obtenerCoberturas(plan);
    const esPremium = plan.nombre === "Premium";
    const esFamiliar = plan.nombre === "Familiar";

    // Para la tabla comparativa (Opción D)
    const todasPrestaciones = new Set();
    planes.forEach((p) => obtenerCoberturas(p).forEach((c) => todasPrestaciones.add(c.nombre)));
    const filas = Array.from(todasPrestaciones).map((nombre) => {
        const fila = {nombre};
        planes.forEach((p) => {
            const c = obtenerCoberturas(p).find((x) => x.nombre === nombre);
            fila[p._id] = c?.nivel ?? "NO_CUBIERTA";
        });
        return fila;
    });

    const IconoPlan = datos.icono;

    return (
        <div className="detalle-wrap">

            {/* ══════════════════════════════════════════════════════
          OPCIÓN B — Tarjeta médica / carnet del plan
      ══════════════════════════════════════════════════════ */}
            <section className="carnet-section">
                <div className={`carnet ${esPremium || esFamiliar ? "carnet-dark" : "carnet-light"}`}>
                    {/* Frente del carnet */}
                    <div className="carnet-front">
                        <div className="carnet-header">
                            <div className="carnet-logo">Sweet Medical</div>
                            <div className="carnet-tipo">Plan de Salud</div>
                        </div>
                        <div className="carnet-plan-name">
                            <IconoPlan className="plan-icon"/>
                            <span>{plan.nombre}</span>
                        </div>
                        <div className="carnet-price">
                            ${datos.precio.toLocaleString("es-AR")}
                            <span className="carnet-price-period">/mes</span>
                        </div>
                        <div className="carnet-desc">{datos.descripcion}</div>
                        {(esPremium || esFamiliar) && (
                            <div className="carnet-badge-destacado">
                                {esPremium ? "⭐ Más elegido" : "👨‍👩‍👧‍👦 Plan Familiar"}
                            </div>
                        )}
                        <div className="carnet-footer-bar">
                            <span>Obra Social integrada</span>
                            <span>·</span>
                            <span>Urgencias 24hs</span>
                        </div>
                    </div>

                    {/* Detalles rápidos */}
                    <div className="carnet-details">
                        <div className="carnet-details-title">Cobertura incluida</div>
                        <div className="carnet-cob-list">
                            {coberturas.slice(0, 6).map((c, i) => (
                                <div key={i} className={`carnet-cob-item nivel-${claseNivel(c.nivel)}`}>
                                    <IconoNivel nivel={c.nivel} className="carnet-cob-icono"/>
                                    <span className="carnet-cob-nombre">{c.nombre}</span>
                                    <span className="carnet-cob-nivel">{textoNivel(c.nivel)}</span>
                                </div>
                            ))}
                            {coberturas.length === 0 && (
                                <div style={{fontSize: 13, opacity: .7}}>Ver tabla comparativa abajo</div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
          OPCIÓN C — Secciones: qué incluye / qué no incluye
      ══════════════════════════════════════════════════════ */}
            <section className="secciones-wrap">
                {/* Tu plan */}
                <div className="seccion-card seccion-plan">
                    <div className="seccion-eyebrow">Tu plan actual</div>
                    <div className="seccion-plan-header">
                        <div>
                            <div className="seccion-plan-name">{plan.nombre}</div>
                            <div className="seccion-plan-price">
                                ${datos.precio.toLocaleString("es-AR")}<span>/mes</span>
                            </div>
                        </div>
                        <div className="seccion-plan-icon">
                            <IconoPlan/>
                        </div>
                    </div>
                    <p className="seccion-plan-desc">{datos.descripcion}</p>
                </div>

                {/* Qué incluye */}
                <div className="seccion-card">
                    <div className="seccion-eyebrow incluye-eyebrow">
                        <LuCircleCheck className="eyebrow-icon"/> Qué incluye tu plan
                    </div>
                    <div className="seccion-scroll">
                        <div className="seccion-incluye-grid">
                            {coberturas.filter((c) => normalizarNivel(c.nivel) !== "NO_CUBIERTA").length === 0 ? (
                                <div className="seccion-empty">Consultá el detalle en la tabla comparativa.</div>
                            ) : (
                                coberturas
                                    .filter((c) => normalizarNivel(c.nivel) !== "NO_CUBIERTA")
                                    .map((c, i) => (
                                        <div key={i} className={`incluye-item nivel-${claseNivel(c.nivel)}`}>
                                            <IconoNivel nivel={c.nivel} className="incluye-icono"/>
                                            <div>
                                                <div className="incluye-nombre">{c.nombre}</div>
                                                <div className="incluye-tipo">{c.tipo} · {textoNivel(c.nivel)}</div>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Qué NO incluye */}
                <div className="seccion-card">
                    <div className="seccion-eyebrow no-incluye-eyebrow">
                        <LuCircleX className="eyebrow-icon"/> Qué no incluye
                    </div>
                    <div className="seccion-scroll">

                        <div className="no-incluye-list">
                            {/* Items del backend con NO_CUBIERTA */}
                            {coberturas
                                .filter((c) => normalizarNivel(c.nivel) === "NO_CUBIERTA")
                                .map((c, i) => (
                                    <div key={`back-${i}`} className="no-incluye-item">
                                        <LuCircleX className="no-incluye-x"/>
                                        <span>{c.nombre}</span>
                                    </div>
                                ))}
                            {/* Items fijos */}
                            {datos.noIncluye.map((item, i) => (
                                <div key={`fijo-${i}`} className="no-incluye-item">
                                    <LuCircleX className="no-incluye-x"/>
                                    <span>{item}</span>
                                </div>
                            ))}
                            {coberturas.filter((c) => normalizarNivel(c.nivel) === "NO_CUBIERTA").length === 0
                                && datos.noIncluye.length === 0 && (
                                    <div className="seccion-empty">Este plan cubre todas las prestaciones
                                        disponibles.</div>
                                )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
          OPCIÓN D — Tabla comparativa con el plan actual resaltado
      ══════════════════════════════════════════════════════ */}
            <section className="comparativa-section">
                <div className="comparativa-eyebrow">Comparativa</div>
                <h2 className="comparativa-title">Tu plan vs el resto</h2>
                <p className="comparativa-subtitle">
                    Tu plan actual (<strong>{plan.nombre}</strong>) aparece resaltado. Compará con las otras opciones
                    disponibles.
                </p>

                <div className="comparativa-table-wrap">
                    <table className="comparativa-table">
                        <thead>
                        <tr>
                            <th className="comp-th-prestacion">Prestación</th>
                            {planes
                                .slice()
                                .sort((a, b) =>
                                    TODOS_LOS_PLANES_ORDEN.indexOf(a.nombre) - TODOS_LOS_PLANES_ORDEN.indexOf(b.nombre)
                                )
                                .map((p) => (
                                    <th key={p._id} className={p._id === plan._id ? "comp-th-active" : "comp-th"}>
                                        {p._id === plan._id && <div className="comp-tu-plan">Tu plan</div>}
                                        {p.nombre}
                                    </th>
                                ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filas.map((fila) => (
                            <tr key={fila.nombre}>
                                <td className="comp-td-prestacion">{fila.nombre}</td>
                                {planes
                                    .slice()
                                    .sort((a, b) =>
                                        TODOS_LOS_PLANES_ORDEN.indexOf(a.nombre) - TODOS_LOS_PLANES_ORDEN.indexOf(b.nombre)
                                    )
                                    .map((p) => (
                                        <td key={p._id} className={p._id === plan._id ? "comp-td-active" : "comp-td"}>
                        <span className={`comp-badge nivel-${claseNivel(fila[p._id])}`}>
                          <IconoNivel nivel={fila[p._id]}/>
                            {textoNivel(fila[p._id])}
                        </span>
                                        </td>
                                    ))}
                            </tr>
                        ))}
                        {filas.length === 0 && (
                            <tr>
                                <td colSpan={planes.length + 1} className="comp-empty">
                                    No hay datos de cobertura disponibles.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="comparativa-leyenda">
                    <span className="leyenda-item">
                        <span className="comp-badge nivel-total">
                            <LuCircleCheck className="nivel-icon total"/>
                            Total
                        </span>
                        Cubierto al 100%
                    </span>

                    <span className="leyenda-item">
                        <span className="comp-badge nivel-partial">
                            <LuCircleDashed className="nivel-icon partial"/>
                            Parcial
                        </span>
                        Cobertura parcial
                    </span>

                    <span className="leyenda-item">
                        <span className="comp-badge nivel-none">
                            <LuCircleX className="nivel-icon none"/>
                            No cubierta
                        </span>
                        No incluido
                    </span>
                </div>
            </section>

            {/* ── BOTÓN VOLVER ─────────────────────────────────── */}
            <div className="detalle-back-wrap">
                <Link href="/planes" className="detalle-back-btn">← Volver a todos los planes</Link>
            </div>
        </div>
    );
}
