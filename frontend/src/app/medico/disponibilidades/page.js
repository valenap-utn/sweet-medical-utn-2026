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
    obtenerEspecialidadesMedico,
    obtenerPracticasMedico,
    obtenerSedesMedico,
} from "@/lib/turnosApi";
import { getApiErrorMessage } from "@/lib/api";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";

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
                especialidadesData,
                practicasData,
            ] = await Promise.all([
                obtenerDisponibilidadesMedico(),
                obtenerSedesMedico(),
                obtenerEspecialidadesMedico(),
                obtenerPracticasMedico(),
            ]);

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
                    especialidadesData,
                    practicasData,
                ] = await Promise.all([
                    obtenerDisponibilidadesMedico(),
                    obtenerSedesMedico(),
                    obtenerEspecialidadesMedico(),
                    obtenerPracticasMedico(),
                ]);

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
            <div
                style={{
                    minHeight: "60vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 12,
                }}
            >
                <Spinner size={36} />
                <span>Preparando disponibilidades...</span>
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
                <h1
                    style={{
                        fontFamily: "'Literata', serif",
                        color: "var(--p)",
                        marginBottom: 8,
                    }}
                >
                    Disponibilidades
                </h1>

                <p style={{ color: "var(--secondary)", fontSize: 14 }}>
                    Definí los días, horarios, sedes y servicios en los que atendés.
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

            <section
                className="glass"
                style={{
                    borderRadius: 18,
                    padding: 22,
                    marginBottom: 24,
                }}
            >
                <form
                    onSubmit={crearDisponibilidad}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 14,
                        alignItems: "end",
                    }}
                >
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700 }}>
                            Día
                        </label>
                        <select
                            value={form.diaSemana}
                            onChange={(e) =>
                                handleChange("diaSemana", e.target.value)
                            }
                            style={{
                                width: "100%",
                                padding: 10,
                                borderRadius: 10,
                            }}
                        >
                            {DIAS.map((dia) => (
                                <option key={dia} value={dia}>
                                    {dia}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700 }}>
                            Hora desde
                        </label>
                        <input
                            type="time"
                            value={form.horaDesde}
                            onChange={(e) =>
                                handleChange("horaDesde", e.target.value)
                            }
                            style={{
                                width: "100%",
                                padding: 10,
                                borderRadius: 10,
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700 }}>
                            Hora hasta
                        </label>
                        <input
                            type="time"
                            value={form.horaHasta}
                            onChange={(e) =>
                                handleChange("horaHasta", e.target.value)
                            }
                            style={{
                                width: "100%",
                                padding: 10,
                                borderRadius: 10,
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700 }}>
                            Sede
                        </label>
                        <select
                            value={form.sedeId}
                            onChange={(e) =>
                                handleChange("sedeId", e.target.value)
                            }
                            style={{
                                width: "100%",
                                padding: 10,
                                borderRadius: 10,
                            }}
                        >
                            <option value="">Seleccionar sede</option>
                            {sedes.map((sede) => (
                                <option key={sede._id} value={sede._id}>
                                    {sede.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700 }}>
                            Tipo de servicio
                        </label>
                        <select
                            value={form.tipoServicio}
                            onChange={(e) =>
                                handleChange("tipoServicio", e.target.value)
                            }
                            style={{
                                width: "100%",
                                padding: 10,
                                borderRadius: 10,
                            }}
                        >
                            {TIPOS_SERVICIO.map((tipo) => (
                                <option key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700 }}>
                            Servicio
                        </label>
                        <select
                            value={form.servicio}
                            onChange={(e) =>
                                handleChange("servicio", e.target.value)
                            }
                            style={{
                                width: "100%",
                                padding: 10,
                                borderRadius: 10,
                            }}
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
                        style={{
                            padding: "11px 18px",
                            borderRadius: 11,
                            border: "none",
                            background: "var(--p)",
                            color: "#fff",
                            fontWeight: 700,
                            cursor: guardando ? "not-allowed" : "pointer",
                        }}
                    >
                        {guardando ? "Guardando..." : "Crear disponibilidad"}
                    </button>
                </form>
            </section>

            {cargandoDatos ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: 40,
                    }}
                >
                    <Spinner size={32} />
                </div>
            ) : disponibilidades.length === 0 ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: 48,
                        border: "1px solid var(--outline-v)",
                        borderRadius: 18,
                        background: "#fff",
                    }}
                >
                    <h2 style={{ color: "var(--p)" }}>
                        No tenés disponibilidades cargadas
                    </h2>
                    <p style={{ color: "var(--secondary)" }}>
                        Creá una disponibilidad para que el sistema genere tu agenda.
                    </p>
                </div>
            ) : (
                <div style={{ display: "grid", gap: 12 }}>
                    {disponibilidades.map((disponibilidad, index) => (
                        <article
                            key={`${disponibilidad.diaSemana}-${disponibilidad.horaDesde}-${disponibilidad.horaHasta}-${index}`}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr 140px",
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
                                    {disponibilidad.diaSemana}
                                </strong>
                                <div
                                    style={{
                                        fontSize: 12,
                                        color: "var(--secondary)",
                                    }}
                                >
                                    {disponibilidad.horaDesde} a{" "}
                                    {disponibilidad.horaHasta}
                                </div>
                            </div>

                            <div>
                                <strong>
                                    {disponibilidad.sedeNombre}
                                </strong>
                            </div>

                            <div>
                                <strong>
                                    {disponibilidad.servicioNombre}
                                </strong>
                                <div
                                    style={{
                                        fontSize: 12,
                                        color: "var(--secondary)",
                                    }}
                                >
                                    {disponibilidad.tipoServicio}
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    eliminarDisponibilidad(disponibilidad)
                                }
                                style={{
                                    justifySelf: "end",
                                    padding: "8px 12px",
                                    borderRadius: 10,
                                    border: "1px solid var(--outline-v)",
                                    background: "#fff",
                                    color: "var(--p)",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                }}
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