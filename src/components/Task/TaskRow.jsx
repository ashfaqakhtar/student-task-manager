import { useState } from "react";
import Badge from "../UI/Badge";
import Button from "../UI/Button";
import SubtaskList from "./SubtaskList";
import { formatDeadlineMeta } from "../../utils/dates";
import { getUrgency } from "../../utils/urgency";

export default function TaskRow({
  task,
  color,
  onFocus,
  onToggleSubtask,
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="task-row-wrap">
      <div
        className="task-row"
        onClick={() => setExpanded((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setExpanded((value) => !value);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <span className="task-row__dot" style={{ background: color }} />
        <div className="task-row__main">
          <strong>{task.title}</strong>
          <div className="task-row__meta">
            <Badge color={color}>{task.subject}</Badge>
            <Badge muted>{task.type}</Badge>
          </div>
        </div>
        <span className={`task-row__deadline urgency-${getUrgency(task.deadline) || "none"}`}>
          {formatDeadlineMeta(task.deadline)}
        </span>
        <span className="task-row__time">{task.estimatedMinutes} min</span>
        <Button
          variant="ghost"
          className="task-row__focus"
          onClick={(event) => {
            event.stopPropagation();
            onFocus(task);
          }}
        >
          Focus
        </Button>
      </div>
      {expanded ? (
        <div className="task-row__details">
          <SubtaskList subtasks={task.subtasks} onToggle={(id) => onToggleSubtask(task.id, id)} />
          {task.notes ? <p>{task.notes}</p> : null}
          {task.links.length ? (
            <div className="task-row__links">
              {task.links.map((link) => (
                <a key={link} href={link} target="_blank" rel="noreferrer">
                  {link}
                </a>
              ))}
            </div>
          ) : null}
          {task.sessions.length ? (
            <div className="task-row__sessions">
              {task.sessions.map((session) => (
                <span key={session.startedAt}>{session.durationMinutes} min session</span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
