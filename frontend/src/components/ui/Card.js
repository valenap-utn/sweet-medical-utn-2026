export default function Card({ children, className = "", style }) {
  return (
    <div
      className={`wellness-card ${className}`}
      style={{ borderRadius: "20px", padding: "24px", ...style }}
    >
      {children}
    </div>
  );
}
