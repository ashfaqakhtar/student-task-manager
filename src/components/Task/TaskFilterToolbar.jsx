import Button from "../UI/Button";
import Input from "../UI/Input";
import Select from "../UI/Select";

const FILTER_LABELS = {
  subject: "Subject",
  status: "Status",
  priority: "Priority",
  type: "Type",
};

function FilterChip({ label, value, onRemove }) {
  return (
    <button className="filter-chip" onClick={onRemove}>
      <span>{label}</span>
      <strong>{value}</strong>
    </button>
  );
}

export default function TaskFilterToolbar({
  filters,
  sortBy,
  totalCount,
  subjects,
  savedViews,
  onFilterChange,
  onSortChange,
  onClear,
  onSaveView,
  searchRef,
}) {
  const activeFilters = Object.entries(filters).filter(
    ([key, value]) => key !== "search" && Boolean(value),
  );

  return (
    <div className="task-toolbar">
      <div className="task-toolbar__top">
        <div className="task-toolbar__search">
          <Input
            ref={searchRef}
            id="overview-search"
            placeholder="Search tasks, notes, or deadlines"
            value={filters.search}
            onChange={(event) => onFilterChange("search", event.target.value)}
          />
        </div>
        <div className="task-toolbar__controls">
          <Select
            value={filters.subject}
            onChange={(event) => onFilterChange("subject", event.target.value)}
          >
            <option value="">All subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </Select>
          <Select
            value={filters.status}
            onChange={(event) => onFilterChange("status", event.target.value)}
          >
            <option value="">All statuses</option>
            <option value="backlog">Backlog</option>
            <option value="this-week">This Week</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </Select>
          <Select
            value={filters.priority}
            onChange={(event) => onFilterChange("priority", event.target.value)}
          >
            <option value="">All priorities</option>
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </Select>
          <Select
            value={filters.type}
            onChange={(event) => onFilterChange("type", event.target.value)}
          >
            <option value="">All types</option>
            <option value="assignment">Assignment</option>
            <option value="exam">Exam</option>
            <option value="project">Project</option>
            <option value="revision">Revision</option>
            <option value="lab">Lab</option>
          </Select>
          <Select value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
            <option value="smart">Smart sort</option>
            <option value="deadline">By deadline</option>
            <option value="priority">By priority</option>
            <option value="title">By title</option>
          </Select>
        </div>
      </div>
      <div className="task-toolbar__bottom">
        <div className="task-toolbar__meta">
          <span className="task-toolbar__count">
            {totalCount} {totalCount === 1 ? "task" : "tasks"}
          </span>
          {activeFilters.length ? (
            <div className="filter-chip-row">
              {activeFilters.map(([key, value]) => (
                <FilterChip
                  key={key}
                  label={FILTER_LABELS[key]}
                  value={value}
                  onRemove={() => onFilterChange(key, "")}
                />
              ))}
            </div>
          ) : null}
        </div>
        <div className="task-toolbar__actions">
          <Select
            onChange={(event) =>
              event.target.value && onFilterChange("preset", event.target.value)
            }
            defaultValue=""
          >
            <option value="">Saved views</option>
            {savedViews.map((view) => (
              <option key={view.name} value={view.name}>
                {view.name}
              </option>
            ))}
          </Select>
          <Button variant="secondary" onClick={onSaveView}>
            Save view
          </Button>
          <Button variant="ghost" onClick={onClear}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
