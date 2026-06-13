export default function Spinner({ size = 22 }) {
  return (
    <span
      role="status" aria-label="Cargando"
      style={{
        display: "inline-block", width: size, height: size,
        borderRadius: "50%",
        border: `2px solid var(--p-fixed-dim)`,
        borderTopColor: "var(--p)",
        animation: "spin .7s linear infinite",
      }}
    />
  );
}
