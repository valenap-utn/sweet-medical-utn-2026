const STYLES = {
  error:   { bg: "#fce8e8", color: "#991b1b", border: "rgba(153,27,27,.2)" },
  success: { bg: "#e6f4eb", color: "#166534", border: "rgba(22,101,52,.2)"  },
  info:    { bg: "var(--p-fixed)", color: "var(--p)", border: "var(--outline-v)" },
};
export default function Alert({ type = "info", children, style }) {
  const s = STYLES[type] ?? STYLES.info;
  return (
    <div
      role={type === "error" ? "alert" : "status"}
      style={{
        borderRadius: "12px", border: `1px solid ${s.border}`,
        padding: "12px 16px", fontSize: "13px", fontWeight: 600,
        background: s.bg, color: s.color, ...style,
      }}
    >
      {children}
    </div>
  );
}
