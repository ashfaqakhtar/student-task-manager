import Button from "../UI/Button";
import TaskCard from "./TaskCard";

export default function KanbanColumn({
  title,
  description,
  status,
  tasks,
  colors,
  dropState,
  onQuickAdd,
  onDrop,
  onCardDrop,
  ...cardProps
}) {
  return (
    <section
      className={`kanban-column ${dropState === status ? "is-drop-target" : ""}`}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onDrop(status);
      }}
    >
      <header className="kanban-column__header">
        <div>
          <h2>{title} <span>{tasks.length}</span></h2>
          <p>{description}</p>
        </div>
        <Button variant="ghost" onClick={() => onQuickAdd(status)}>+</Button>
      </header>
      <div className="kanban-column__cards">
        {tasks.length ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              color={colors[task.subject]}
              onCardDrop={(beforeTaskId) => onCardDrop(status, beforeTaskId)}
              {...cardProps}
            />
          ))
        ) : (
          <div className="kanban-column__empty">
            <strong>No tasks here yet.</strong>
            <span>Drag a card in or add one directly to this stage.</span>
          </div>
        )}
      </div>
    </section>
  );
}
