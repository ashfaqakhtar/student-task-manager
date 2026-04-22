import Badge from "../UI/Badge";
import Button from "../UI/Button";
import DragHandle from "./DragHandle";
import { formatDeadlineLabel } from "../../utils/dates";
import { getUrgency } from "../../utils/urgency";

export default function TaskCard({
  task,
  color,
  onFocus,
  onComplete,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onCardDrop,
}) {
  const doneCount = task.subtasks.filter((subtask) => subtask.done).length;
  const progress = task.subtasks.length ? (doneCount / task.subtasks.length) * 100 : 0;
  const menuId = `card-menu-${task.id}`;

  return (
    <article
      className={`kanban-card ${task.status === "completed" ? "is-complete" : ""}`}
      draggable
      onDragStart={(event) => onDragStart(event, task.id)}
      onDragEnd={onDragEnd}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.stopPropagation();
        onCardDrop(task.id);
      }}
      style={{ "--subject-color": color }}
    >
      <div className="kanban-card__top">
        <div className="kanban-card__headline">
          <div className="kanban-card__eyebrow">
            <Badge color={color}>{task.subject}</Badge>
            <Badge muted>{task.priority}</Badge>
          </div>
          <strong>{task.title}</strong>
          <div className="kanban-card__meta-row">
            <span className={`kanban-card__deadline urgency-${getUrgency(task.deadline) || "none"}`}>
              {formatDeadlineLabel(task.deadline)}
            </span>
            <span className="kanban-card__time">{task.estimatedMinutes} min</span>
          </div>
        </div>
        <div className="kanban-card__tools">
          <DragHandle />
          <details className="card-menu">
            <summary aria-controls={menuId} aria-label={`Actions for ${task.title}`}>···</summary>
            <div id={menuId} className="card-menu__panel">
              <button type="button" onClick={() => onEdit(task)}>Edit task</button>
              <button type="button" onClick={() => onDelete(task.id)}>Delete task</button>
            </div>
          </details>
        </div>
      </div>
      <div className="mini-progress">
        <div className="mini-progress__label">
          <span>Subtasks</span>
          <strong>{doneCount}/{task.subtasks.length || 0}</strong>
        </div>
        <div className="mini-progress__bar"><i style={{ width: `${progress}%` }} /></div>
      </div>
      <div className="kanban-card__actions">
        <Button variant="secondary" onClick={() => onFocus(task)}>Focus</Button>
        <Button variant="ghost" onClick={() => onComplete(task.id)}>Complete</Button>
      </div>
    </article>
  );
}
