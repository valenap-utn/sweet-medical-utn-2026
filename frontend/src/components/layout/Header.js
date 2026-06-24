"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCarrito } from "@/context/CarritoContext";
import { RolUsuario } from "@/lib/roles";

const NAV_PUBLICO = [
  { href: "/",       label: "Inicio" },
  { href: "/turnos", label: "Buscar turnos" },
  { href: "/planes", label: "Planes" },
];
const NAV_MEDICO = [
  { href: "/",       label: "Inicio" },
  { href: "/medico", label: "Mi panel" },
];

export default function Header() {
  const { usuario, cargando, logout } = useAuth();
  const { items } = useCarrito();
  const pathname  = usePathname();
  const router    = useRouter();


  const [menuOpen, setMenuOpen] = useState(false);


  const esMedico   = usuario?.rol === RolUsuario.MEDICO;
  const navLinks   = esMedico ? NAV_MEDICO : NAV_PUBLICO;

  const handleLogout = async () => {
    await logout();
    router.push("/");
    setMenuOpen(false);
  };

  const linkStyle = (href) => ({
    fontSize: 13, fontWeight: pathname === href ? 700 : 500,
    color: pathname === href ? "var(--p)" : "var(--on-surf-v)",
    textDecoration: "none",
    borderBottom: pathname === href ? "2px solid var(--p)" : "2px solid transparent",
    paddingBottom: 2, transition: "color .2s",
  });

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100 }} className="glass">
      <div style={{
        maxWidth: "var(--page-max)", margin: "0 auto",

        padding: "13px var(--page-px)",

        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      }}>
        <Link href="/" style={{ fontFamily: "'Literata',serif", fontSize: "clamp(17px,3vw,22px)", fontWeight: 700, color: "var(--p)", textDecoration: "none", letterSpacing: "-.02em", flexShrink: 0 }}>
          Sweet Medical
        </Link>

        <nav style={{ display: "flex", gap: 24, alignItems: "center" }} className="sm-desktop-nav">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} style={linkStyle(href)}>{label}</Link>
          ))}
        </nav>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }} className="sm-desktop-nav">
          {!esMedico && (
            <div style={{ position: "relative" }}>
              <Link href="/carrito" style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "8px 14px", borderRadius: 999, border: "2px solid var(--p)", color: "var(--p)", fontWeight: 700, fontSize: 12, textDecoration: "none" }}>
                📅 Turno
              </Link>
              {items.length > 0 && (
                <span style={{ position: "absolute", top: -5, right: -5, width: 17, height: 17, background: "var(--p)", color: "#fff", borderRadius: "50%", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {items.length}
                </span>
              )}
            </div>
          )}

          {cargando ? null : usuario ? (
            <>
              <Link href="/perfil" style={{ padding: "8px 14px", borderRadius: 999, background: "var(--p-fixed)", color: "var(--p)", fontWeight: 700, fontSize: 12, textDecoration: "none", border: "2px solid var(--p-fixed-dim)" }}>
                {usuario.nombreUsuario ?? (esMedico ? "Panel médico" : "Mi cuenta")}
              </Link>
              <button onClick={handleLogout} style={{ padding: "8px 14px", borderRadius: 999, background: "transparent", color: "var(--on-surf-v)", fontWeight: 600, fontSize: 12, border: "2px solid var(--outline-v)", cursor: "pointer", fontFamily: "inherit" }}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ padding: "8px 14px", borderRadius: 999, background: "transparent", color: "var(--p)", fontWeight: 700, fontSize: 12, textDecoration: "none", border: "2px solid var(--p)" }}>
                Iniciar sesión
              </Link>
              <Link href="/registro" style={{ padding: "8px 14px", borderRadius: 999, background: "var(--p)", color: "#fff", fontWeight: 700, fontSize: 12, textDecoration: "none", border: "2px solid var(--p)" }}>
                Crear cuenta
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(v => !v)}
          style={{ display: "none", background: "transparent", border: "none", cursor: "pointer", padding: 8, color: "var(--p)", fontSize: 22 }}
          className="sm-hamburger"
          aria-label="Menú"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>


      {menuOpen && (
        <div style={{ borderTop: "1px solid var(--outline-v)", background: "rgba(253,250,248,.97)", padding: "12px var(--page-px) 16px" }}>
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}
              style={{ display: "block", padding: "11px 0", fontSize: 14, fontWeight: pathname === href ? 700 : 500, color: pathname === href ? "var(--p)" : "var(--on-surf-v)", textDecoration: "none", borderBottom: "1px solid var(--outline-v)" }}>
              {label}
            </Link>
          ))}
          {!esMedico && (
            <Link href="/carrito" onClick={() => setMenuOpen(false)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 0", fontSize: 14, fontWeight: 600, color: "var(--p)", textDecoration: "none", borderBottom: "1px solid var(--outline-v)" }}>
              📅 Turno {items.length > 0 && (
                <span style={{ padding: "1px 7px", background: "var(--p)", color: "#fff", borderRadius: 999, fontSize: 10, fontWeight: 700 }}>{items.length}</span>
              )}
            </Link>
          )}
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {cargando ? null : usuario ? (
              <>
                <Link href="/perfil" onClick={() => setMenuOpen(false)}
                  style={{ padding: "10px 0", fontSize: 14, fontWeight: 700, color: "var(--p)", textDecoration: "none" }}>
                  {usuario.nombreUsuario ?? "Mi cuenta"}
                </Link>
                <button onClick={handleLogout}
                  style={{ padding: "10px 0", fontSize: 14, fontWeight: 600, color: "var(--on-surf-v)", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  style={{ display: "block", padding: "11px 16px", borderRadius: 12, background: "transparent", border: "2px solid var(--p)", color: "var(--p)", fontWeight: 700, fontSize: 14, textDecoration: "none", textAlign: "center" }}>
                  Iniciar sesión
                </Link>
                <Link href="/registro" onClick={() => setMenuOpen(false)}
                  style={{ display: "block", padding: "11px 16px", borderRadius: 12, background: "var(--p)", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none", textAlign: "center" }}>
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .sm-desktop-nav { display: none !important; }
          .sm-hamburger   { display: block !important; }
        }
      `}</style>
    </header>
  );
}
