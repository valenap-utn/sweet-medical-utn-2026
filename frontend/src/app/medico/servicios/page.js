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
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import styles from "./page.module.css";

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
    const [mensaje, setMensaje] = useState("");

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
            setError(
                getApiErrorMessage(err, "No pudimos cargar los servicios.")
            );
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

                setError(
                    getApiErrorMessage(
                        err,
                        "No pudimos cargar los servicios."
                    )
                );
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
        setMensaje("");

        try {
            await agregarEspecialidadMedico(especialidadSeleccionada);
            setMensaje("Especialidad asociada correctamente.");
            setEspecialidadSeleccionada("");
            setCargandoDatos(true);
            await cargarDatos();
        } catch (err) {
            setError(
                getApiErrorMessage(
                    err,
                    "No pudimos asociar la especialidad."
                )
            );
        } finally {
            setGuardando(false);
        }
    };

    const agregarPractica = async (e) => {
        e.preventDefault();

        if (!practicaSeleccionada) return;

        setGuardando(true);
        setError("");
        setMensaje("");

        try {
            await agregarPracticaMedico(practicaSeleccionada);
            setMensaje("Práctica asociada correctamente.");
            setPracticaSeleccionada("");
            setCargandoDatos(true);
            await cargarDatos();
        } catch (err) {
            setError(
                getApiErrorMessage(err, "No pudimos asociar la práctica.")
            );
        } finally {
            setGuardando(false);
        }
    };

    const quitarEspecialidad = async (especialidadId) => {
        setGuardando(true);
        setError("");
        setMensaje("");

        try {
            await quitarEspecialidadMedico(especialidadId);
            setMensaje("Especialidad quitada correctamente.");
            setCargandoDatos(true);
            await cargarDatos();
        } catch (err) {
            setError(
                getApiErrorMessage(err, "No pudimos quitar la especialidad.")
            );
        } finally {
            setGuardando(false);
        }
    };

    const quitarPractica = async (practicaId) => {
        setGuardando(true);
        setError("");
        setMensaje("");

        try {
            await quitarPracticaMedico(practicaId);
            setMensaje("Práctica quitada correctamente.");
            setCargandoDatos(true);
            await cargarDatos();
        } catch (err) {
            setError(
                getApiErrorMessage(err, "No pudimos quitar la práctica.")
            );
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
        </div>
    );
}
