export default function FormField({ id, label, error, helperText, required, children }) {
  const errorId   = error      ? `${id}-error`  : undefined;
  const helperId  = helperText ? `${id}-helper` : undefined;
  const described = [errorId, helperId].filter(Boolean).join(" ") || undefined;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label htmlFor={id} style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--on-surf-v)" }}>
        {label}{required && <span style={{ color: "var(--p)", marginLeft: 3 }}>*</span>}
      </label>
      {typeof children === "function"
        ? children({ id, "aria-describedby": described, "aria-invalid": !!error || undefined })
        : children}
      {helperText && !error && (
        <p id={helperId} style={{ fontSize: "11px", color: "var(--secondary)", margin: 0 }}>{helperText}</p>
      )}
      {error && (
        <p id={errorId} role="alert" style={{ fontSize: "11px", fontWeight: 600, color: "#991b1b", margin: 0 }}>{error}</p>
      )}
    </div>
  );
}
