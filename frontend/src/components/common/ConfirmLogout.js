"use client";

export default function ConfirmLogoutModal({open, onCancel, onConfirm}) {
    if (!open) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000,
                padding: 16,
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 420,
                    background: "#fff",
                    borderRadius: 18,
                    padding: 24,
                    boxShadow: "0 20px 60px rgba(0,0,0,.18)",
                }}
            >
                <h3 style={{margin: "0 0 8px", color: "var(--p)", fontSize: 24}}>
                    ¿Cerrar sesión?
                </h3>

                <p style={{margin: "0 0 22px", color: "var(--on-surf-v)", lineHeight: 1.5}}>
                    Vas a salir de tu cuenta actual. ¿Querés continuar?
                </p>

                <div style={{display: "flex", justifyContent: "flex-end", gap: 10}}>
                    <button onClick={onCancel} style={btnSecundario}>
                        Cancelar
                    </button>

                    <button onClick={onConfirm} style={btnPrimario}>
                        Sí, cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    );
}

const btnSecundario = {
    padding: "10px 16px",
    borderRadius: 999,
    border: "1px solid var(--outline-v)",
    background: "#fff",
    color: "var(--on-surf)",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
};

const btnPrimario = {
    padding: "10px 16px",
    borderRadius: 999,
    border: "1px solid var(--p)",
    background: "var(--p)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
};