import Badge from "../UI/Badge";
import Button from "../UI/Button";

export default function RecommendedTasks({ tasks, colors, onFocus }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Recommended next</h2>
        <span className="panel-note">Best options based on urgency, priority, and effort</span>
      </div>
      <div className="today-card-grid">
        {tasks.map((task, index) => (
          <article key={task.id} className="today-card" style={{ "--subject-color": colors[task.subject] }}>
            <div className="today-card__rank">0{index + 1}</div>
            <div className="today-card__body">
              <strong>{task.title}</strong>
              <div className="today-card__meta">
                <Badge color={colors[task.subject]}>{task.subject}</Badge>
                <Badge muted>{task.effort}</Badge>
                <Badge muted>{task.estimatedMinutes} min</Badge>
              </div>
            </div>
            <Button variant="secondary" onClick={() => onFocus(task)}>Focus</Button>
          </article>
        ))}
      </div>
    </section>
  );
}
