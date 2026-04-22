import { addMonths, subMonths } from "date-fns";
import Button from "../UI/Button";
import { getMonthGrid, isCurrentMonth, monthLabel } from "../../utils/dates";
import DayCell from "./DayCell";

export default function CalendarGrid({ currentMonth, onMonthChange, getTasksForDay, selectedDay, onSelectDay }) {
  const days = getMonthGrid(currentMonth);
  const selectedTasks = selectedDay ? getTasksForDay(selectedDay) : [];

  return (
    <div className="calendar-layout">
      <section className="panel">
        <div className="calendar-toolbar">
          <div>
            <h2>{monthLabel(currentMonth)}</h2>
          </div>
          <div className="calendar-toolbar__actions">
            <Button variant="ghost" onClick={() => onMonthChange(subMonths(currentMonth, 1))}>Prev</Button>
            <Button variant="ghost" onClick={() => onMonthChange(new Date())}>Today</Button>
            <Button variant="ghost" onClick={() => onMonthChange(addMonths(currentMonth, 1))}>Next</Button>
          </div>
        </div>
        <div className="calendar-grid">
          {days.map((day) => (
            <DayCell
              key={day.toISOString()}
              day={day}
              isMuted={!isCurrentMonth(day, currentMonth)}
              tasks={getTasksForDay(day)}
              onClick={onSelectDay}
            />
          ))}
        </div>
      </section>
      <aside className={`calendar-panel ${selectedDay ? "is-open" : ""}`}>
        <h3>{selectedDay ? selectedDay.toDateString() : "Pick a day"}</h3>
        {selectedTasks.map((task) => (
          <div key={task.id} className="calendar-panel__task">
            <strong>{task.title}</strong>
            <span>{task.subject}</span>
          </div>
        ))}
      </aside>
    </div>
  );
}
