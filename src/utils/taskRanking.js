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

function scoreSubtaskProgress(task) {
  const subtasks = task.subtasks || [];
  if (!subtasks.length) return 0;

  const completed = subtasks.filter((subtask) => subtask.done).length;
  const ratio = completed / subtasks.length;

  if (ratio >= 0.8) return 8;
  if (ratio >= 0.4) return 4;
  return 0;
}

export function getTaskScoreBreakdown(task) {
  const urgency = getUrgency(task.deadline) || "none";
  const shortTaskWeight = Number(task.estimatedMinutes || 0) <= 45 ? 6 : 0;

  return {
    urgency,
    urgencyWeight: urgencyScoreMap[urgency],
    priorityWeight: 12 - priorityOrder[task.priority] * 4,
    effortWeight: effortScoreMap[task.effort || "medium"] || 0,
    inProgressWeight: task.status === "in-progress" ? 14 : 0,
    thisWeekWeight: task.status === "this-week" ? 6 : 0,
    shortTaskWeight,
    scheduledWeight: scoreScheduledDate(task),
    progressWeight: scoreSubtaskProgress(task),
  };
}

export function getTaskRank(task) {
  if (task.status === "completed") return -999;

  const breakdown = getTaskScoreBreakdown(task);

  return (
    breakdown.urgencyWeight +
    breakdown.priorityWeight +
    breakdown.effortWeight +
    breakdown.inProgressWeight +
    breakdown.thisWeekWeight +
    breakdown.shortTaskWeight +
    breakdown.scheduledWeight +
    breakdown.progressWeight
  );
}

export function rankTasks(tasks) {
  return [...tasks].sort((a, b) => getTaskRank(b) - getTaskRank(a));
}

export function isQuickWin(task) {
  return task.status !== "completed" && Number(task.estimatedMinutes || 0) <= 30;
}

export function getRecommendationReasons(task) {
  const breakdown = getTaskScoreBreakdown(task);
  const reasons = [];

  if (breakdown.urgency === "overdue") reasons.push("Overdue and needs recovery");
  if (breakdown.urgency === "today") reasons.push("Due today");
  if (breakdown.urgency === "tomorrow" || breakdown.urgency === "soon") {
    reasons.push("Deadline is approaching");
  }
  if (breakdown.inProgressWeight) reasons.push("Already in progress");
  if (breakdown.scheduledWeight >= 18) reasons.push("Scheduled for today");
  if (task.priority === "high") reasons.push("High priority");
  if (breakdown.shortTaskWeight) reasons.push("Fits a short focus block");
  if (breakdown.progressWeight) reasons.push("Close to finishing subtasks");
  if (!reasons.length) reasons.push("Strong balance of urgency and effort");

  return reasons.slice(0, 3);
}
