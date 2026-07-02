import Link from "next/link";
export default function Footer() {
  return (
    <footer style={{ background: "#fff", borderTop: "1px solid var(--outline-v)", marginTop: "auto" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "'Literata', serif", fontSize: 18, fontWeight: 700, color: "var(--p)" }}>Sweet Medical</span>
          <span style={{ fontSize: 11, color: "var(--secondary)" }}>© 2024 Sweet Medical · UTN FRBA · TP 2026</span>
        </div>
        <div style={{ display: "flex", gap: 18 }}>
          {["Privacidad","Términos","Contacto"].map(l => (
            <Link key={l} href="#" style={{ fontSize: 11, color: "var(--secondary)", textDecoration: "none" }}>{l}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
