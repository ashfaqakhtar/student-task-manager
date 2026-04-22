export default function SubtaskList({ subtasks, onToggle }) {
  if (!subtasks.length) return null;

  return (
    <div className="subtask-list">
      {subtasks.map((subtask) => (
        <label key={subtask.id} className="subtask-list__item">
          <input
            type="checkbox"
            checked={subtask.done}
            onChange={() => onToggle?.(subtask.id)}
          />
          <span>{subtask.text}</span>
        </label>
      ))}
    </div>
  );
}
