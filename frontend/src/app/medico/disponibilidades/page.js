"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { RolUsuario } from "@/lib/roles";
import {
    crearDisponibilidadMedico,
    eliminarDisponibilidadMedico,
    obtenerDisponibilidadesMedico,
    obtenerServiciosMedico,
    obtenerSedesMedico,
} from "@/lib/medicoApi";
import { getApiErrorMessage } from "@/lib/api";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import styles from "./page.module.css";

const DIAS = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo",
];

const TIPOS_SERVICIO = [
    { value: "ESPECIALIDAD", label: "Especialidad" },
    { value: "PRACTICA", label: "Práctica" },
];

const estadoInicial = {
    diaSemana: "Lunes",
    horaDesde: "08:00",
    horaHasta: "10:00",
    sedeId: "",
    tipoServicio: "ESPECIALIDAD",
    servicio: "",
};

function obtenerId(valor) {
    return String(valor?._id ?? valor?.id ?? valor);
}

function buscarNombrePorId(items, id, fallback) {
    const item = items.find((i) => obtenerId(i) === obtenerId(id));
    return item?.nombre ?? fallback;
}

function armarDisponibilidadesParaMostrar(
    disponibilidades,
    sedes,
    especialidades,
    practicas
) {
    return disponibilidades.map((disponibilidad) => {
        const servicios =
            disponibilidad.tipoServicio === "PRACTICA"
                ? practicas
                : especialidades;

        return {
            ...disponibilidad,
            sedeNombre: buscarNombrePorId(
                sedes,
                disponibilidad.sede,
                "Sede"
            ),
            servicioNombre: buscarNombrePorId(
                servicios,
                disponibilidad.servicio,
                disponibilidad.tipoServicio
            ),
        };
    });
}

export default function DisponibilidadesMedicoPage() {
    const router = useRouter();
    const { usuario, cargando } = useAuth();

    const esMedico = usuario?.rol === RolUsuario.MEDICO;

    const [form, setForm] = useState(estadoInicial);

    const [disponibilidades, setDisponibilidades] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [practicas, setPracticas] = useState([]);

    const [cargandoDatos, setCargandoDatos] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    const cargarDatos = useCallback(async () => {
        try {
            const [
                disponibilidadesData,
                sedesData,
                serviciosData,
            ] = await Promise.all([
                obtenerDisponibilidadesMedico(),
                obtenerSedesMedico(),
                obtenerServiciosMedico(),
            ]);

            const especialidadesData = serviciosData.filter(s => s.tipoServicio === "ESPECIALIDAD");
            const practicasData = serviciosData.filter(s => s.tipoServicio === "PRACTICA");

            setDisponibilidades(
                armarDisponibilidadesParaMostrar(
                    disponibilidadesData,
                    sedesData,
                    especialidadesData,
                    practicasData
                )
            );
            setSedes(sedesData);
            setEspecialidades(especialidadesData);
            setPracticas(practicasData);
        } catch (err) {
            setError(
                getApiErrorMessage(
                    err,
                    "No pudimos cargar las disponibilidades."
                )
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

        async function cargarDatosIniciales() {
            try {
                const [
                    disponibilidadesData,
                    sedesData,
                    serviciosData,
                ] = await Promise.all([
                    obtenerDisponibilidadesMedico(),
                    obtenerSedesMedico(),
                    obtenerServiciosMedico(),
                ]);

                const especialidadesData = serviciosData.filter(s => s.tipoServicio === "ESPECIALIDAD");
                const practicasData = serviciosData.filter(s => s.tipoServicio === "PRACTICA");

                if (cancelado) return;

                setDisponibilidades(
                    armarDisponibilidadesParaMostrar(
                        disponibilidadesData,
                        sedesData,
                        especialidadesData,
                        practicasData
                    )
                );
                setSedes(sedesData);
                setEspecialidades(especialidadesData);
                setPracticas(practicasData);
            } catch (err) {
                if (cancelado) return;

                setError(
                    getApiErrorMessage(
                        err,
                        "No pudimos cargar las disponibilidades."
                    )
                );
            } finally {
                if (!cancelado) {
                    setCargandoDatos(false);
                }
            }
        }

        cargarDatosIniciales();

        return () => {
            cancelado = true;
        };
    }, [cargando, usuario, esMedico]);

    const serviciosDisponibles =
        form.tipoServicio === "PRACTICA" ? practicas : especialidades;

    const handleChange = (campo, valor) => {
        setForm((actual) => ({
            ...actual,
            [campo]: valor,
            ...(campo === "tipoServicio" ? { servicio: "" } : {}),
        }));
    };

    const validarForm = () => {
        if (!form.sedeId) return "Seleccioná una sede.";
        if (!form.servicio) return "Seleccioná un servicio.";
        if (!form.horaDesde) return "Indicá hora desde.";
        if (!form.horaHasta) return "Indicá hora hasta.";
        if (form.horaHasta <= form.horaDesde) {
            return "La hora hasta debe ser posterior a la hora desde.";
        }

        return "";
    };

    const crearDisponibilidad = async (e) => {
        e.preventDefault();

        setError("");
        setMensaje("");

        const errorValidacion = validarForm();

        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        setGuardando(true);

        try {
            await crearDisponibilidadMedico(form);

            setMensaje(
                "Disponibilidad creada correctamente. La agenda fue regenerada."
            );
            setForm(estadoInicial);
            setCargandoDatos(true);
            await cargarDatos();
        } catch (err) {
            setError(
                getApiErrorMessage(
                    err,
                    "No pudimos crear la disponibilidad."
                )
            );
        } finally {
            setGuardando(false);
        }
    };

    const eliminarDisponibilidad = async (disponibilidad) => {
        setError("");
        setMensaje("");

        const disponibilidadParaEliminar = {
            diaSemana: disponibilidad.diaSemana,
            horaDesde: disponibilidad.horaDesde,
            horaHasta: disponibilidad.horaHasta,
            sedeId: obtenerId(disponibilidad.sede),
            tipoServicio: disponibilidad.tipoServicio,
            servicio: obtenerId(disponibilidad.servicio),
        };

        try {
            await eliminarDisponibilidadMedico(disponibilidadParaEliminar);

            setMensaje(
                "Disponibilidad eliminada correctamente. La agenda fue regenerada."
            );
            setCargandoDatos(true);
            await cargarDatos();
        } catch (err) {
            setError(
                getApiErrorMessage(
                    err,
                    "No pudimos eliminar la disponibilidad."
                )
            );
        }
    };

    if (cargando || !usuario || !esMedico) {
        return (
            <div className={styles.loading}>
                <Spinner size={36} />
                <span>Preparando disponibilidades...</span>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <Link href="/medico" className={styles.backLink}>
                ← Volver al panel médico
            </Link>

            <div className={styles.header}>
                <h1 className={styles.title}>Disponibilidades</h1>

                <p className={styles.description}>
                    Definí los días, horarios, sedes y servicios en los que
                    atendés.
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

            <section className={`glass ${styles.formCard}`}>
                <form onSubmit={crearDisponibilidad} className={styles.formGrid}>
                    <div className={styles.field}>
                        <label>Día</label>
                        <select
                            value={form.diaSemana}
                            onChange={(e) =>
                                handleChange("diaSemana", e.target.value)
                            }
                        >
                            {DIAS.map((dia) => (
                                <option key={dia} value={dia}>
                                    {dia}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Hora desde</label>
                        <input
                            type="time"
                            value={form.horaDesde}
                            onChange={(e) =>
                                handleChange("horaDesde", e.target.value)
                            }
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Hora hasta</label>
                        <input
                            type="time"
                            value={form.horaHasta}
                            onChange={(e) =>
                                handleChange("horaHasta", e.target.value)
                            }
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Sede</label>
                        <select
                            value={form.sedeId}
                            onChange={(e) =>
                                handleChange("sedeId", e.target.value)
                            }
                        >
                            <option value="">Seleccionar sede</option>
                            {sedes.map((sede) => (
                                <option key={sede._id} value={sede._id}>
                                    {sede.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Tipo de servicio</label>
                        <select
                            value={form.tipoServicio}
                            onChange={(e) =>
                                handleChange("tipoServicio", e.target.value)
                            }
                        >
                            {TIPOS_SERVICIO.map((tipo) => (
                                <option key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Servicio</label>
                        <select
                            value={form.servicio}
                            onChange={(e) =>
                                handleChange("servicio", e.target.value)
                            }
                        >
                            <option value="">Seleccionar servicio</option>
                            {serviciosDisponibles.map((servicio) => (
                                <option key={servicio._id} value={servicio._id}>
                                    {servicio.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={guardando}
                        className={styles.submitButton}
                    >
                        {guardando ? "Guardando..." : "Crear disponibilidad"}
                    </button>
                </form>
            </section>

            {cargandoDatos ? (
                <div className={styles.centered}>
                    <Spinner size={32} />
                </div>
            ) : disponibilidades.length === 0 ? (
                <div className={styles.emptyState}>
                    <h2>No tenés disponibilidades cargadas</h2>
                    <p>
                        Creá una disponibilidad para que el sistema genere tu
                        agenda.
                    </p>
                </div>
            ) : (
                <div className={styles.list}>
                    {disponibilidades.map((disponibilidad, index) => (
                        <article
                            key={`${disponibilidad.diaSemana}-${disponibilidad.horaDesde}-${disponibilidad.horaHasta}-${index}`}
                            className={styles.card}
                        >
                            <div>
                                <strong className={styles.day}>
                                    {disponibilidad.diaSemana}
                                </strong>
                                <div className={styles.muted}>
                                    {disponibilidad.horaDesde} a{" "}
                                    {disponibilidad.horaHasta}
                                </div>
                            </div>

                            <div>
                                <strong>{disponibilidad.sedeNombre}</strong>
                            </div>

                            <div>
                                <strong>{disponibilidad.servicioNombre}</strong>
                                <div className={styles.muted}>
                                    {disponibilidad.tipoServicio}
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    eliminarDisponibilidad(disponibilidad)
                                }
                                className={styles.deleteButton}
                            >
                                Eliminar
                            </button>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
