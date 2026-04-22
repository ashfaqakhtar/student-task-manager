import { useEffect, useState } from "react";
import Button from "../UI/Button";
import SubtaskList from "../Task/SubtaskList";
import PomodoroTimer from "./PomodoroTimer";
import SessionLog from "./SessionLog";
import { useTimer } from "../../hooks/useTimer";

export default function FocusModal({ task, color, onClose, onComplete, onToggleSubtask, onNotesSave, onLogSession }) {
  const [notes, setNotes] = useState(task.notes);
  const timer = useTimer((startedAt, endedAt) => {
    onLogSession(task.id, {
      startedAt,
      endedAt,
      durationMinutes: 25,
    });
  });

  useEffect(() => setNotes(task.notes), [task.notes]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="focus-modal" onClick={(event) => event.stopPropagation()}>
        <header className="focus-modal__header">
          <div>
            <span className="subject-pill" style={{ background: color }} />
            <h2>{task.title}</h2>
            <p>{task.subject}</p>
          </div>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </header>
        <div className="focus-modal__grid">
          <PomodoroTimer timer={timer} onComplete={() => onComplete(task.id)} />
          <section className="panel">
            <div className="section-heading"><h2>Subtasks</h2></div>
            <SubtaskList subtasks={task.subtasks} onToggle={(id) => onToggleSubtask(task.id, id)} />
            <textarea
              className="textarea"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              onBlur={() => onNotesSave(task.id, notes)}
              rows={5}
            />
            <div className="section-heading"><h2>Session log</h2></div>
            <SessionLog sessions={task.sessions} />
          </section>
        </div>
      </div>
    </div>
  );
}
