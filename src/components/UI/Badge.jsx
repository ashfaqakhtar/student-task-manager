export default function Badge({ children, color, muted = false }) {
  return (
    <span
      className={`badge ${muted ? "badge--muted" : ""}`.trim()}
      style={color ? { "--badge-color": color } : undefined}
    >
      {children}
    </span>
  );
}
