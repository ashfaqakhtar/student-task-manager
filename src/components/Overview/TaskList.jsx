import TaskRow from "../Task/TaskRow";
import TaskFilterToolbar from "../Task/TaskFilterToolbar";

export default function TaskList({
  tasks,
  filters,
  sortBy,
  onFilterChange,
  onSortChange,
  onClear,
  onSaveView,
  onFocus,
  onToggleSubtask,
  subjects,
  savedViews,
  searchRef,
  colors,
  showShortcutHint,
  onDismissShortcutHint,
}) {
  return (
    <section className="panel">
      <TaskFilterToolbar
        filters={filters}
        sortBy={sortBy}
        totalCount={tasks.length}
        subjects={subjects}
        savedViews={savedViews}
        onFilterChange={onFilterChange}
        onSortChange={onSortChange}
        onClear={onClear}
        onSaveView={onSaveView}
        searchRef={searchRef}
      />
      {showShortcutHint ? (
        <button className="toolbar-hint" onClick={onDismissShortcutHint}>
          Press <strong>/</strong> to search and <strong>N</strong> to add a task
        </button>
      ) : null}
      <div className="task-list">
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            color={colors[task.subject]}
            onFocus={onFocus}
            onToggleSubtask={onToggleSubtask}
          />
        ))}
      </div>
    </section>
  );
}
