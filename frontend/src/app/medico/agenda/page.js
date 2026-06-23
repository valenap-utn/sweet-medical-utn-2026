"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { RolUsuario } from "@/lib/roles";
import { obtenerAgendaMedico } from "@/lib/turnosApi";
import { getApiErrorMessage } from "@/lib/api";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";

const ESTADOS = [
    "",
    "Disponible",
    "Reservado",
    "Confirmado",
    "Cancelado",
];

function formatearFecha(fecha) {
    if (!fecha) return "-";

    return new Date(fecha).toLocaleString("es-AR", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

function obtenerServicio(turno) {
    if (turno.tipoServicio === "PRACTICA") {
        return turno.practica?.nombre ?? "Práctica";
    }

    return turno.especialidad?.nombre ?? "Especialidad";
}

export default function AgendaMedicoPage() {
    const router = useRouter();
    const { usuario, cargando } = useAuth();

    const esMedico = usuario?.rol === RolUsuario.MEDICO;

    const [filtros, setFiltros] = useState({
        fechaDesde: "",
        fechaHasta: "",
        estado: "",
    });

    const [turnos, setTurnos] = useState([]);
    const [cargandoAgenda, setCargandoAgenda] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (cargando) return;

        if (!usuario) {
            router.replace("/login");
            return;
        }

        if (!esMedico) {
            router.replace("/perfil");
        }
    }, [cargando, usuario, esMedico, router]);

    const buscarAgenda = async () => {
        setCargandoAgenda(true);
        setError("");

        try {
            const data = await obtenerAgendaMedico(filtros);
            setTurnos(data);
        } catch (err) {
            setError(
                getApiErrorMessage(
                    err,
                    "No pudimos cargar la agenda médica."
                )
            );
        } finally {
            setCargandoAgenda(false);
        }
    };

    useEffect(() => {
        if (!cargando && usuario && esMedico) {
            buscarAgenda();
        }
    }, [cargando, usuario, esMedico]);

    if (cargando || !usuario || !esMedico) {
        return (
            <div style={{
                minHeight: "60vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 12,
            }}>
                <Spinner size={36} />
                <span>Preparando agenda...</span>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "40px" }}>
            <Link
                href="/medico"
                style={{
                    color: "var(--p)",
                    fontWeight: 700,
                    fontSize: 13,
                    textDecoration: "none",
                }}
            >
                ← Volver al panel médico
            </Link>

            <div style={{ marginTop: 24, marginBottom: 28 }}>
                <h1 style={{
                    fontFamily: "'Literata', serif",
                    color: "var(--p)",
                    marginBottom: 8,
                }}>
                    Agenda médica
                </h1>

                <p style={{ color: "var(--secondary)", fontSize: 14 }}>
                    Consultá tus turnos generados, filtrando por fecha y estado.
                </p>
            </div>

            <section
                className="glass"
                style={{
                    borderRadius: 18,
                    padding: 22,
                    marginBottom: 24,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr auto",
                    gap: 14,
                    alignItems: "end",
                }}
            >
                <div>
                    <label style={{ fontSize: 11, fontWeight: 700 }}>
                        Fecha desde
                    </label>
                    <input
                        type="date"
                        value={filtros.fechaDesde}
                        onChange={(e) =>
                            setFiltros((f) => ({ ...f, fechaDesde: e.target.value }))
                        }
                        style={{
                            width: "100%",
                            padding: 10,
                            borderRadius: 10,
                            border: "1px solid var(--outline-v)",
                        }}
                    />
                </div>

                <div>
                    <label style={{ fontSize: 11, fontWeight: 700 }}>
                        Fecha hasta
                    </label>
                    <input
                        type="date"
                        value={filtros.fechaHasta}
                        onChange={(e) =>
                            setFiltros((f) => ({ ...f, fechaHasta: e.target.value }))
                        }
                        style={{
                            width: "100%",
                            padding: 10,
                            borderRadius: 10,
                            border: "1px solid var(--outline-v)",
                        }}
                    />
                </div>

                <div>
                    <label style={{ fontSize: 11, fontWeight: 700 }}>
                        Estado
                    </label>
                    <select
                        value={filtros.estado}
                        onChange={(e) =>
                            setFiltros((f) => ({ ...f, estado: e.target.value }))
                        }
                        style={{
                            width: "100%",
                            padding: 10,
                            borderRadius: 10,
                            border: "1px solid var(--outline-v)",
                            background: "#fff",
                        }}
                    >
                        {ESTADOS.map((estado) => (
                            <option key={estado} value={estado}>
                                {estado || "Todos"}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={buscarAgenda}
                    disabled={cargandoAgenda}
                    style={{
                        padding: "11px 18px",
                        borderRadius: 11,
                        border: "none",
                        background: "var(--p)",
                        color: "#fff",
                        fontWeight: 700,
                        cursor: cargandoAgenda ? "not-allowed" : "pointer",
                    }}
                >
                    {cargandoAgenda ? "Buscando..." : "Buscar"}
                </button>
            </section>

            {error && (
                <Alert type="error" style={{ marginBottom: 16 }}>
                    {error}
                </Alert>
            )}

            {cargandoAgenda ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                    <Spinner size={32} />
                </div>
            ) : turnos.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    padding: 48,
                    border: "1px solid var(--outline-v)",
                    borderRadius: 18,
                    background: "#fff",
                }}>
                    <h2 style={{ color: "var(--p)" }}>No hay turnos para mostrar</h2>
                    <p style={{ color: "var(--secondary)" }}>
                        Probá cambiando los filtros o generando nuevas disponibilidades.
                    </p>
                </div>
            ) : (
                <div style={{ display: "grid", gap: 12 }}>
                    {turnos.map((turno) => (
                        <article
                            key={turno._id}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1.2fr 1fr 1fr 120px",
                                gap: 16,
                                alignItems: "center",
                                padding: 18,
                                borderRadius: 16,
                                border: "1px solid var(--outline-v)",
                                background: "#fff",
                            }}
                        >
                            <div>
                                <strong style={{ color: "var(--p)" }}>
                                    {formatearFecha(turno.fechaHoraInicio)}
                                </strong>
                                <div style={{ fontSize: 12, color: "var(--secondary)" }}>
                                    hasta {formatearFecha(turno.fechaHoraFin)}
                                </div>
                            </div>

                            <div>
                                <strong>{obtenerServicio(turno)}</strong>
                                <div style={{ fontSize: 12, color: "var(--secondary)" }}>
                                    {turno.tipoServicio}
                                </div>
                            </div>

                            <div>
                                <strong>{turno.sede?.nombre ?? "Sin sede"}</strong>
                                <div style={{ fontSize: 12, color: "var(--secondary)" }}>
                                    Paciente: {turno.paciente?.nombre ?? "Sin asignar"}
                                </div>
                            </div>

                            <span
                                style={{
                                    justifySelf: "end",
                                    padding: "6px 10px",
                                    borderRadius: 999,
                                    background: "var(--p-fixed)",
                                    color: "var(--p)",
                                    fontSize: 11,
                                    fontWeight: 700,
                                }}
                            >
                {turno.estado}
              </span>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}