"use client"

import {usePathname} from "next/navigation";
import Link from "next/link";

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

    if (pathname === "/" || pathname === "/login" || pathname.startsWith("/registro")) {
        return null;
    }

    const partes = pathname.split("/").filter(Boolean);

    const crumbs = partes.map((parte, index) => {
        const href = "/" + partes.slice(0, index + 1).join("/");
        return {
            label: LABELS[parte] ?? parte,
            href,
            actual: index === partes.length - 1,
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
                <Link href="/"
                      style={{
                          color: "var(--p)",
                          textDecoration: "none",
                          fontWeight: 600,
                      }}
                >
                    Inicio
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
