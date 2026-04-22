import WorkloadDot from "./WorkloadDot";
import { dayNumber } from "../../utils/dates";

export default function DayCell({ day, isMuted, tasks, onClick }) {
  const totalMinutes = tasks.reduce((sum, task) => sum + Number(task.estimatedMinutes || 0), 0);

  return (
    <button
      className={`day-cell ${isMuted ? "is-muted" : ""}`}
      onClick={() => onClick(day)}
      title={tasks.map((task) => task.title).join(", ")}
    >
      <span className="day-cell__number">{dayNumber(day)}</span>
      <WorkloadDot totalMinutes={totalMinutes} />
    </button>
  );
}
