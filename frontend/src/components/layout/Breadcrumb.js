"use client"

import {usePathname} from "next/navigation";
import Link from "next/link";
import {useAuth} from "@/context/AuthContext";
import {RolUsuario} from "@/lib/roles";
import {useEffect, useState} from "react";
import {getPlanes} from "@/lib/serviciosApi";

const LABELS = {
    medico: "Panel médico",
    agenda: "Agenda",
    disponibilidades: "Disponibilidades",
    servicios: "Servicios",
    sedes: "Sedes",
    turnos: "Buscar turnos",
    carrito: "Mis turnos",
    perfil: "Mi cuenta",
    planes: "Planes",
};

export default function Breadcrumb() {
    const pathname = usePathname();

    const [planActual, setPlanActual] = useState(null);

    useEffect(() => {
        const partes = pathname.split("/").filter(Boolean);

        if (partes[0] !== "planes" || partes.length !== 2) {
            return;
        }

        const planId = partes[1];
        let activo = true;

        (async () => {
            try {
                const planes = await getPlanes();
                const encontrado = planes.find((plan) => plan._id === planId);

                if (activo) {
                    setPlanActual(encontrado ? { id: planId, nombre: encontrado.nombre } : null);
                }
            } catch {
                if (activo) {
                    setPlanActual(null);
                }
            }
        })();

        return () => {
            activo = false;
        };
    }, [pathname]);

    const {usuario} = useAuth();
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

        const actual = index === partesBreadcrumb.length - 1;

        let label = LABELS[parte] ?? parte;

        if (
            actual &&
            partesBreadcrumb[0] === "planes" &&
            partesBreadcrumb.length === 2
        ) {
            label = planActual?.id === partesBreadcrumb[1]
                ? planActual.nombre
                : "Detalle del plan";
        }

        return {
            label,
            href,
            actual,
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
                    <span style={{margin: "0 8px", color: "#999"}}>{'>'}</span>
                        {crumb.actual ? (
                            <span style={{color: "var(--on-surf)", fontWeight: 700}}>
                            {crumb.label}
                        </span>
                        ) : (
                            <Link href={crumb.href}
                                  style={{color: "var(--p)", textDecoration: "none", fontWeight: 600}}>
                                {crumb.label}
                            </Link>
                        )}
                    </span>
                ))}
            </nav>
        </div>
    );
}
