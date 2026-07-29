"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { RolUsuario } from "@/lib/roles";
import Spinner from "@/components/ui/Spinner";
import styles from "./page.module.css";

const MODULOS = [
  {
    titulo: "Servicios",
    descripcion:
        "Administrá las especialidades y prácticas que ofrecés a pacientes.",
    detalle: "Asociar o quitar servicios existentes.",
    href: "/medico/servicios",
  },
  {
    titulo: "Sedes",
    descripcion:
        "Indicá en qué centros de atención brindás cada servicio.",
    detalle: "Asociar o quitar sedes disponibles.",
    href: "/medico/sedes",
  },
  {
    titulo: "Disponibilidades",
    descripcion:
      "Definí los días, horarios, sedes y servicios en los que atendés.",
    detalle: "Crear, consultar y eliminar franjas horarias.",
    href: "/medico/disponibilidades",
  },
  {
    titulo: "Agenda",
    descripcion:
      "Consultá los turnos generados a partir de tus disponibilidades.",
    detalle: "Visualizar horarios disponibles y turnos reservados.",
    href: "/medico/agenda",
  },
  {
    titulo: "Pacientes y turnos",
    descripcion:
      "Consultá el historial de un paciente y gestioná sus turnos.",
    detalle: "Cancelar, proponer cambios y marcar turnos realizados.",
    href: "/medico/pacientes"
  },
];

export default function PanelMedicoPage() {
  const { usuario, cargando } = useAuth();
  const router = useRouter();
  const esMedico = usuario?.rol === RolUsuario.MEDICO;

  useEffect(() => {
    if (cargando) return;

    if (!usuario) {
      router.replace("/login");
      return;
    }

    if (!esMedico) {
      // router.replace("/perfil");
      router.replace("/forbidden");
    }
  }, [cargando, usuario, esMedico, router]);

  if (cargando || !usuario || !esMedico) {
    return (
      <div className={styles.loading}>
        <Spinner size={36} />
        <span>Preparando tu panel...</span>
      </div>
    );
  }

  const nombreVisible =
      usuario.nombre ||
      usuario.nombreUsuario ||
      "Profesional";

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div>
            <span className={styles.eyebrow}>Área profesional</span>
            <h1>Panel médico</h1>
            <p>
              Hola, {nombreVisible}. Desde acá vas a poder organizar tu
              atención y gestionar los turnos de tus pacientes.
            </p>
          </div>

        </div>
      </section>

      <main className={styles.content}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>Gestión médica</span>
            <h2>Accesos principales</h2>
          </div>
        </div>

        <section className={styles.modules} aria-label="Módulos del panel médico">
          {MODULOS.map((modulo) => (
              <Link
                  key={modulo.titulo}
                  href={modulo.href ?? "/medico"}
                  className={styles.moduleCard}
                  style={{ textDecoration: "none" }}
              >
                <h3>{modulo.titulo}</h3>
                <p>{modulo.descripcion}</p>
                <div className={styles.detail}>{modulo.detalle}</div>
              </Link>
          ))}
        </section>

        <section className={styles.flow}>
          <div>
            <span className={styles.eyebrow}>Flujo principal</span>
            <h2>De la disponibilidad al turno</h2>
          </div>
          <ol>
            <li>
              <span>1</span>
              Definís tu disponibilidad
            </li>
            <li>
              <span>2</span>
              El sistema genera la agenda
            </li>
            <li>
              <span>3</span>
              El paciente reserva un turno
            </li>
            <li>
              <span>4</span>
              Gestionás la atención
            </li>
          </ol>
        </section>

        <div className={styles.profileLink}>
          <span>¿Necesitás revisar los datos de tu cuenta?</span>
          <Link href="/perfil">Ir a mi perfil</Link>
        </div>
      </main>
    </div>
  );
}
