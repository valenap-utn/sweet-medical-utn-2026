"use client";

import Link from "next/link";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {
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
        titulo: "Carrito de turnos",
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
                padding: "clamp(40px,6vw,72px) 0 clamp(32px,4vw,48px)"
            }}>
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg,#fdfaf8 0%,#f9eef0 45%,#f5e4e8 70%,#fdfaf8 100%)"
                }}/>

                <div style={{
                    position: "absolute",
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    background: "radial-gradient(circle,rgba(107,29,42,.12) 0%,transparent 70%)",
                    top: -120,
                    right: -80,
                    pointerEvents: "none"
                }}/>

                <div style={{
                    position: "absolute",
                    width: 340,
                    height: 340,
                    borderRadius: "50%",
                    background: "radial-gradient(circle,rgba(107,29,42,.07) 0%,transparent 70%)",
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
                            padding: "6px 14px",
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: ".07em",
                            textTransform: "uppercase",
                            color: "var(--p)",
                            marginBottom: 20
                        }}>
                            Tu salud, sin vueltas
                        </span>

                        <h1 style={{
                            fontFamily: "'Literata', serif",
                            fontSize: "clamp(32px,5vw,52px)",
                            fontWeight: 700,
                            color: "var(--p)",
                            lineHeight: 1.05,
                            letterSpacing: "-.025em",
                            marginBottom: 16
                        }}>
                            Gestioná tu atención<br/>
                            <span style={{color: "var(--p-mid)"}}>médica</span> en<br/>
                            un solo lugar
                        </h1>

                        <p style={{
                            fontSize: 16,
                            color: "var(--secondary)",
                            lineHeight: 1.65,
                            maxWidth: 430,
                            marginBottom: 28
                        }}>
                            Consultá disponibilidad, revisá tus turnos y accedé a tu información de salud desde un portal simple y claro.
                        </p>

                        <div style={{display: "flex", gap: 12, flexWrap: "wrap"}}>
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
                        </div>
                    </div>

                    <div className="glass" style={{
                        borderRadius: 24,
                        padding: 24,
                        boxShadow: "0 20px 60px rgba(107,29,42,.13)"
                    }}>
                        <div style={{
                            fontSize: 11,
                            fontWeight: 800,
                            color: "var(--secondary)",
                            textTransform: "uppercase",
                            letterSpacing: ".08em",
                            marginBottom: 10
                        }}>
                            Portal del paciente
                        </div>

                        <h2 style={{
                            fontFamily: "'Literata', serif",
                            fontSize: 24,
                            color: "var(--p)",
                            margin: "0 0 8px"
                        }}>
                            Accesos rápidos
                        </h2>

                        <p style={{
                            fontSize: 13,
                            color: "var(--secondary)",
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
                            <Link href="/turnos" className="quick-action">
                                <FaSearch size={16}/>
                                <div>
                                    <strong>Buscar turnos</strong>
                                    <span>Especialidades, prácticas y sedes</span>
                                </div>
                            </Link>

                            <Link href="/login" className="quick-action">
                                <FaUserCircle size={16}/>
                                <div>
                                    <strong>Ingresar</strong>
                                    <span>Accedé a tu cuenta</span>
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
                            <div key={number} className="glass wellness-card step-card">
                                <span>{number}</span>
                                <strong>{title}</strong>
                                <p>{desc}</p>
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
                    transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
                }

                .quick-action:hover {
                    transform: translateY(-1px);
                    border-color: rgba(107,29,42,.22);
                    box-shadow: 0 10px 24px rgba(107,29,42,.10);
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

                .how-it-works {
                    position: relative;
                    margin-top: 28px;
                    padding: clamp(52px, 6vw, 72px) var(--page-px);
                    background: linear-gradient(
                        180deg,
                        rgba(107,29,42,.035) 0%,
                        rgba(107,29,42,.06) 100%
                    );
                    border-top: 1px solid rgba(107,29,42,.08);
                    overflow: hidden;
                }

                .how-it-works::before {
                    content: "";
                    position: absolute;
                    width: 420px;
                    height: 420px;
                    border-radius: 50%;
                    background: radial-gradient(
                        circle,
                        rgba(107,29,42,.06) 0%,
                        transparent 72%
                    );
                    right: -120px;
                    top: -150px;
                    pointer-events: none;
                }

                .how-it-works-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 clamp(32px, 5vw, 60px);
                    box-sizing: border-box;
                    position: relative;
                    z-index: 1;
                }

                .how-it-works-header {
                    max-width: 560px;
                    margin-bottom: 28px;
                }

                .section-eyebrow {
                    display: inline-block;
                    font-size: 11px;
                    font-weight: 800;
                    color: var(--p);
                    text-transform: uppercase;
                    letter-spacing: .08em;
                    margin-bottom: 8px;
                }

                .how-it-works h2 {
                    font-family: 'Literata', serif;
                    font-size: clamp(24px, 3.2vw, 32px);
                    color: var(--p);
                    margin: 0 0 8px;
                }

                .how-it-works p {
                    color: var(--secondary);
                    line-height: 1.6;
                    margin: 0;
                }

                .steps-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 18px;
                }

                .step-card {
                    border-radius: 18px;
                    padding: 22px;
                }

                .step-card span {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 34px;
                    height: 34px;
                    border-radius: 999px;
                    background: var(--p);
                    color: #fff;
                    font-weight: 800;
                    margin-bottom: 14px;
                }

                .step-card strong {
                    display: block;
                    color: var(--p);
                    font-size: 15px;
                    margin-bottom: 6px;
                }

                .step-card p {
                    font-size: 13px;
                }
            `}</style>
        </div>
    );
}