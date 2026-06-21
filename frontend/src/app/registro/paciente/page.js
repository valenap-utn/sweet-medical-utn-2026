"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registrarPaciente, getObrasSociales, getPlanesDeObraSocial } from "@/lib/authApi";
import { getApiErrorMessage } from "@/lib/api";
import { validarNombreUsuario, validarPassword, PASSWORD_HELP } from "@/lib/validation";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";

const IS = { width: "100%", padding: "11px 13px", borderRadius: 11, border: "1.5px solid var(--outline-v)", background: "#ffffff", color: "var(--on-surf)", fontSize: 14, fontFamily: "'Hanken Grotesk',system-ui,sans-serif", outline: "none" };
const LB = { fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--on-surf-v)", display: "block", marginBottom: 6 };

const INITIAL = { nombre: "", dni: "", nombreUsuario: "", password: "", confirmarPassword: "", obraSocial: "", plan: "" };

function Field({
                 name,
                 label,
                 type = "text",
                 placeholder,
                 helper,
                 autoComplete,
                 value,
                 onChange,
                 error,
               }) {
  return (
      <div>
        <span style={LB}>{label} *</span>

        <input
            name={name}
            type={type}
            autoComplete={autoComplete}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={{
              ...IS,
              borderColor: error
                  ? "#991b1b"
                  : "var(--outline-v)",
            }}
        />

        {helper && !error && (
            <p
                style={{
                  fontSize: 11,
                  color: "var(--secondary)",
                  marginTop: 4,
                }}
            >
              {helper}
            </p>
        )}

        {error && (
            <p
                style={{
                  fontSize: 11,
                  color: "#991b1b",
                  marginTop: 4,
                }}
            >
              {error}
            </p>
        )}
      </div>
  );
}

export default function RegistroPacientePage() {
  const router = useRouter();
  const [form, setForm]           = useState(INITIAL);
  const [errors, setErrors]       = useState({});
  const [apiError, setApiError]   = useState("");
  const [success, setSuccess]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [obrasSociales, setOS]    = useState([]);
  const [planes, setPlanes]       = useState([]);
  const [cargandoOS, setCargOS]   = useState(true);
  const [cargandoP, setCargP]     = useState(false);

  useEffect(() => {
    let a = true;
    (async () => {
      setCargOS(true);
      try { const d = await getObrasSociales(); if (a) setOS(Array.isArray(d) ? d : []); }
      catch {}
      finally { if (a) setCargOS(false); }
    })();
    return () => { a = false; };
  }, []);

  useEffect(() => {
    if (!form.obraSocial) { return; }
    let a = true;
    (async () => {
      setCargP(true);
      try {
        const d = await getPlanesDeObraSocial(form.obraSocial);
        if (a) setPlanes(Array.isArray(d) ? d : d?.planes ?? []);
      } catch {}
      finally { if (a) setCargP(false); }
    })();
    return () => { a = false; };
  }, [form.obraSocial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value, ...(name === "obraSocial" ? { plan: "" } : {}) }));
    setErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = "Ingresá tu nombre completo.";
    if (!form.dni.trim()) errs.dni = "Ingresá tu DNI.";
    else if (!/^\d{7,8}$/.test(form.dni.trim())) errs.dni = "DNI inválido (7 u 8 números).";
    if (!validarNombreUsuario(form.nombreUsuario)) errs.nombreUsuario = "Mínimo 3 caracteres.";
    if (!validarPassword(form.password)) errs.password = PASSWORD_HELP;
    if (form.confirmarPassword !== form.password) errs.confirmarPassword = "Las contraseñas no coinciden.";
    if (!form.obraSocial) errs.obraSocial = "Seleccioná tu obra social.";
    if (!form.plan) errs.plan = "Seleccioná tu plan.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setApiError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await registrarPaciente({ nombreUsuario: form.nombreUsuario.trim(), password: form.password, dni: form.dni.trim(), nombre: form.nombre.trim(), obraSocial: form.obraSocial, plan: form.plan });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1600);
    } catch (error) { setApiError(getApiErrorMessage(error, "No pudimos crear tu cuenta.")); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 140px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", background: "linear-gradient(135deg,#fdfaf8,#f9eef0 50%,#fdfaf8)" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: "'Literata', serif", fontSize: 20, fontWeight: 700, color: "var(--p)", marginBottom: 16 }}>Sweet Medical</div>
          <h1 style={{ fontFamily: "'Literata', serif", fontSize: 26, fontWeight: 700, color: "var(--p)", marginBottom: 5 }}>Registro de paciente</h1>
          <p style={{ fontSize: 13, color: "var(--secondary)" }}>Completá tus datos para empezar a reservar turnos.</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", boxShadow: "0 8px 32px rgba(107,29,42,.09)", border: "1px solid var(--outline-v)" }}>
          {success ? <Alert type="success">¡Cuenta creada! Redirigiendo al login...</Alert> : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }} noValidate>
              {apiError && <Alert type="error">{apiError}</Alert>}
              <Field
                  name="nombre"
                  label="Nombre completo"
                  placeholder="Ej: Cynthia Gómez"
                  autoComplete="name"
                  value={form.nombre}
                  onChange={handleChange}
                  error={errors.nombre}
              />

              <Field
                  name="dni"
                  label="DNI"
                  placeholder="Ej: 30123456"
                  autoComplete="off"
                  value={form.dni}
                  onChange={handleChange}
                  error={errors.dni}
              />

              <Field
                  name="nombreUsuario"
                  label="Nombre de usuario"
                  placeholder="Mínimo 3 caracteres"
                  autoComplete="username"
                  value={form.nombreUsuario}
                  onChange={handleChange}
                  error={errors.nombreUsuario}
              />

              <Field
                  name="password"
                  label="Contraseña"
                  type="password"
                  placeholder="••••••••"
                  helper={PASSWORD_HELP}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
              />

              <Field
                  name="confirmarPassword"
                  label="Confirmar contraseña"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={form.confirmarPassword}
                  onChange={handleChange}
                  error={errors.confirmarPassword}
              />

              <div>
                <span style={LB}>Obra social *</span>
                <div style={{ position: "relative" }}>
                  <select name="obraSocial" value={form.obraSocial} onChange={handleChange} disabled={cargandoOS}
                    style={{ ...IS, borderColor: errors.obraSocial ? "#991b1b" : "var(--outline-v)" }}>
                    <option value="">{cargandoOS ? "Cargando..." : "Seleccioná tu obra social"}</option>
                    {obrasSociales.map(os => <option key={os._id ?? os.id} value={os._id ?? os.id}>{os.nombre}</option>)}
                  </select>
                  {cargandoOS && <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}><Spinner size={14} /></span>}
                </div>
                {errors.obraSocial && <p style={{ fontSize: 11, color: "#991b1b", marginTop: 4 }}>{errors.obraSocial}</p>}
              </div>

              <div>
                <span style={LB}>Plan *</span>
                <div style={{ position: "relative" }}>
                  <select name="plan" value={form.plan} onChange={handleChange} disabled={!form.obraSocial || cargandoP}
                    style={{ ...IS, borderColor: errors.plan ? "#991b1b" : "var(--outline-v)" }}>
                    <option value="">{!form.obraSocial ? "Primero elegí tu obra social" : cargandoP ? "Cargando..." : planes.length === 0 ? "Sin planes disponibles" : "Seleccioná tu plan"}</option>
                    {planes.map(p => <option key={p._id ?? p.id} value={p._id ?? p.id}>{p.nombre}</option>)}
                  </select>
                  {cargandoP && <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}><Spinner size={14} /></span>}
                </div>
                {errors.plan && <p style={{ fontSize: 11, color: "#991b1b", marginTop: 4 }}>{errors.plan}</p>}
              </div>

              <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px 0", background: "var(--p)", color: "#fff", fontWeight: 700, borderRadius: 12, fontSize: 14, border: "2px solid var(--p)", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", opacity: loading ? .7 : 1, marginTop: 4 }}>
                {loading ? <Spinner size={16} /> : null} {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </form>
          )}
        </div>
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--secondary)", marginTop: 20 }}>
          ¿Ya tenés cuenta? <Link href="/login" style={{ fontWeight: 700, color: "var(--p)", textDecoration: "none" }}>Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
}
