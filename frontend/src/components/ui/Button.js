"use client";
import Spinner from "./Spinner";

const VARIANTS = {
  primary:   { bg: "var(--p)",      color: "#fff",          border: "var(--p)" },
  secondary: { bg: "transparent",   color: "var(--p)",      border: "var(--p)" },
  ghost:     { bg: "transparent",   color: "var(--on-surf-v)", border: "var(--outline-v)" },
  danger:    { bg: "#991b1b",        color: "#fff",          border: "#991b1b" },
};

export default function Button({
  children, variant = "primary", loading = false,
  className = "", type = "button", disabled, fullWidth, style, ...props
}) {
  const v = VARIANTS[variant] ?? VARIANTS.primary;
  return (
    <button
      type={type}
      disabled={disabled || loading}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: "7px", padding: "10px 22px", borderRadius: "999px",
        fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
        fontSize: "13px", fontWeight: 700, cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.6 : 1, transition: "all .2s",
        border: `2px solid ${v.border}`, background: v.bg, color: v.color,
        width: fullWidth ? "100%" : undefined,
        ...style,
      }}
      className={className}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner size={14} />}
      {children}
    </button>
  );
}
