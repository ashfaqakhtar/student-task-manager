const TILES = [
  { key: "dueTodayCount", label: "Due today" },
  { key: "estimatedHoursThisWeek", label: "This week" },
  { key: "completionRate", label: "Done rate" },
  { key: "streak", label: "Streak" },
];

function formatValue(tile, value) {
  if (tile.key === "estimatedHoursThisWeek") return `${value.toFixed(1)}h`;
  if (tile.key === "completionRate") return `${value}%`;
  if (tile.key === "streak") return `${value}d`;
  return value;
}

export default function StatsBar({ stats }) {
  return (
    <section className="stats-grid">
      {TILES.map((tile) => (
        <article
          key={tile.key}
          className={`metric-tile ${tile.key === "dueTodayCount" && stats[tile.key] ? "metric-tile--alert" : ""}`}
        >
          <strong>{formatValue(tile, stats[tile.key])}</strong>
          <span>{tile.label}</span>
        </article>
      ))}
    </section>
  );
}
