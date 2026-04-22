import Toggle from "../UI/Toggle";
import { Icon } from "../UI/Icon";

const NAV_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "today", label: "Today" },
  { id: "board", label: "Board" },
  { id: "calendar", label: "Calendar" },
];

export default function Sidebar({
  name,
  currentView,
  onChangeView,
  subjects,
  activeSubject,
  onSelectSubject,
  streak,
  sessionsThisWeekCount,
  theme,
  onThemeChange,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__title">Study Planner</span>
        <span className="sidebar__subtitle">{name || "Student"}</span>
      </div>
      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`sidebar__link ${currentView === item.id ? "is-active" : ""}`}
            onClick={() => onChangeView(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <section className="sidebar__section">
        <div className="sidebar__section-label">Subjects</div>
        <button
          className={`sidebar__subject ${!activeSubject ? "is-active" : ""}`}
          onClick={() => onSelectSubject("")}
        >
          <span className="sidebar__dot" />
          All subjects
        </button>
        {subjects.map((subject) => (
          <button
            key={subject.name}
            className={`sidebar__subject ${activeSubject === subject.name ? "is-active" : ""}`}
            onClick={() => onSelectSubject(subject.name)}
          >
            <span className="sidebar__dot" style={{ background: subject.color }} />
            {subject.name}
          </button>
        ))}
      </section>
      <div className="sidebar__footer">
        <div className="sidebar__streak">
          <Icon path="M12 3c-2 3-5 5.4-5 9a5 5 0 0 0 10 0c0-1.9-.9-3.6-2.3-5.1M10.2 11.5c.3 1.5 1.4 2.4 2.8 2.4" />
          <div>
            <strong>{streak} day streak</strong>
            <span>{sessionsThisWeekCount} sessions this week</span>
          </div>
        </div>
        <Toggle
          checked={theme === "light"}
          onChange={(checked) => onThemeChange(checked ? "light" : "dark")}
          label="Light mode"
        />
      </div>
    </aside>
  );
}
