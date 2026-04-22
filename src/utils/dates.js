import {
  addDays,
  addWeeks,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { getUrgency } from "./urgency";

export function getMonthGrid(date) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

export function formatDeadlineLabel(deadline) {
  const urgency = getUrgency(deadline);
  if (!deadline) return "No deadline";
  if (urgency === "today") return "Today";
  if (urgency === "tomorrow") return "Tomorrow";
  if (urgency === "overdue") return "Overdue";
  if (urgency === "soon") return `In ${Math.max(1, daysUntil(deadline))} days`;
  return format(parseISO(deadline), "MMM d");
}

export function formatDeadlineMeta(deadline) {
  if (!deadline) return "No deadline";
  return format(parseISO(deadline), "EEE, MMM d");
}

export function daysUntil(deadline) {
  return differenceInCalendarDays(parseISO(deadline), new Date());
}

export function isTaskOnDay(task, day) {
  if (!task.deadline) return false;
  return isSameDay(parseISO(task.deadline), day);
}

export function getNextRecurringDate(task) {
  if (!task.deadline || !task.recurring) return null;
  const deadline = parseISO(task.deadline);
  return task.recurring.frequency === "daily"
    ? addDays(deadline, 1)
    : addWeeks(deadline, 1);
}

export function monthLabel(date) {
  return format(date, "MMMM yyyy");
}

export function dayNumber(day) {
  return format(day, "d");
}

export function isCurrentMonth(day, currentMonth) {
  return isSameMonth(day, currentMonth);
}
