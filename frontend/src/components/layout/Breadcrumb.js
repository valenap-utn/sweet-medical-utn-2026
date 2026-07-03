"use client"

import {usePathname} from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { RolUsuario } from "@/lib/roles";

const LABELS = {
    medico: "Panel médico",
    agenda: "Agenda",
    disponibilidades: "Disponibilidades",
    servicios: "Servicios",
    sedes: "Sedes",
    turnos: "Buscar turnos",
    carrito: "Turnos seleccionados",
    perfil: "Mi cuenta",
    planes: "Planes",
};

export default function Breadcrumb() {
    const pathname = usePathname();

    const { usuario } = useAuth();
    const esMedico = usuario?.rol === RolUsuario.MEDICO;

    if (pathname === "/" || pathname === "/login" || pathname.startsWith("/registro")) {
        return null;
    }

    const partes = pathname.split("/").filter(Boolean);

    const partesBreadcrumb =
        esMedico && partes[0] === "medico"
            ? partes.slice(1)
            : partes;

    const crumbs = partesBreadcrumb.map((parte, index) => {
        const href =
            "/" +
            (esMedico
                    ? ["medico", ...partesBreadcrumb.slice(0, index + 1)]
                    : partes.slice(0, index + 1)
            ).join("/");

        return {
            label: LABELS[parte] ?? parte,
            href,
            actual: index === partesBreadcrumb.length - 1,
        };
    });

    return (
        <div
            style={{
                width: "100%",
                borderTop: "1px solid #eee",
            }}
        >
            <nav aria-label="Breadcrumb"
                 style={{
                     maxWidth: "var(--page-max)",
                     margin: "0 auto",
                     padding: "14px var(--page-px)",
                     display: "flex",
                     alignItems: "center",
                     fontSize: 15,
                     fontWeight: 500,
                     gap: 8,
                 }}
            >
                <Link
                    href={esMedico ? "/medico" : "/"}
                    style={{
                        color: "var(--p)",
                        textDecoration: "none",
                        fontWeight: 600,
                    }}
                >
                    {esMedico ? "Panel médico" : "Inicio"}
                </Link>

                {crumbs.map((crumb) => (
                    <span key={crumb.href}>
                    <span style={{margin: "0 8px", color:"#999"}}>{'>'}</span>
                        {crumb.actual ? (
                            <span style={{color: "var(--on-surf)", fontWeight: 700}}>
                            {crumb.label}
                        </span>
                        ) : (
                            <Link href={crumb.href} style={{color: "var(--p)", textDecoration: "none", fontWeight: 600}}>
                                {crumb.label}
                            </Link>
                        )}
                    </span>
                ))}
            </nav>
        </div>
    );
}
