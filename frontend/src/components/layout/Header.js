"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCarrito } from "@/context/CarritoContext";
import { RolUsuario } from "@/lib/roles";

const NAV_PACIENTE = [
  { href: "/",       label: "Inicio" },
  { href: "/turnos", label: "Buscar turnos" },
  { href: "/planes", label: "Planes" },
];

const NAV_MEDICO = [
  { href: "/", label: "Inicio" },
  { href: "/medico", label: "Panel médico" },
];

export default function Header() {
  const { usuario, cargando, logout } = useAuth();
  const { items } = useCarrito();
  const pathname = usePathname();
  const router   = useRouter();
  const esMedico = usuario?.rol === RolUsuario.MEDICO;
  const navegacion = esMedico ? NAV_MEDICO : NAV_PACIENTE;
  const cuentaHref = esMedico ? "/medico" : "/perfil";

  const handleLogout = async () => { await logout(); router.push("/"); };

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50 }} className="glass" >
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "13px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <Link href="/" style={{ fontFamily: "'Literata', serif", fontSize: 22, fontWeight: 700, color: "var(--p)", textDecoration: "none", letterSpacing: "-.02em" }}>
          Sweet Medical
        </Link>

        <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {navegacion.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              fontSize: 13, fontWeight: pathname === href || (href === "/medico" && pathname.startsWith("/medico")) ? 700 : 500,
              color: pathname === href || (href === "/medico" && pathname.startsWith("/medico")) ? "var(--p)" : "var(--on-surf-v)",
              textDecoration: "none",
              borderBottom: pathname === href || (href === "/medico" && pathname.startsWith("/medico")) ? "2px solid var(--p)" : "2px solid transparent",
              paddingBottom: 2, transition: "color .2s",
            }}>
              {label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {/* Carrito */}
          {!esMedico && <div style={{ position: "relative" }}>
            <Link href="/carrito" style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "8px 16px", borderRadius: 999, border: "2px solid var(--p)",
              color: "var(--p)", fontWeight: 700, fontSize: 12, textDecoration: "none",
              background: "transparent", transition: "all .2s",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              Carrito
            </Link>
            {items.length > 0 && (
              <span style={{
                position: "absolute", top: -5, right: -5, width: 17, height: 17,
                background: "var(--p)", color: "#fff", borderRadius: "50%",
                fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
              }}>{items.length}</span>
            )}
          </div>}

          {cargando ? null : usuario ? (
            <>
              <Link href={cuentaHref} style={{
                padding: "8px 16px", borderRadius: 999, background: "var(--p-fixed)",
                color: "var(--p)", fontWeight: 700, fontSize: 12, textDecoration: "none",
                border: "2px solid var(--p-fixed-dim)",
              }}>
                {usuario.nombreUsuario ?? (esMedico ? "Panel médico" : "Mi cuenta")}
              </Link>
              <button onClick={handleLogout} style={{
                padding: "8px 16px", borderRadius: 999, background: "transparent",
                color: "var(--on-surf-v)", fontWeight: 600, fontSize: 12,
                border: "2px solid var(--outline-v)", cursor: "pointer", fontFamily: "inherit",
              }}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{
                padding: "8px 18px", borderRadius: 999, background: "transparent",
                color: "var(--p)", fontWeight: 700, fontSize: 12, textDecoration: "none",
                border: "2px solid var(--p)", transition: "all .2s",
              }}>
                Iniciar sesión
              </Link>
              <Link href="/registro" style={{
                padding: "8px 18px", borderRadius: 999, background: "var(--p)",
                color: "#fff", fontWeight: 700, fontSize: 12, textDecoration: "none",
                border: "2px solid var(--p)", transition: "all .2s",
              }}>
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
