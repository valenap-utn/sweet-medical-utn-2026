"use client";
import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/AuthContext";
import {getApiErrorMessage} from "@/lib/api";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import {RolUsuario} from "@/lib/roles";
import {
    FaArrowRight,
    FaCheck,
    FaEye,
    FaEyeSlash,
    FaLock,
    FaUser,
    FaUserPlus,
} from "react-icons/fa";

const S = {
    label: {
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: ".06em",
        color: "var(--on-surf-v)",
        display: "block",
        marginBottom: 6
    },

    inputWrap: {position: "relative"},

    input: {
        width: "100%",
        padding: "11px 13px 11px 36px",
        borderRadius: 11,
        border: "1.5px solid var(--outline-v)",
        background: "#fff",
        color: "var(--on-surf)",
        fontSize: 14,
        fontFamily: "'Hanken Grotesk',system-ui,sans-serif",
        outline: "none",
        transition: "border .2s"
    },

    icon: {
        position: "absolute",
        left: 12,
        top: "50%",
        transform: "translateY(-50%)",
        color: "var(--on-surf-v)",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
    },

    inputPassword: {
        width: "100%",
        padding: "11px 42px 11px 36px",
        borderRadius: 11,
        border: "1.5px solid var(--outline-v)",
        background: "#fff",
        color: "var(--on-surf)",
        fontSize: 14,
        fontFamily: "'Hanken Grotesk',system-ui,sans-serif",
        outline: "none",
        transition: "border .2s",
    },

    eyeButton: {
        position: "absolute",
        right: 10,
        top: "50%",
        transform: "translateY(-50%)",
        border: "none",
        background: "transparent",
        color: "var(--on-surf-v)",
        cursor: "pointer",
        padding: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
};

export default function LoginPage() {
    const router = useRouter();
    const {login} = useAuth();
    const [form, setForm] = useState({nombreUsuario: "", password: ""});
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const currentYear = new Date().getFullYear();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((f) => ({...f, [name]: value}));
        setErrors((errs) => ({...errs, [name]: undefined}));
    };

    const validate = () => {
        const errs = {};
        if (!form.nombreUsuario.trim()) errs.nombreUsuario = "Ingresá tu nombre de usuario.";
        if (!form.password) errs.password = "Ingresá tu contraseña.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        if (!validate()) return;
        setLoading(true);
        try {
            const data = await login(form);
            const rol = data.usuario?.rol;

            if (rol === RolUsuario.MEDICO) {
                router.push("/medico");
                return;
            }

            router.push("/turnos");
        } catch (error) {
            setApiError(
                getApiErrorMessage(
                    error,
                    "Datos incorrectos. Verificá e intentá de nuevo."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-layout" style={{minHeight: "calc(100vh - 140px)", display: "flex"}}>
            {/* Left panel */}
            <div className="login-side-panel" style={{
                width: "clamp(220px,42%,45%)",
                background: "var(--p)",
                padding: "clamp(28px,5vw,48px) clamp(24px,5vw,52px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}>
                <div style={{
                    fontFamily: "'Literata', serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "var(--p-fixed)"
                }}>Sweet Medical
                </div>
                <div>
                    <h2 style={{
                        fontFamily: "'Literata', serif",
                        fontSize: 36,
                        fontWeight: 700,
                        color: "var(--p-fixed)",
                        lineHeight: 1.15,
                        marginBottom: 14
                    }}>Tu salud,<br/>en buenas manos.</h2>
                    <p style={{fontSize: 14, color: "rgba(249,238,240,.72)", lineHeight: 1.6, marginBottom: 28}}>Accedé
                        a tu cuenta y gestioná tus turnos, historial y cobertura desde un solo lugar.</p>
                    {["Turnos disponibles al instante", "Historial médico completo", "Cobertura de obra social integrada"].map((f) => (
                        <div key={f} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            fontSize: 13,
                            color: "rgba(249,238,240,.8)",
                            marginBottom: 12
                        }}>
                            <div style={{
                                width: 24,
                                height: 24,
                                borderRadius: 8,
                                background: "rgba(255,255,255,.12)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0
                            }}>
                                <FaCheck size={12} />
                            </div>
                            {f}
                        </div>
                    ))}
                </div>
                <div style={{fontSize: 11, color: "rgba(249,238,240,.35)"}}>© {currentYear} Sweet Medical · UTN FRBA</div>
            </div>

            {/* Right panel */}
            <div style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "clamp(28px,5vw,48px) clamp(24px,5vw,52px)",
                background: "#fff"
            }}>
                <div style={{width: "100%", maxWidth: 380}}>
                    <h1 style={{
                        fontFamily: "'Literata', serif",
                        fontSize: 28,
                        fontWeight: 700,
                        color: "var(--p)",
                        marginBottom: 5
                    }}>Bienvenido de vuelta</h1>
                    <p style={{fontSize: 13, color: "var(--secondary)", marginBottom: 28}}>Iniciá sesión para gestionar
                        tus turnos.</p>

                    <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: 16}}
                          noValidate>
                        {apiError && <Alert type="error">{apiError}</Alert>}

                        <div>
                            <span style={S.label}>Nombre de usuario *</span>
                            <div style={S.inputWrap}>
                                <span style={S.icon}>
                                    <FaUser size={14}/>
                                </span>
                                <input name="nombreUsuario" type="text" autoComplete="username"
                                       placeholder="Tu nombre de usuario" value={form.nombreUsuario}
                                       onChange={handleChange} style={{
                                    ...S.input,
                                    borderColor: errors.nombreUsuario ? "#991b1b" : "var(--outline-v)"
                                }}/>
                            </div>
                            {errors.nombreUsuario &&
                                <p style={{fontSize: 11, color: "#991b1b", marginTop: 4}}>{errors.nombreUsuario}</p>}
                        </div>

                        {/*<div>
                            <span style={S.label}>Contraseña *</span>
                            <div style={S.inputWrap}>
                                <span style={S.icon}>🔒</span>
                                <input name="password" type="password" autoComplete="current-password"
                                       placeholder="••••••••" value={form.password} onChange={handleChange} style={{
                                    ...S.input,
                                    borderColor: errors.password ? "#991b1b" : "var(--outline-v)"
                                }}/>
                            </div>
                            {errors.password &&
                                <p style={{fontSize: 11, color: "#991b1b", marginTop: 4}}>{errors.password}</p>}
                        </div>*/}

                        <div style={S.inputWrap}>
                              <span style={S.icon}>
                                <FaLock size={14}/>
                              </span>

                            <input
                                name="password"
                                type={mostrarPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="Ingresá tu contraseña"
                                value={form.password}
                                onChange={handleChange}
                                style={{
                                    ...S.inputPassword,
                                    borderColor: errors.password ? "#991b1b" : "var(--outline-v)",
                                }}
                            />

                            <button
                                type="button"
                                onClick={() => setMostrarPassword((v) => !v)}
                                aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                style={S.eyeButton}
                            >
                                {mostrarPassword ? <FaEyeSlash size={15}/> : <FaEye size={15}/>}
                            </button>
                        </div>

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
                            {/*{loading ? <Spinner size={16}/> : "→"} {loading ? "Ingresando..." : "Iniciar sesión"}*/}
                            {loading ? <Spinner size={16} /> : <FaArrowRight size={14} />}
                            {loading ? "Ingresando..." : "Iniciar sesión"}
                        </button>

                        <div style={{display: "flex", alignItems: "center", gap: 10, margin: "4px 0"}}>
                            <div style={{flex: 1, borderTop: "1px solid var(--outline-v)"}}/>
                            <span style={{fontSize: 11, color: "var(--secondary)"}}>¿No tenés cuenta?</span>
                            <div style={{flex: 1, borderTop: "1px solid var(--outline-v)"}}/>
                        </div>

                        <Link href="/registro" style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: 44,
                            gap: 8,
                            padding: "12px 0",
                            background: "transparent",
                            border: "2px solid var(--p)",
                            color: "var(--p)",
                            fontWeight: 700,
                            borderRadius: 12,
                            fontSize: 13,
                            textDecoration: "none"
                        }}>
                            <FaUserPlus size={14} />
                            Crear cuenta
                        </Link>
                    </form>
                </div>
            </div>

            <style>{`
        @media (max-width: 760px) {
          .login-layout {
            display: block !important;
            min-height: auto !important;
          }
      
          .login-side-panel {
            width: 100% !important;
            min-height: auto !important;
            gap: 24px;
          }
        }
      
        /* En pantallas chicas el panel decorativo se oculta y el formulario ocupa todo */
        @media (max-width: 600px) {
          .login-side-panel {
            display: none !important;
          }
        }
      
        @media (max-width: 480px) {
          .login-side-panel h2 {
            font-size: 28px !important;
          }
        }
    `}</style>

        </div>
    );
}
