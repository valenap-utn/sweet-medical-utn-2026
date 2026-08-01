"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {getPlanes} from "@/lib/serviciosApi";
import {getApiErrorMessage} from "@/lib/api";
import {useAuth} from "@/context/AuthContext";
import Spinner from "@/components/ui/Spinner";
import Alert from "@/components/ui/Alert";
import "./planes.css";
import {
    LuCircleCheck,
    LuCircleDashed,
    LuCircleX,
} from "react-icons/lu";

const FALLBACK_PLANES = [
    {
        _id: "basic",
        nombre: "Basic",
        precio: 4500,
        descripcion: "Una cobertura simple para consultas esenciales y atención médica general.",
        features: ["Consultas médicas", "Especialidades básicas", "Urgencias 24 hs", "Descuentos parciales"],
        highlight: false,
    },
    {
        _id: "prem",
        nombre: "Premium",
        precio: 8900,
        descripcion: "Cobertura integral para acceder a una amplia red de profesionales.",
        features: ["Consultas médicas", "Especialidades", "Prácticas", "Medicamentos"],
        highlight: true,
    },
    {
        _id: "fam",
        nombre: "Familiar",
        precio: 14200,
        descripcion: "Pensado para grupos familiares que necesitan mayor alcance de cobertura.",
        features: ["Grupo familiar", "Pediatría", "Prácticas incluidas", "Mayor cobertura"],
        highlight: false,
    },
];

const COBERTURAS_FALLBACK = [
    {
        prestacion: "Cardiología",
        basic: "PARCIAL",
        prem: "TOTAL",
        fam: "TOTAL",
    },
    {
        prestacion: "Dermatología",
        basic: "NO_CUBIERTA",
        prem: "TOTAL",
        fam: "TOTAL",
    },
    {
        prestacion: "Laboratorio",
        basic: "TOTAL",
        prem: "TOTAL",
        fam: "TOTAL",
    },
    {
        prestacion: "Electrocardiograma",
        basic: "PARCIAL",
        prem: "TOTAL",
        fam: "TOTAL",
    },
    {
        prestacion: "Resonancia",
        basic: "NO_CUBIERTA",
        prem: "PARCIAL",
        fam: "TOTAL",
    },
];

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

function IconoNivel({nivel}) {
    const n = normalizarNivel(nivel);

    if (n === "TOTAL") {
        return <LuCircleCheck className="coverage-icon total"/>;
    }

    if (n === "PARCIAL") {
        return <LuCircleDashed className="coverage-icon partial"/>;
    }

    return <LuCircleX className="coverage-icon none"/>;
}

function obtenerCoberturas(plan) {
    return [
        ...(plan.coberturasEspecialidad ?? []).map((cobertura) => ({
            nombre: cobertura.especialidad?.nombre ?? cobertura.nombre ?? "Especialidad",
            nivel: cobertura.nivel,
        })),
        ...(plan.coberturasPractica ?? []).map((cobertura) => ({
            nombre: cobertura.practica?.nombre ?? cobertura.nombre ?? "Práctica",
            nivel: cobertura.nivel,
        })),
    ];
}

function generarFilasCobertura(planes) {
    const hayCoberturasReales = planes.some((plan) => obtenerCoberturas(plan).length > 0);

    if (!hayCoberturasReales) return COBERTURAS_FALLBACK;

    const prestaciones = new Set();

    planes.forEach((plan) => {
        obtenerCoberturas(plan).forEach((cobertura) => {
            prestaciones.add(cobertura.nombre);
        });
    });

    return Array.from(prestaciones).map((prestacion) => {
        const fila = {prestacion};

        planes.forEach((plan) => {
            const cobertura = obtenerCoberturas(plan).find((c) => c.nombre === prestacion);
            fila[plan._id] = cobertura?.nivel ?? "NO_CUBIERTA";
        });

        return fila;
    });
}

export default function PlanesPage() {
    const {usuario} = useAuth();
    const [planes, setPlanes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let activo = true;

        (async () => {
            try {
                const data = await getPlanes();

                if (activo) {
                    setPlanes(data.length ? data : FALLBACK_PLANES);
                }
            } catch (e) {
                if (activo) {
                    setError(getApiErrorMessage(e, "No pudimos cargar los planes."));
                    setPlanes(FALLBACK_PLANES);
                }
            } finally {
                if (activo) {
                    setCargando(false);
                }
            }
        })();

        return () => {
            activo = false;
        };
    }, []);

    const filasCobertura = generarFilasCobertura(planes);

    return (
        <div>
            <div className="planes-hero">
                <div className="planes-hero-bg"/>

                <div className="planes-hero-content">
                    <h1 className="planes-title">Planes de cobertura</h1>
                    <p className="planes-subtitle">
                        Elegí el plan que mejor se adapte a tus necesidades de salud y tu familia.
                    </p>
                </div>
            </div>

            <div className="planes-container">
                {error && (
                    <Alert type="info" style={{marginBottom: 20}}>
                        {error} Mostrando planes de referencia.
                    </Alert>
                )}

                {cargando ? (
                    <div style={{display: "flex", justifyContent: "center", padding: 56}}>
                        <Spinner size={32}/>
                    </div>
                ) : (
                    <>
                        <div className="planes-grid">
                            {planes.map((plan, i) => {
                                const hl = plan.highlight ?? i === 1;

                                return (
                                    <div key={plan._id} className={`plan-card ${hl ? "highlight" : ""}`}>
                                        {hl && <div className="plan-badge">Más elegido</div>}

                                        <div className="plan-name">{plan.nombre}</div>

                                        <p className="plan-description">
                                            {plan.descripcion ??
                                                "Cobertura médica para acceder a profesionales, especialidades y prácticas según tu plan."}
                                        </p>

                                        {plan.precio && (
                                            <div className="plan-price">
                                                ${plan.precio.toLocaleString("es-AR")}
                                                <span>/mes</span>
                                            </div>
                                        )}

                                        <div className="plan-features">
                                            {(plan.features ?? ["Consultas médicas", "Especialidades", "Prácticas", "Descuentos"]).map(
                                                (feature, fi) => (
                                                    <div key={fi} className="plan-feature">
                                                        <span className="plan-feature-check">✓</span>
                                                        <span>
                                                            {typeof feature === "string"
                                                                ? feature
                                                                : feature.nombre ?? "Cobertura médica"}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <section className="coverage-section">
                            <p className="coverage-eyebrow">Compará las coberturas</p>
                            <h2 className="coverage-title">Qué incluye cada plan</h2>
                            <p className="coverage-subtitle">
                                Revisá rápidamente qué prestaciones cuentan con cobertura total, parcial o no se
                                encuentran incluidas.
                            </p>

                            <div className="coverage-table-wrap">
                                <table className="coverage-table">
                                    <thead>
                                    <tr>
                                        <th>Prestación</th>
                                        {planes.map((plan) => (
                                            <th key={plan._id}>{plan.nombre}</th>
                                        ))}
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {filasCobertura.map((fila) => (
                                        <tr key={fila.prestacion}>
                                            <td>{fila.prestacion}</td>

                                            {planes.map((plan) => {
                                                const nivel = fila[plan._id];

                                                return (
                                                    <td key={plan._id}>
                                                            <span className={`coverage-badge ${claseNivel(nivel)}`}>
                                                                <IconoNivel nivel={nivel}/>
                                                                {textoNivel(nivel)}
                                                            </span>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="coverage-legend">
                                <span className="coverage-legend-item">
                                    <LuCircleCheck className="coverage-icon total"/>
                                    Cobertura total
                                </span>

                                <span className="coverage-legend-item">
                                    <LuCircleDashed className="coverage-icon partial"/>
                                    Cobertura parcial
                                </span>

                                <span className="coverage-legend-item">
                                    <LuCircleX className="coverage-icon none"/>
                                    No cubierta
                                </span>
                            </div>
                        </section>
                    </>
                )}

                {!usuario && (
                    <div className="glass-rose planes-cta">
                        <div>
                            <div className="planes-cta-title">¿Tenés obra social?</div>
                            <div className="planes-cta-text">
                                Podés asociar tu obra social y plan al crear tu cuenta. Accedés a descuentos automáticos en
                                cada turno.
                            </div>
                        </div>

                        <Link href="/registro" className="planes-cta-button">
                            Crear cuenta gratis
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}