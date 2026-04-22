import Badge from "../UI/Badge";
import Button from "../UI/Button";

export default function TodayListSection({ title, note, tasks, colors, onFocus, emptyText }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>{title}</h2>
        <span className="panel-note">{note}</span>
      </div>
      <div className="today-list">
        {tasks.length ? (
          tasks.map((task) => (
            <article key={task.id} className="today-list__item">
              <div className="today-list__main">
                <strong>{task.title}</strong>
                <div className="today-list__meta">
                  <Badge color={colors[task.subject]}>{task.subject}</Badge>
                  <Badge muted>{task.status}</Badge>
                  <span>{task.estimatedMinutes} min</span>
                </div>
              </div>
              <Button variant="ghost" onClick={() => onFocus(task)}>Focus</Button>
            </article>
          ))
        ) : (
          <div className="today-list__empty">{emptyText}</div>
        )}
      </div>
    </section>
  );
}
