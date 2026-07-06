"use client";

import Link from "next/link";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {
    FaArrowRight,
    FaCalendarAlt,
    FaCheckCircle,
    FaClipboardList,
    FaClock,
    FaSearch,
    FaUserCircle,
} from "react-icons/fa";

import {useAuth} from "@/context/AuthContext";
import {RolUsuario} from "@/lib/roles";

const FEATS = [
    {
        icon: FaClock,
        title: "Sin esperas",
        desc: "Reservas instantáneas con confirmación por email y SMS.",
    },
    {
        icon: FaClipboardList,
        title: "Atención integral",
        desc: "Historial clínico, resultados y cobertura en un solo lugar.",
    },
    {
        icon: FaCheckCircle,
        title: "Médicos verificados",
        desc: "Todos los profesionales certificados y evaluados por pacientes.",
    },
];

const ACCIONES_PACIENTE = [
    {
        titulo: "Buscar turnos",
        descripcion: "Buscá turnos disponibles filtrando por especialidad, práctica, médico y sede.",
        href: "/turnos",
    },
    {
        titulo: "Mis turnos",
        descripcion: "Revisá los turnos que preseleccionaste antes de confirmar la reserva.",
        href: "/carrito",
    },
    {
        titulo: "Planes",
        descripcion: "Consultá los planes de cobertura disponibles y elegí el que mejor se adapte a tus necesidades.",
        href: "/planes",
    },
    {
        titulo: "Historial",
        descripcion: "Revisá todos tus turnos anteriores y su estado final.",
        href: "/perfil?tab=historial",
    },
];

export default function HomePage() {
    const {usuario, cargando} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (cargando) return;

        if (usuario?.rol === RolUsuario.MEDICO) {
            router.replace("/medico");
        }
    }, [usuario, cargando, router]);

    if (cargando) return null;

    if (usuario?.rol === RolUsuario.MEDICO) {
        return null;
    }

    if (!usuario) {
        return <InicioPublico/>;
    }

    return <InicioPaciente usuario={usuario}/>;
}

function InicioPaciente({usuario}) {
    const nombrePaciente = usuario?.nombreUsuario ?? "Paciente";

    return (
        <main className="patient-home">
            <section className="patient-dashboard">
                <p className="patient-eyebrow">Portal del paciente</p>

                <h1>¡Hola, {nombrePaciente}!</h1>

                <p className="patient-subtitle">
                    Gestioná tus turnos, revisá tus reservas y accedé rápidamente a las acciones principales.
                </p>

                <div className="patient-actions-grid">
                    {ACCIONES_PACIENTE.map((accion) => (
                        <Link key={accion.titulo} href={accion.href} className="patient-action-link">
                            <div className="patient-action-card">
                                <div className="patient-action-content">
                                    <h2>{accion.titulo}</h2>
                                    <p>{accion.descripcion}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <style jsx>{`
                .patient-home {
                    min-height: calc(100vh - 150px);
                    background:
                        radial-gradient(circle at top right, rgba(107, 29, 42, 0.16), transparent 34%),
                        linear-gradient(135deg, #fdfaf8 0%, #f9eef0 48%, #fdfaf8 100%);
                    padding: clamp(36px, 6vw, 72px) var(--page-px);
                }

                .patient-dashboard {
                    max-width: 1120px;
                    margin: 0 auto;
                    background: rgba(255, 255, 255, 0.78);
                    border: 1px solid rgba(229, 189, 197, 0.95);
                    border-radius: 24px;
                    box-shadow: 0 22px 60px rgba(107, 29, 42, 0.14);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    padding: clamp(28px, 4vw, 44px);
                }

                .patient-eyebrow {
                    margin: 0 0 10px;
                    color: var(--secondary);
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                .patient-dashboard h1 {
                    margin: 0;
                    color: var(--p);
                    font-family: var(--font-display);
                    font-size: clamp(32px, 4vw, 44px);
                    font-weight: 700;
                    line-height: 1.1;
                    letter-spacing: -0.03em;
                }

                .patient-subtitle {
                    max-width: 620px;
                    margin: 12px 0 30px;
                    color: var(--secondary);
                    font-size: 16px;
                    line-height: 1.6;
                }

                .patient-actions-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 22px;
                }

                .patient-action-link {
                    display: block;
                    color: inherit;
                    text-decoration: none;
                }

                .patient-action-card {
                    min-height: 128px;
                    display: flex;
                    align-items: flex-start;
                    padding: 24px;
                    background: #ffffff;
                    border: 2px solid #ead1d7;
                    border-radius: 22px;
                    box-shadow:
                        0 12px 28px rgba(107, 29, 42, 0.10),
                        0 2px 8px rgba(107, 29, 42, 0.05);
                    transition:
                        transform 0.18s ease,
                        box-shadow 0.18s ease,
                        border-color 0.18s ease,
                        background 0.18s ease;
                }

                .patient-action-card:hover {
                    transform: translateY(-4px);
                    background: #fffafb;
                    border-color: #b76d7c;
                    box-shadow:
                        0 18px 38px rgba(107, 29, 42, 0.18),
                        0 4px 12px rgba(107, 29, 42, 0.08);
                }

                .patient-action-content h2 {
                    margin: 0 0 10px;
                    color: var(--p);
                    font-size: 19px;
                    font-weight: 800;
                    line-height: 1.2;
                }

                .patient-action-content p {
                    margin: 0;
                    color: var(--on-surf-v);
                    font-size: 15px;
                    line-height: 1.45;
                }

                @media (max-width: 720px) {
                    .patient-actions-grid {
                        grid-template-columns: 1fr;
                    }

                    .patient-action-card {
                        min-height: auto;
                    }
                }

                @media (max-width: 520px) {
                    .patient-home {
                        padding: 24px 16px;
                    }

                    .patient-dashboard {
                        padding: 24px;
                        border-radius: 20px;
                    }

                    .patient-action-card {
                        padding: 20px;
                    }
                }
            `}</style>
        </main>
    );
}

function InicioPublico() {
    return (
        <div>
            <section style={{
                position: "relative",
                overflow: "hidden",
                padding: "clamp(40px,6vw,72px) 0 clamp(32px,4vw,48px)",
                background: "#6b1d2a"
            }}>
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, #6b1d2a 0%, #5a172a 50%, #4a1524 100%)"
                }}/>

                <div style={{
                    position: "absolute",
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    background: "radial-gradient(circle,rgba(255,255,255,.04) 0%,transparent 70%)",
                    top: -120,
                    right: -80,
                    pointerEvents: "none"
                }}/>

                <div style={{
                    position: "absolute",
                    width: 340,
                    height: 340,
                    borderRadius: "50%",
                    background: "radial-gradient(circle,rgba(255,255,255,.02) 0%,transparent 70%)",
                    bottom: -80,
                    left: 20,
                    pointerEvents: "none"
                }}/>

                <div className="hero-grid" style={{
                    position: "relative",
                    zIndex: 1,
                    maxWidth: "var(--page-max)",
                    margin: "0 auto",
                    padding: "0 var(--page-px)",
                    display: "grid",
                    gridTemplateColumns: "minmax(0,1fr) min(310px,40%)",
                    gap: "clamp(32px,5vw,64px)",
                    alignItems: "center"
                }}>
                    <div>
                        <span className="glass-rose" style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 16px",
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: ".08em",
                            textTransform: "uppercase",
                            color: "#fff",
                            marginBottom: 20,
                            border: "1.5px solid rgba(255,255,255,.4)",
                            background: "rgba(255,255,255,.08)"
                        }}>
                            Tu salud, sin vueltas
                        </span>

                        <h1 style={{
                            fontFamily: "'Literata', serif",
                            fontSize: "clamp(32px,5vw,52px)",
                            fontWeight: 700,
                            color: "#fff",
                            lineHeight: 1.05,
                            letterSpacing: "-.025em",
                            marginBottom: 16
                        }}>
                            Gestioná tu atención<br/>
                            médica en<br/>
                            un solo lugar
                        </h1>

                        <p style={{
                            fontSize: 16,
                            color: "rgba(255,255,255,.85)",
                            lineHeight: 1.65,
                            maxWidth: 430,
                            marginBottom: 28
                        }}>
                            Consultá disponibilidad, revisá tus turnos y accedé a tu información de salud desde un portal simple y claro.
                        </p>

                        <div style={{display: "flex", gap: 12, flexWrap: "wrap"}}>
                            <Link
                                href="/login"
                                className="hero-btn-primary"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "14px 32px",
                                    background: "#fff",
                                    color: "#6b1d2a",
                                    fontWeight: 700,
                                    borderRadius: 999,
                                    fontSize: 15,
                                    textDecoration: "none",
                                    border: "2px solid #fff",
                                    boxShadow: "0 8px 28px rgba(0,0,0,.2)",
                                    transition: "all .3s ease",
                                    cursor: "pointer"
                                }}
                            >
                                <FaArrowRight size={14}/>
                                Comenzar
                            </Link>
                        </div>
                    </div>

                    <div className="glass" style={{
                        borderRadius: 24,
                        padding: 24,
                        boxShadow: "0 20px 60px rgba(0,0,0,.15)",
                        background: "rgba(255,255,255,.92)",
                        backdropFilter: "blur(16px)",
                        border: "1.5px solid rgba(255,255,255,.6)"
                    }}>
                        <div style={{
                            fontSize: 11,
                            fontWeight: 800,
                            color: "#8a8a8a",
                            textTransform: "uppercase",
                            letterSpacing: ".08em",
                            marginBottom: 10
                        }}>
                            Portal del paciente
                        </div>

                        <h2 style={{
                            fontFamily: "'Literata', serif",
                            fontSize: 24,
                            color: "#6b1d2a",
                            margin: "0 0 8px"
                        }}>
                            Accesos rápidos
                        </h2>

                        <p style={{
                            fontSize: 13,
                            color: "#999",
                            lineHeight: 1.5,
                            margin: "0 0 18px"
                        }}>
                            Ingresá directamente a las acciones principales de Sweet Medical.
                        </p>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr",
                            gap: 10
                        }}>
                            <Link href="/registro" className="quick-action">
                                <FaUserCircle size={16}/>
                                <div>
                                    <strong>Crear cuenta</strong>
                                    <span>Comenzá a usar Sweet Medical</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{
                padding: "clamp(32px,5vw,64px) var(--page-px)",
                maxWidth: 1200,
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: "clamp(12px,2vw,24px)"
            }}>
                {FEATS.map((f) => (
                    <div key={f.title} className="glass wellness-card" style={{borderRadius: 18, padding: 22}}>
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
                            <f.icon size={20}/>
                        </div>

                        <div style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "var(--p)",
                            marginBottom: 4
                        }}>
                            {f.title}
                        </div>

                        <div style={{
                            fontSize: 13,
                            color: "var(--secondary)",
                            lineHeight: 1.55
                        }}>
                            {f.desc}
                        </div>
                    </div>
                ))}
            </section>

            <section className="how-it-works">
                <div className="how-it-works-container">
                    <div className="how-it-works-header">
                        <span className="section-eyebrow">Reserva online</span>

                        <h2>¿Cómo funciona Sweet Medical?</h2>

                        <p>
                            El proceso está pensado para que puedas encontrar atención médica,
                            revisar la información del turno y confirmar tu reserva en pocos pasos.
                        </p>
                    </div>

                    <div className="steps-grid">
                        {[
                            ["1", "Buscá", "Filtrá por especialidad, práctica, sede o fecha."],
                            ["2", "Elegí", "Revisá horarios disponibles y costo estimado según tu cobertura."],
                            ["3", "Reservá", "Confirmá el turno y consultalo luego desde tu perfil."],
                        ].map(([number, title, desc]) => (
                            <div key={number} className="step-card">
                                <span>{number}</span>
                                <div>
                                    <strong>{title}</strong>
                                    <p>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <style>{`
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
                }

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

                    .wellness-card {
                        padding: 16px !important;
                    }
                }

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

                    .wellness-card {
                        padding: 12px !important;
                    }
                }

                .quick-action {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 16px;
                    border-radius: 16px;
                    background: rgba(255,255,255,.72);
                    border: 1px solid rgba(107,29,42,.12);
                    color: var(--p);
                    text-decoration: none;
                    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease, background .2s ease;
                }

                .quick-action:hover {
                    transform: translateY(-2px);
                    border-color: rgba(107,29,42,.22);
                    box-shadow: 0 12px 32px rgba(107,29,42,.12);
                    background: rgba(255,255,255,.9);
                }

                .quick-action strong {
                    display: block;
                    font-size: 13px;
                    color: var(--p);
                    margin-bottom: 2px;
                }

                .quick-action span {
                    display: block;
                    font-size: 11px;
                    color: var(--secondary);
                    line-height: 1.35;
                }

                .hero-btn-primary {
                    background: #fff !important;
                    color: #6b1d2a !important;
                    border: 2px solid #fff !important;
                    box-shadow: 0 8px 28px rgba(0,0,0,.2) !important;
                    transition: all .3s ease !important;
                }

                .hero-btn-primary:hover {
                    background: rgba(255,255,255,.95) !important;
                    box-shadow: 0 12px 36px rgba(0,0,0,.25) !important;
                    transform: translateY(-2px) !important;
                }

                .hero-btn-primary:active {
                    transform: translateY(0) !important;
                }

                .how-it-works {
                    position: relative;
                    background:
                        linear-gradient(135deg, #fdfaf8 0%, #f9eef0 50%, #f5e4e8 100%);
                }

                .how-it-works-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: clamp(48px, 6vw, 80px) var(--page-px);
                }

                .how-it-works-header {
                    text-align: left;
                    margin-bottom: 64px;
                    max-width: 560px;
                }

                .section-eyebrow {
                    display: inline-block;
                    font-size: 11px;
                    font-weight: 800;
                    color: var(--p);
                    text-transform: uppercase;
                    letter-spacing: .12em;
                    margin-bottom: 12px;
                    opacity: 0.75;
                }

                .how-it-works h2 {
                    font-family: 'Literata', serif;
                    font-size: clamp(32px, 3.5vw, 40px);
                    color: var(--p);
                    margin: 0 0 16px;
                    font-weight: 700;
                    line-height: 1.1;
                }

                .how-it-works > div > p {
                    color: var(--secondary);
                    line-height: 1.7;
                    margin: 0;
                    font-size: 16px;
                }

                .steps-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    max-width: 620px;
                    position: relative;
                }

                .steps-grid::before {
                    content: '';
                    position: absolute;
                    left: 23px;
                    top: 60px;
                    bottom: 60px;
                    width: 1px;
                    background: linear-gradient(to bottom, var(--p), rgba(107, 29, 42, 0.1));
                }

                .step-card {
                    border-radius: 0;
                    padding: 48px 0;
                    display: flex;
                    gap: 28px;
                    align-items: flex-start;
                    background: none;
                    border: none;
                    box-shadow: none;
                    position: relative;
                }

                .step-card:first-child {
                    padding-top: 0;
                }

                .step-card:last-child {
                    padding-bottom: 0;
                }

                .step-card span {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 52px;
                    height: 52px;
                    min-width: 52px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--p) 0%, #6b1d2a 100%);
                    color: #fff;
                    font-weight: 800;
                    font-size: 20px;
                    flex-shrink: 0;
                    position: relative;
                    z-index: 2;
                    box-shadow: 0 8px 24px rgba(107, 29, 42, 0.18);
                }

                .step-card > div {
                    padding-top: 4px;
                }

                .step-card strong {
                    display: block;
                    color: var(--p);
                    font-size: 17px;
                    margin-bottom: 6px;
                    font-weight: 700;
                }

                .step-card p {
                    font-size: 15px;
                    color: var(--secondary);
                    margin: 0;
                    line-height: 1.6;
                    font-weight: 400;
                }

                @media (max-width: 640px) {
                    .how-it-works-container {
                        padding: clamp(32px, 4vw, 48px) var(--page-px);
                    }

                    .how-it-works-header {
                        margin-bottom: 40px;
                    }

                    .how-it-works h2 {
                        font-size: clamp(24px, 4vw, 32px);
                        margin: 0 0 12px;
                    }

                    .how-it-works > div > p {
                        font-size: 14px;
                    }

                    .steps-grid::before {
                        left: 19px;
                        top: 52px;
                        bottom: 52px;
                    }

                    .step-card {
                        padding: 36px 0;
                        gap: 20px;
                    }

                    .step-card:first-child {
                        padding-top: 0;
                    }

                    .step-card:last-child {
                        padding-bottom: 0;
                    }

                    .step-card span {
                        width: 44px;
                        height: 44px;
                        min-width: 44px;
                        font-size: 18px;
                    }

                    .step-card strong {
                        font-size: 15px;
                    }

                    .step-card p {
                        font-size: 13px;
                    }
                }
            `}</style>
        </div>
    );
}