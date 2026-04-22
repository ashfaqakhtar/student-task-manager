import { useRef, useState } from "react";
import KanbanColumn from "./KanbanColumn";

const COLUMNS = [
  { status: "backlog", title: "Backlog", description: "Ideas and loose ends still waiting for a slot." },
  { status: "this-week", title: "This Week", description: "Committed work for the next few study sessions." },
  { status: "in-progress", title: "In Progress", description: "Active work that deserves your immediate attention." },
  { status: "completed", title: "Completed", description: "Finished work with a record of what it took." },
];

export default function KanbanBoard({ tasks, colors, onQuickAdd, onReorder, ...handlers }) {
  const draggedTaskRef = useRef(null);
  const [dropState, setDropState] = useState("");

  return (
    <div className="kanban-grid">
      {COLUMNS.map((column) => (
        <KanbanColumn
          key={column.status}
          {...column}
          tasks={tasks.filter((task) => task.status === column.status)}
          colors={colors}
          dropState={dropState}
          onQuickAdd={onQuickAdd}
          onDrop={(status) => {
            setDropState(status);
            if (draggedTaskRef.current) onReorder({ taskId: draggedTaskRef.current, targetStatus: status });
            setDropState("");
          }}
          onCardDrop={(status, beforeTaskId) => {
            if (draggedTaskRef.current) {
              onReorder({ taskId: draggedTaskRef.current, targetStatus: status, beforeTaskId });
            }
          }}
          onDragStart={(event, taskId) => {
            draggedTaskRef.current = taskId;
            event.currentTarget.classList.add("is-dragging");
          }}
          onDragEnd={(event) => {
            event.currentTarget.classList.remove("is-dragging");
            draggedTaskRef.current = null;
            setDropState("");
          }}
          {...handlers}
        />
      ))}
    </div>
  );
}
