"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { RolUsuario } from "@/lib/roles";
import { obtenerAgendaMedico } from "@/lib/medicoApi";
import { getApiErrorMessage } from "@/lib/api";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import styles from "./page.module.css";

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
    const [cargandoAgenda, setCargandoAgenda] = useState(true);
    const [error, setError] = useState("");

    const buscarAgenda = useCallback(async () => {
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
    }, [filtros]);

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

    useEffect(() => {
        if (cargando || !usuario || !esMedico) return;

        let cancelado = false;

        async function cargarAgendaInicial() {
            try {
                const data = await obtenerAgendaMedico({
                    fechaDesde: "",
                    fechaHasta: "",
                    estado: "",
                });

                if (cancelado) return;

                setTurnos(data);
            } catch (err) {
                if (cancelado) return;

                setError(
                    getApiErrorMessage(
                        err,
                        "No pudimos cargar la agenda médica."
                    )
                );
            } finally {
                if (!cancelado) {
                    setCargandoAgenda(false);
                }
            }
        }

        cargarAgendaInicial();

        return () => {
            cancelado = true;
        };
    }, [cargando, usuario, esMedico]);

    const handleBuscarAgenda = async () => {
        setCargandoAgenda(true);
        setError("");
        await buscarAgenda();
    };

    if (cargando || !usuario || !esMedico) {
        return (
            <div className={styles.loading}>
                <Spinner size={36} />
                <span>Preparando agenda...</span>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <Link href="/medico" className={styles.backLink}>
                ← Volver al panel médico
            </Link>

            <div className={styles.header}>
                <h1 className={styles.title}>Agenda médica</h1>

                <p className={styles.description}>
                    Consultá tus turnos generados, filtrando por fecha y estado.
                </p>
            </div>

            <section className={`glass ${styles.filters}`}>
                <div className={styles.field}>
                    <label>Fecha desde</label>
                    <input
                        type="date"
                        value={filtros.fechaDesde}
                        onChange={(e) =>
                            setFiltros((f) => ({
                                ...f,
                                fechaDesde: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className={styles.field}>
                    <label>Fecha hasta</label>
                    <input
                        type="date"
                        value={filtros.fechaHasta}
                        onChange={(e) =>
                            setFiltros((f) => ({
                                ...f,
                                fechaHasta: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className={styles.field}>
                    <label>Estado</label>
                    <select
                        value={filtros.estado}
                        onChange={(e) =>
                            setFiltros((f) => ({
                                ...f,
                                estado: e.target.value,
                            }))
                        }
                    >
                        {ESTADOS.map((estado) => (
                            <option key={estado} value={estado}>
                                {estado || "Todos"}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleBuscarAgenda}
                    disabled={cargandoAgenda}
                    className={styles.searchButton}
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
                <div className={styles.centered}>
                    <Spinner size={32} />
                </div>
            ) : turnos.length === 0 ? (
                <div className={styles.emptyState}>
                    <h2>No hay turnos para mostrar</h2>
                    <p>
                        Probá cambiando los filtros o generando nuevas
                        disponibilidades.
                    </p>
                </div>
            ) : (
                <div className={styles.list}>
                    {turnos.map((turno) => (
                        <article key={turno._id} className={styles.card}>
                            <div>
                                <strong className={styles.date}>
                                    {formatearFecha(turno.fechaHoraInicio)}
                                </strong>
                                <div className={styles.muted}>
                                    hasta {formatearFecha(turno.fechaHoraFin)}
                                </div>
                            </div>

                            <div>
                                <strong>{obtenerServicio(turno)}</strong>
                                <div className={styles.muted}>
                                    {turno.tipoServicio}
                                </div>
                            </div>

                            <div>
                                <strong>{turno.sede?.nombre ?? "Sin sede"}</strong>
                                <div className={styles.muted}>
                                    Paciente:{" "}
                                    {turno.paciente?.nombre ?? "Sin asignar"}
                                </div>
                            </div>

                            <span className={styles.status}>{turno.estado}</span>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
