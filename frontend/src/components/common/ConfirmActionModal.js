"use client";

export default function ConfirmActionModal({
                                               open,
                                               title,
                                               message,
                                               confirmText = "Confirmar",
                                               cancelText = "Cancelar",
                                               onConfirm,
                                               onCancel,
                                               variant = "primary", // primary | danger
                                           }) {
    if (!open) return null;

    const confirmColor =
        variant === "danger"
            ? "#b42318"
            : "var(--secondary)";

    return (
        <div
            onClick={onCancel}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
                zIndex: 9999,
                backdropFilter: "blur(3px)",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "100%",
                    maxWidth: 460,
                    background: "#fff",
                    borderRadius: 20,
                    padding: 32,
                    boxShadow: "0 24px 60px rgba(0,0,0,.18)",
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        marginBottom: 18,
                        fontSize: 32,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        color: "var(--p)",
                        fontFamily: "var(--font-serif)",
                    }}
                >
                    {title}
                </h2>

                <p
                    style={{
                        margin: 0,
                        marginBottom: 32,
                        color: "var(--on-surf-v)",
                        fontSize: 16,
                        lineHeight: 1.7,
                    }}
                >
                    {message}
                </p>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 14,
                    }}
                >
                    <button
                        onClick={onCancel}
                        style={btnSecundario}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "var(--p-fixed)";
                            e.currentTarget.style.borderColor = "var(--secondary)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#fff";
                            e.currentTarget.style.borderColor = "var(--outline-v)";
                        }}
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        style={btnPrimario}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = ".9";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "1";
                        }}
                    >
                        {confirmText}
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
    transition: "all .2s ease",
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
    transition: "opacity .2s ease",
};
