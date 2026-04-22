import {
  differenceInCalendarDays,
  isSameDay,
  parseISO,
  startOfToday,
} from "date-fns";
import { getUrgency, priorityOrder } from "./urgency";

const urgencyScoreMap = {
  overdue: 42,
  today: 36,
  tomorrow: 24,
  soon: 16,
  upcoming: 8,
  none: 0,
};

const effortScoreMap = {
  light: 10,
  medium: 6,
  deep: 2,
};

function scoreScheduledDate(task) {
  if (!task.scheduledDate) return 0;
  const scheduledDate = parseISO(task.scheduledDate);
  const today = startOfToday();

  if (isSameDay(scheduledDate, today)) return 18;

  const diff = differenceInCalendarDays(scheduledDate, today);
  if (diff < 0) return 12;
  if (diff === 1) return 6;
  return 0;
}

export function getTaskRank(task) {
  if (task.status === "completed") return -999;

  const urgency = getUrgency(task.deadline) || "none";
  const priorityWeight = 12 - priorityOrder[task.priority] * 4;
  const effortWeight = effortScoreMap[task.effort || "medium"] || 0;
  const inProgressWeight = task.status === "in-progress" ? 14 : 0;
  const thisWeekWeight = task.status === "this-week" ? 6 : 0;
  const shortTaskWeight = Number(task.estimatedMinutes || 0) <= 45 ? 6 : 0;

  return (
    urgencyScoreMap[urgency] +
    priorityWeight +
    effortWeight +
    inProgressWeight +
    thisWeekWeight +
    shortTaskWeight +
    scoreScheduledDate(task)
  );
}

export function rankTasks(tasks) {
  return [...tasks].sort((a, b) => getTaskRank(b) - getTaskRank(a));
}

export function isQuickWin(task) {
  return task.status !== "completed" && Number(task.estimatedMinutes || 0) <= 30;
}
