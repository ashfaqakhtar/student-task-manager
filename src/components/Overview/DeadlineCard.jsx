import Badge from "../UI/Badge";
import { formatDeadlineLabel } from "../../utils/dates";
import { getUrgency } from "../../utils/urgency";

export default function DeadlineCard({ task, color }) {
  return (
    <article className={`deadline-card urgency-${getUrgency(task.deadline) || "none"}`}>
      <span className="deadline-card__stripe" style={{ background: color }} />
      <div className="deadline-card__body">
        <strong>{task.title}</strong>
        <div className="deadline-card__meta">
          <Badge color={color}>{task.subject}</Badge>
          <span>{formatDeadlineLabel(task.deadline)}</span>
        </div>
      </div>
    </article>
  );
}
