"use client";

import Link from "next/link";
import {useAuth} from "@/context/AuthContext";
import {RolUsuario} from "@/lib/roles";
import {FaBan, FaHome, FaStethoscope, FaUserCircle} from "react-icons/fa";

export default function ForbiddenPage() {
    const {usuario} = useAuth();
    const esMedico = usuario?.rol === RolUsuario.MEDICO;

    return (
        <main style={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px var(--page-px)"
        }}>
            <section className="wellness-card" style={{
                maxWidth: 520,
                width: "100%",
                textAlign: "center",
                borderRadius: 24,
                padding: "40px 28px"
            }}>
                <div style={{
                    width: 72,
                    height: 72,
                    borderRadius: 22,
                    background: "#fce8e8",
                    color: "#991b1b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 18px"
                }}>
                    <FaBan size={30}/>
                </div>

                <h1 style={{
                    fontFamily: "'Literata', serif",
                    fontSize: "clamp(26px,5vw,36px)",
                    color: "var(--p)",
                    marginBottom: 10
                }}>
                    403 · Acceso denegado
                </h1>

                <p style={{
                    fontSize: 15,
                    color: "var(--secondary)",
                    lineHeight: 1.6,
                    marginBottom: 26
                }}>
                    No tenés permisos para acceder a esta sección.
                </p>

                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 12,
                    flexWrap: "wrap"
                }}>
                    <Link href={esMedico ? "/medico" : "/"} style={primaryBtn}>
                        {esMedico ? <FaStethoscope size={14}/> : <FaHome size={14}/>}
                        {esMedico ? "Ir al panel" : "Ir al inicio"}
                    </Link>

                    <Link href="/perfil" style={secondaryBtn}>
                        <FaUserCircle size={14}/>
                        Mi perfil
                    </Link>
                </div>
            </section>
        </main>
    );
}

const primaryBtn = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 22px",
    borderRadius: 999,
    background: "var(--p)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    textDecoration: "none",
};

const secondaryBtn = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 22px",
    borderRadius: 999,
    background: "transparent",
    color: "var(--p)",
    border: "2px solid var(--p)",
    fontWeight: 700,
    fontSize: 14,
    textDecoration: "none",
};
