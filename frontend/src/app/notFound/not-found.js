import Link from "next/link";
import {FaHome, FaSearch} from "react-icons/fa";

export default function NotFound() {
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
                <h1 style={{
                    fontFamily: "'Literata', serif",
                    fontSize: "clamp(32px,6vw,46px)",
                    color: "var(--p)",
                    marginBottom: 10
                }}>
                    404
                </h1>

                <h2 style={{
                    fontFamily: "'Literata', serif",
                    fontSize: "clamp(22px,4vw,30px)",
                    color: "var(--p)",
                    marginBottom: 10
                }}>
                    Página no encontrada
                </h2>

                <p style={{
                    fontSize: 15,
                    color: "var(--secondary)",
                    lineHeight: 1.6,
                    marginBottom: 26
                }}>
                    La página que estás buscando no existe o fue movida.
                </p>

                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 12,
                    flexWrap: "wrap"
                }}>
                    <Link href="/" style={primaryBtn}>
                        <FaHome size={14}/>
                        Ir al inicio
                    </Link>

                    <Link href="/turnos" style={secondaryBtn}>
                        <FaSearch size={14}/>
                        Buscar turnos
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
