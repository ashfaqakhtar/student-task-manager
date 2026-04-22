export default function TodaySummary({
  dueTodayCount,
  plannedCount,
  totalPlannedMinutes,
  inProgressCount,
}) {
  const items = [
    { label: "Due today", value: dueTodayCount },
    { label: "Planned today", value: plannedCount },
    { label: "Planned minutes", value: totalPlannedMinutes },
    { label: "In progress", value: inProgressCount },
  ];

  return (
    <section className="stats-grid">
      {items.map((item) => (
        <article
          key={item.label}
          className={`metric-tile ${item.label === "Due today" && item.value ? "metric-tile--alert" : ""}`}
        >
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </article>
      ))}
    </section>
  );
}
