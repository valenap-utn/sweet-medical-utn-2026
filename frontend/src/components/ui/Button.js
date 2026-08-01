"use client";
import Spinner from "./Spinner";
import { useState } from "react";

const VARIANTS = {
  primary:   { bg: "var(--p)",      color: "#fff",          border: "var(--p)" },
  accent:    { bg: "var(--accent)", color: "#fff",          border: "var(--accent)" },
  secondary: { bg: "transparent",   color: "var(--p)",      border: "var(--p)" },
  ghost:     { bg: "transparent",   color: "var(--on-surf-v)", border: "var(--outline-v)" },
  danger:    { bg: "#991b1b",        color: "#fff",          border: "#991b1b" },
};

export default function Button({
  children, variant = "primary", loading = false,
  className = "", type = "button", disabled, fullWidth, style, ...props
}) {
  const [isHovered, setIsHovered] = useState(false);
  const v = VARIANTS[variant] ?? VARIANTS.primary;
  
  const getHoverStyle = () => {
    if (variant === "primary") {
      return isHovered ? {
        background: "#fff",
        color: "var(--p)",
        borderColor: "var(--p)",
      } : {};
    }
    if (variant === "secondary") {
      return isHovered ? {
        background: "rgba(138, 33, 70, 0.08)",
        borderColor: "var(--p)",
      } : {};
    }
    if (variant === "accent") {
      return isHovered ? {
        background: "#fff",
        color: "var(--accent)",
        borderColor: "var(--accent)",
      } : {};
    }
    return {};
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onMouseEnter={() => !disabled && !loading && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: "7px", padding: "10px 22px", borderRadius: "999px",
        fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
        fontSize: "13px", fontWeight: 700, cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.6 : 1, transition: "all .2s ease",
        border: `2px solid ${v.border}`, background: v.bg, color: v.color,
        width: fullWidth ? "100%" : undefined,
        ...getHoverStyle(),
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
