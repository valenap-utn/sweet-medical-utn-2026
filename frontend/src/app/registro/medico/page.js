"use client";
import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {registrarMedico} from "@/lib/authApi";
import {getApiErrorMessage} from "@/lib/api";
import {PASSWORD_HELP, validarNombreUsuario, validarPassword} from "@/lib/validation";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import {FaEye, FaEyeSlash} from "react-icons/fa";

const IS = {
    width: "100%",
    padding: "11px 13px",
    borderRadius: 11,
    border: "1.5px solid var(--outline-v)",
    background: "#ffffff",
    color: "var(--on-surf)",
    fontSize: 14,
    fontFamily: "'Hanken Grotesk',system-ui,sans-serif",
    outline: "none"
};
const LB = {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: ".06em",
    color: "var(--on-surf-v)",
    display: "block",
    marginBottom: 6
};
const INITIAL = {nombre: "", matricula: "", nombreUsuario: "", password: "", confirmarPassword: ""};

export default function RegistroMedicoPage() {
    const router = useRouter();
    const [form, setForm] = useState(INITIAL);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((f) => ({...f, [name]: value}));
        setErrors((errs) => ({...errs, [name]: undefined}));
    };

    const validate = () => {
        const errs = {};
        if (!form.nombre.trim()) errs.nombre = "Ingresá tu nombre completo.";
        if (!form.matricula.trim()) errs.matricula = "Ingresá tu matrícula.";
        if (!validarNombreUsuario(form.nombreUsuario)) errs.nombreUsuario = "Mínimo 3 caracteres.";
        if (!validarPassword(form.password)) errs.password = PASSWORD_HELP;
        if (form.confirmarPassword !== form.password) errs.confirmarPassword = "Las contraseñas no coinciden.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        if (!validate()) return;
        setLoading(true);
        try {
            await registrarMedico({
                nombreUsuario: form.nombreUsuario.trim(),
                password: form.password,
                nombre: form.nombre.trim(),
                matricula: form.matricula.trim()
            });
            setSuccess(true);
            setTimeout(() => router.push("/login"), 1600);
        } catch (error) {
            setApiError(getApiErrorMessage(error, "No pudimos crear tu cuenta."));
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        {
            name: "nombre",
            label: "Nombre completo",
            type: "text",
            placeholder: "Ej: Dr. Juan Pérez",
            autoComplete: "name"
        },
        {
            name: "matricula",
            label: "Matrícula profesional",
            type: "text",
            placeholder: "Ej: MN123456",
            autoComplete: "off"
        },
        {
            name: "nombreUsuario",
            label: "Nombre de usuario",
            type: "text",
            placeholder: "Mínimo 3 caracteres",
            autoComplete: "username"
        },
        {
            name: "password",
            label: "Contraseña",
            type: "password",
            placeholder: "••••••••",
            autoComplete: "new-password",
            helper: PASSWORD_HELP
        },
        {
            name: "confirmarPassword",
            label: "Confirmar contraseña",
            type: "password",
            placeholder: "••••••••",
            autoComplete: "new-password"
        },
    ];

    return (
        <div style={{
            minHeight: "calc(100vh - 140px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 24px",
            background: "linear-gradient(135deg,#fdfaf8,#f9eef0 50%,#fdfaf8)"
        }}>
            <div style={{width: "100%", maxWidth: "min(440px,100%)"}}>
                <div style={{textAlign: "center", marginBottom: 28}}>
                    <div style={{
                        fontFamily: "'Literata', serif",
                        fontSize: 20,
                        fontWeight: 700,
                        color: "var(--p)",
                        marginBottom: 16
                    }}>Sweet Medical
                    </div>
                    <h1 style={{
                        fontFamily: "'Literata', serif",
                        fontSize: 26,
                        fontWeight: 700,
                        color: "var(--p)",
                        marginBottom: 5
                    }}>Registro de médico</h1>
                    <p style={{fontSize: 13, color: "var(--secondary)"}}>Completá tus datos profesionales para empezar a
                        atender pacientes.</p>
                </div>
                <div style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: "28px 32px",
                    boxShadow: "0 8px 32px rgba(107,29,42,.09)",
                    border: "1px solid var(--outline-v)"
                }}>
                    {success ? <Alert type="success">¡Cuenta creada! Redirigiendo al login...</Alert> : (
                        <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: 14}}
                              noValidate>
                            {apiError && <Alert type="error">{apiError}</Alert>}
                            {fields.map(({name, label, type, placeholder, autoComplete, helper}) => (
                                <div key={name}>
                                    <span style={LB}>{label} *</span>
                                    <div style={{position: "relative"}}>
                                        <input
                                            name={name}
                                            type={
                                                name === "password"
                                                    ? (mostrarPassword ? "text" : "password")
                                                    : name === "confirmarPassword"
                                                        ? (mostrarConfirmacion ? "text" : "password")
                                                        : type
                                            }
                                            autoComplete={autoComplete}
                                            placeholder={placeholder}
                                            value={form[name]}
                                            onChange={handleChange}
                                            style={{
                                                ...IS,
                                                paddingRight:
                                                    type === "password"
                                                        ? 52
                                                        : IS.paddingRight,
                                                borderColor: errors[name]
                                                    ? "#991b1b"
                                                    : "var(--outline-v)",
                                            }}
                                        />

                                        {type === "password" && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (name === "password") {
                                                        setMostrarPassword((v) => !v);
                                                    } else {
                                                        setMostrarConfirmacion((v) => !v);
                                                    }
                                                }}
                                                style={{
                                                    position: "absolute",
                                                    right: 12,
                                                    top: "50%",
                                                    transform: "translateY(-50%)",
                                                    width: 28,
                                                    height: 28,
                                                    border: "none",
                                                    color: "var(--p)",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    padding: 0,
                                                }}
                                            >
                                                {name === "password"
                                                    ? (mostrarPassword
                                                        ? <FaEyeSlash size={14}/>
                                                        : <FaEye size={14}/>)
                                                    : (mostrarConfirmacion
                                                        ? <FaEyeSlash size={14}/>
                                                        : <FaEye size={14}/>)
                                                }
                                            </button>
                                        )}
                                    </div>
                                    {helper && !errors[name] &&
                                        <p style={{fontSize: 11, color: "var(--secondary)", marginTop: 4}}>{helper}</p>}
                                    {errors[name] &&
                                        <p style={{fontSize: 11, color: "#991b1b", marginTop: 4}}>{errors[name]}</p>}
                                </div>
                            ))}
                            <button type="submit" disabled={loading} style={{
                                width: "100%",
                                padding: "13px 0",
                                background: "var(--p)",
                                color: "#fff",
                                fontWeight: 700,
                                borderRadius: 12,
                                fontSize: 14,
                                border: "2px solid var(--p)",
                                cursor: loading ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                fontFamily: "inherit",
                                opacity: loading ? .7 : 1,
                                marginTop: 4
                            }}>
                                {loading ? <Spinner size={16}/> : null} {loading ? "Creando cuenta..." : "Crear cuenta"}
                            </button>
                        </form>
                    )}
                </div>
                <p style={{textAlign: "center", fontSize: 13, color: "var(--secondary)", marginTop: 20}}>
                    ¿Ya tenés cuenta? <Link href="/login"
                                            style={{fontWeight: 700, color: "var(--p)", textDecoration: "none"}}>Iniciá
                    sesión</Link>
                </p>
            </div>
        </div>
    );
}
