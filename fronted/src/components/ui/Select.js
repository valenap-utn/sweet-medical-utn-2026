export default function Select({ error, children, className = "", style, ...props }) {
  return (
    <select
      style={{
        width: "100%", padding: "10px 14px", borderRadius: "11px",
        border: `1.5px solid ${error ? "#991b1b" : "var(--outline-v)"}`,
        background: "#fff", color: "var(--on-surf)",
        fontSize: "14px", fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
        outline: "none", transition: "border .2s",
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </select>
  );
}
