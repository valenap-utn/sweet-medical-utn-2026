"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { RolUsuario } from "@/lib/roles";
import {
    agregarSedeMedico,
    obtenerSedesMedico,
    quitarSedeMedico,
} from "@/lib/medicoApi";
import { getSedes } from "@/lib/serviciosApi";
import { getApiErrorMessage } from "@/lib/api";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import styles from "./page.module.css";

function obtenerId(valor) {
    return String(valor?._id ?? valor?.id ?? valor);
}

function filtrarNoAsociadas(todas, asociadas) {
    return todas.filter(
        (sede) =>
            !asociadas.some(
                (sedeAsociada) => obtenerId(sedeAsociada) === obtenerId(sede)
            )
    );
}

function buscarSedePorId(sedeId, sedes) {
    return sedes.find((sede) => obtenerId(sede) === obtenerId(sedeId));
}

export default function SedesMedicoPage() {
    const router = useRouter();
    const { usuario, cargando } = useAuth();

    const esMedico = usuario?.rol === RolUsuario.MEDICO;

    const [sedesMedico, setSedesMedico] = useState([]);
    const [todasSedes, setTodasSedes] = useState([]);
    const [sedeSeleccionada, setSedeSeleccionada] = useState("");

    const [cargandoDatos, setCargandoDatos] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    const cargarDatos = useCallback(async () => {
        try {
            const [sedesMedicoData, todasSedesData] = await Promise.all([
                obtenerSedesMedico(),
                getSedes(),
            ]);

            setSedesMedico(sedesMedicoData);
            setTodasSedes(todasSedesData);
        } catch (err) {
            setError(getApiErrorMessage(err, "No pudimos cargar las sedes."));
        } finally {
            setCargandoDatos(false);
        }
    }, []);

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

        async function cargarSedesIniciales() {
            try {
                const [sedesMedicoData, todasSedesData] = await Promise.all([
                    obtenerSedesMedico(),
                    getSedes(),
                ]);

                if (cancelado) return;

                setSedesMedico(sedesMedicoData);
                setTodasSedes(todasSedesData);
            } catch (err) {
                if (cancelado) return;

                setError(
                    getApiErrorMessage(err, "No pudimos cargar las sedes.")
                );
            } finally {
                if (!cancelado) {
                    setCargandoDatos(false);
                }
            }
        }

        cargarSedesIniciales();

        return () => {
            cancelado = true;
        };
    }, [cargando, usuario, esMedico]);

    const sedesParaAgregar = filtrarNoAsociadas(todasSedes, sedesMedico);

    const agregarSede = async (e) => {
        e.preventDefault();

        if (!sedeSeleccionada) return;

        setGuardando(true);
        setError("");
        setMensaje("");

        try {
            await agregarSedeMedico(sedeSeleccionada);
            setMensaje("Sede asociada correctamente.");
            setSedeSeleccionada("");
            setCargandoDatos(true);
            await cargarDatos();
        } catch (err) {
            setError(getApiErrorMessage(err, "No pudimos asociar la sede."));
        } finally {
            setGuardando(false);
        }
    };

    const quitarSede = async (sedeId) => {
        setGuardando(true);
        setError("");
        setMensaje("");

        try {
            await quitarSedeMedico(sedeId);
            setMensaje("Sede quitada correctamente.");
            setCargandoDatos(true);
            await cargarDatos();
        } catch (err) {
            setError(getApiErrorMessage(err, "No pudimos quitar la sede."));
        } finally {
            setGuardando(false);
        }
    };

    if (cargando || !usuario || !esMedico) {
        return (
            <div className={styles.loading}>
                <Spinner size={36} />
                <span>Preparando sedes...</span>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {/*<Link href="/medico" className={styles.backLink}>
                ← Volver al panel médico
            </Link>*/}

            <div className={styles.header}>
                <h1 className={styles.title}>Sedes</h1>
                <p className={styles.description}>
                    Asociá los centros de atención donde trabajás.
                </p>
            </div>

            {error && (
                <Alert type="error" style={{ marginBottom: 16 }}>
                    {error}
                </Alert>
            )}

            {mensaje && (
                <Alert type="success" style={{ marginBottom: 16 }}>
                    {mensaje}
                </Alert>
            )}

            {cargandoDatos ? (
                <div className={styles.centered}>
                    <Spinner size={32} />
                </div>
            ) : (
                <>
                    <section className={styles.card}>
                        <h2>Asociar sede</h2>
                        <p>Elegí una sede existente para sumarla a tu perfil.</p>

                        <form onSubmit={agregarSede} className={styles.addForm}>
                            <div className={styles.field}>
                                <label>Sede</label>
                                <select
                                    value={sedeSeleccionada}
                                    onChange={(e) =>
                                        setSedeSeleccionada(e.target.value)
                                    }
                                >
                                    <option value="">Seleccionar sede</option>
                                    {sedesParaAgregar.map((sede) => (
                                        <option key={sede._id} value={sede._id}>
                                            {sede.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={guardando || !sedeSeleccionada}
                                className={styles.primaryButton}
                            >
                                Asociar
                            </button>
                        </form>
                    </section>

                    <section className={styles.card}>
                        <h2>Sedes asociadas</h2>
                        <p>Estas son las sedes donde el médico puede atender.</p>

                        {sedesMedico.length === 0 ? (
                            <div className={styles.empty}>
                                No tenés sedes asociadas.
                            </div>
                        ) : (
                            <div className={styles.list}>
                                {sedesMedico.map((sedeMedico) => {
                                    const sede =
                                        sedeMedico.nombre
                                            ? sedeMedico
                                            : buscarSedePorId(
                                                  sedeMedico,
                                                  todasSedes
                                              );

                                    const sedeId = obtenerId(sedeMedico);

                                    return (
                                        <article
                                            key={sedeId}
                                            className={styles.item}
                                        >
                                            <div>
                                                <div
                                                    className={styles.itemName}
                                                >
                                                    {sede?.nombre ?? "Sede"}
                                                </div>
                                                <div
                                                    className={styles.itemMeta}
                                                >
                                                    {sede?.direccion ??
                                                        "Sin dirección cargada"}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    quitarSede(sedeId)
                                                }
                                                disabled={guardando}
                                                className={
                                                    styles.secondaryButton
                                                }
                                            >
                                                Quitar
                                            </button>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}
