"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { RolUsuario } from "@/lib/roles";
import {
    agregarEspecialidadMedico,
    agregarPracticaMedico,
    obtenerEspecialidadesMedico,
    obtenerPracticasMedico,
    quitarEspecialidadMedico,
    quitarPracticaMedico,
} from "@/lib/medicoApi";
import { getEspecialidades, getPracticas } from "@/lib/serviciosApi";
import { getApiErrorMessage } from "@/lib/api";
import Spinner from "@/components/ui/Spinner";
import styles from "./page.module.css";
import ConfirmActionModal from "@/components/common/ConfirmActionModal";
import { notify } from "@/lib/toast";

function obtenerId(valor) {
    return String(valor?._id ?? valor?.id ?? valor);
}

function filtrarNoAsociados(todos, asociados) {
    return todos.filter(
        (servicio) =>
            !asociados.some(
                (asociado) => obtenerId(asociado) === obtenerId(servicio)
            )
    );
}

function ServicioSection({
    titulo,
    descripcion,
    label,
    disponibles,
    asociados,
    seleccionado,
    onSeleccionar,
    onAgregar,
    onQuitar,
    guardando,
}) {
    return (
        <section className={styles.serviceCard}>
            <h2>{titulo}</h2>
            <p>{descripcion}</p>

            <form onSubmit={onAgregar} className={styles.addForm}>
                <div className={styles.field}>
                    <label>{label}</label>
                    <select
                        value={seleccionado}
                        onChange={(e) => onSeleccionar(e.target.value)}
                    >
                        <option value="">Seleccionar</option>
                        {disponibles.map((servicio) => (
                            <option key={servicio._id} value={servicio._id}>
                                {servicio.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={guardando || !seleccionado}
                    className={styles.primaryButton}
                >
                    Asociar
                </button>
            </form>

            {asociados.length === 0 ? (
                <div className={styles.empty}>
                    No tenés servicios asociados en esta categoría.
                </div>
            ) : (
                <div className={styles.list}>
                    {asociados.map((servicio) => (
                        <article key={servicio._id} className={styles.item}>
                            <div>
                                <div className={styles.itemName}>
                                    {servicio.nombre}
                                </div>
                                <div className={styles.itemMeta}>
                                    Duración:{" "}
                                    {servicio.duracionTurnoEnMins ?? "-"} min
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => onQuitar(servicio._id)}
                                disabled={guardando}
                                className={styles.secondaryButton}
                            >
                                Quitar
                            </button>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default function ServiciosMedicoPage() {
    const router = useRouter();
    const { usuario, cargando } = useAuth();

    const esMedico = usuario?.rol === RolUsuario.MEDICO;

    const [especialidadesMedico, setEspecialidadesMedico] = useState([]);
    const [practicasMedico, setPracticasMedico] = useState([]);
    const [todasEspecialidades, setTodasEspecialidades] = useState([]);
    const [todasPracticas, setTodasPracticas] = useState([]);

    const [especialidadSeleccionada, setEspecialidadSeleccionada] =
        useState("");
    const [practicaSeleccionada, setPracticaSeleccionada] = useState("");

    const [cargandoDatos, setCargandoDatos] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

    // Para ConfirmActionModal
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [accionPendiente, setAccionPendiente] = useState(null);

    const cargarDatos = useCallback(async () => {
        try {
            const [
                especialidadesMedicoData,
                practicasMedicoData,
                todasEspecialidadesData,
                todasPracticasData,
            ] = await Promise.all([
                obtenerEspecialidadesMedico(),
                obtenerPracticasMedico(),
                getEspecialidades(),
                getPracticas(),
            ]);

            setEspecialidadesMedico(especialidadesMedicoData);
            setPracticasMedico(practicasMedicoData);
            setTodasEspecialidades(todasEspecialidadesData);
            setTodasPracticas(todasPracticasData);
        } catch (err) {
            const mensaje = getApiErrorMessage(
                err,
                "No pudimos cargar los servicios."
            );

            setError(mensaje);
            notify.error(mensaje);
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

        async function cargarServiciosIniciales() {
            try {
                const [
                    especialidadesMedicoData,
                    practicasMedicoData,
                    todasEspecialidadesData,
                    todasPracticasData,
                ] = await Promise.all([
                    obtenerEspecialidadesMedico(),
                    obtenerPracticasMedico(),
                    getEspecialidades(),
                    getPracticas(),
                ]);

                if (cancelado) return;

                setEspecialidadesMedico(especialidadesMedicoData);
                setPracticasMedico(practicasMedicoData);
                setTodasEspecialidades(todasEspecialidadesData);
                setTodasPracticas(todasPracticasData);
            } catch (err) {
                if (cancelado) return;

                const mensaje = getApiErrorMessage(
                    err,
                    "No pudimos cargar los servicios."
                );

                setError(mensaje);
                notify.error(mensaje);
            } finally {
                if (!cancelado) {
                    setCargandoDatos(false);
                }
            }
        }

        cargarServiciosIniciales();

        return () => {
            cancelado = true;
        };
    }, [cargando, usuario, esMedico]);

    const especialidadesParaAgregar = filtrarNoAsociados(
        todasEspecialidades,
        especialidadesMedico
    );

    const practicasParaAgregar = filtrarNoAsociados(
        todasPracticas,
        practicasMedico
    );

    const agregarEspecialidad = async (e) => {
        e.preventDefault();

        if (!especialidadSeleccionada) return;

        setGuardando(true);
        setError("");

        try {
            await agregarEspecialidadMedico(especialidadSeleccionada);
            notify.success("Especialidad asociada correctamente.");
            setEspecialidadSeleccionada("");
            setCargandoDatos(true);
            await cargarDatos();
        } catch (err) {
            const mensaje = getApiErrorMessage(
                err,
                "No pudimos asociar la especialidad."
            );

            setError(mensaje);
            notify.error(mensaje);
        } finally {
            setGuardando(false);
        }
    };

    const agregarPractica = async (e) => {
        e.preventDefault();

        if (!practicaSeleccionada) return;

        setGuardando(true);
        setError("");

        try {
            await agregarPracticaMedico(practicaSeleccionada);
            notify.success("Práctica asociada correctamente.");
            setPracticaSeleccionada("");
            setCargandoDatos(true);
            await cargarDatos();
        } catch (err) {
            const mensaje = getApiErrorMessage(
                err,
                "No pudimos asociar la práctica."
            );

            setError(mensaje);
            notify.error(mensaje);
        } finally {
            setGuardando(false);
        }
    };

    const quitarEspecialidad = (especialidadId) => {
        setAccionPendiente({
            tipo: "especialidad",
            id: especialidadId,
        });

        setConfirmOpen(true);
    };

    const quitarPractica = (practicaId) => {
        setAccionPendiente({
            tipo: "practica",
            id: practicaId,
        });

        setConfirmOpen(true);
    };

    const confirmarEliminar = async () => {
        if (!accionPendiente) return;

        setGuardando(true);
        setError("");

        try {
            if (accionPendiente.tipo === "especialidad") {
                await quitarEspecialidadMedico(accionPendiente.id);
                notify.success("Especialidad quitada correctamente.");
            } else {
                await quitarPracticaMedico(accionPendiente.id);
                notify.success("Práctica quitada correctamente.");
            }

            setConfirmOpen(false);
            setAccionPendiente(null);

            setCargandoDatos(true);
            await cargarDatos();
        } catch (err) {
            const mensaje = getApiErrorMessage(
                err,
                accionPendiente.tipo === "especialidad"
                    ? "No pudimos quitar la especialidad."
                    : "No pudimos quitar la práctica."
            );

            setError(mensaje);
            notify.error(mensaje);
        } finally {
            setGuardando(false);
        }
    };

    if (cargando || !usuario || !esMedico) {
        return (
            <div className={styles.loading}>
                <Spinner size={36} />
                <span>Preparando servicios...</span>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {/*<Link href="/medico" className={styles.backLink}>
                ← Volver al panel médico
            </Link>*/}

            <div className={styles.header}>
                <h1 className={styles.title}>Servicios médicos</h1>
                <p className={styles.description}>
                    Asociá las especialidades y prácticas que ofrecés a tus
                    pacientes.
                </p>
            </div>

            {error && (
                <Alert type="error" style={{ marginBottom: 16 }}>
                    {error}
                </Alert>
            )}

            {cargandoDatos ? (
                <div className={styles.centered}>
                    <Spinner size={32} />
                </div>
            ) : (
                <div className={styles.sections}>
                    <ServicioSection
                        titulo="Especialidades"
                        descripcion="Gestioná las especialidades que atendés."
                        label="Especialidad"
                        disponibles={especialidadesParaAgregar}
                        asociados={especialidadesMedico}
                        seleccionado={especialidadSeleccionada}
                        onSeleccionar={setEspecialidadSeleccionada}
                        onAgregar={agregarEspecialidad}
                        onQuitar={quitarEspecialidad}
                        guardando={guardando}
                    />

                    <ServicioSection
                        titulo="Prácticas"
                        descripcion="Gestioná las prácticas que realizás."
                        label="Práctica"
                        disponibles={practicasParaAgregar}
                        asociados={practicasMedico}
                        seleccionado={practicaSeleccionada}
                        onSeleccionar={setPracticaSeleccionada}
                        onAgregar={agregarPractica}
                        onQuitar={quitarPractica}
                        guardando={guardando}
                    />
                </div>
            )}

            <ConfirmActionModal
                open={confirmOpen}
                title={
                    accionPendiente?.tipo === "especialidad"
                        ? "Quitar especialidad"
                        : "Quitar práctica"
                }
                message={
                    accionPendiente?.tipo === "especialidad"
                        ? "¿Querés quitar esta especialidad de tus servicios? Los turnos futuros asociados podrían verse afectados."
                        : "¿Querés quitar esta práctica de tus servicios? Los turnos futuros asociados podrían verse afectados."
                }
                confirmText="Quitar"
                cancelText="Cancelar"
                variant="danger"
                onCancel={() => {
                    setConfirmOpen(false);
                    setAccionPendiente(null);
                }}
                onConfirm={confirmarEliminar}
            />

        </div>
    );
}
