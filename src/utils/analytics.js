import {
  addDays,
  differenceInCalendarDays,
  format,
  isSameDay,
  parseISO,
  startOfToday,
} from "date-fns";
import { getUrgency } from "./urgency";

function getTaskMinutes(task) {
  return Number(task.estimatedMinutes || 0);
}

function getSessionMinutes(task) {
  return (task.sessions || []).reduce(
    (sum, session) => sum + Number(session.durationMinutes || 0),
    0,
  );
}

function getTaskDate(task) {
  return task.scheduledDate || task.deadline || null;
}

function getSubtaskCompletion(task) {
  const subtasks = task.subtasks || [];
  if (!subtasks.length) return 0;
  const completed = subtasks.filter((subtask) => subtask.done).length;
  return Math.round((completed / subtasks.length) * 100);
}

function buildSubjectInsights(tasks) {
  const groups = new Map();

  tasks.forEach((task) => {
    const current = groups.get(task.subject) || {
      subject: task.subject,
      activeCount: 0,
      completedCount: 0,
      minutesPlanned: 0,
      minutesLogged: 0,
      averageProgress: 0,
      progressSamples: 0,
    };

    if (task.status === "completed") {
      current.completedCount += 1;
    } else {
      current.activeCount += 1;
      current.minutesPlanned += getTaskMinutes(task);
    }

    current.minutesLogged += getSessionMinutes(task);

    if ((task.subtasks || []).length) {
      current.averageProgress += getSubtaskCompletion(task);
      current.progressSamples += 1;
    }

    groups.set(task.subject, current);
  });

  return [...groups.values()]
    .map((item) => ({
      ...item,
      averageProgress: item.progressSamples
        ? Math.round(item.averageProgress / item.progressSamples)
        : null,
      completionRate:
        item.activeCount + item.completedCount
          ? Math.round((item.completedCount / (item.activeCount + item.completedCount)) * 100)
          : 0,
    }))
    .sort((a, b) => b.minutesPlanned - a.minutesPlanned || b.activeCount - a.activeCount)
    .slice(0, 5);
}

function buildWeeklyForecast(activeTasks) {
  const today = startOfToday();

  return Array.from({ length: 7 }, (_, index) => {
    const day = addDays(today, index);
    const dayTasks = activeTasks.filter((task) => {
      const taskDate = getTaskDate(task);
      if (!taskDate) return false;
      return isSameDay(parseISO(taskDate), day);
    });
    const minutes = dayTasks.reduce((sum, task) => sum + getTaskMinutes(task), 0);

    return {
      dateKey: format(day, "yyyy-MM-dd"),
      label: format(day, index === 0 ? "'Today'" : "EEE"),
      shortDate: format(day, "MMM d"),
      taskCount: dayTasks.length,
      minutes,
      intensity:
        minutes >= 240 ? "heavy" : minutes >= 120 ? "steady" : minutes > 0 ? "light" : "free",
    };
  });
}

function getHealthScore({
  overdueCount,
  dueSoonCount,
  unscheduledCount,
  highPriorityBacklogCount,
  completionRate,
}) {
  const penalty =
    overdueCount * 14 +
    dueSoonCount * 7 +
    unscheduledCount * 3 +
    highPriorityBacklogCount * 4;

  return Math.max(18, Math.min(96, 82 + Math.round(completionRate * 0.18) - penalty));
}

function getHealthLabel(score) {
  if (score >= 80) return "On track";
  if (score >= 60) return "Needs attention";
  return "At risk";
}

function buildHealthExplanation({
  completionRate,
  overdueCount,
  dueSoonCount,
  unscheduledCount,
  highPriorityBacklogCount,
  healthScore,
}) {
  const reasons = [];

  if (overdueCount) reasons.push(`${overdueCount} overdue`);
  if (dueSoonCount) reasons.push(`${dueSoonCount} due soon`);
  if (unscheduledCount) reasons.push(`${unscheduledCount} unscheduled`);
  if (highPriorityBacklogCount) reasons.push(`${highPriorityBacklogCount} high-priority backlog`);

  if (!reasons.length && completionRate === 0) {
    return `Score ${healthScore}: a clean start, but no completed work is recorded yet.`;
  }

  if (!reasons.length) {
    return `Score ${healthScore}: your current plan is in a healthy range.`;
  }

  return `Score ${healthScore}: affected by ${reasons.join(", ")}.`;
}

function buildHighlights({
  overdueCount,
  dueSoonCount,
  unscheduledCount,
  mostLoadedDay,
  topSubject,
}) {
  const highlights = [];

  if (overdueCount) {
    highlights.push(`${overdueCount} overdue task${overdueCount > 1 ? "s" : ""} need attention.`);
  } else {
    highlights.push("No overdue tasks right now.");
  }

  if (dueSoonCount) {
    highlights.push(`${dueSoonCount} task${dueSoonCount > 1 ? "s are" : " is"} due within 3 days.`);
  }

  if (unscheduledCount) {
    highlights.push(`${unscheduledCount} active task${unscheduledCount > 1 ? "s have" : " has"} no study slot yet.`);
  }

  if (mostLoadedDay?.minutes) {
    highlights.push(
      `${mostLoadedDay.label} is the heaviest day with ${mostLoadedDay.minutes} planned minutes.`,
    );
  }

  if (topSubject) {
    highlights.push(`${topSubject.subject} is carrying the highest current workload.`);
  }

  return highlights.slice(0, 3);
}

export function analyzeTasks(tasks) {
  const activeTasks = tasks.filter((task) => task.status !== "completed");
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const overdueCount = activeTasks.filter((task) => getUrgency(task.deadline) === "overdue").length;
  const dueSoonCount = activeTasks.filter((task) => {
    if (!task.deadline) return false;
    const days = differenceInCalendarDays(parseISO(task.deadline), new Date());
    return days >= 0 && days <= 3;
  }).length;
  const unscheduledCount = activeTasks.filter((task) => !task.scheduledDate).length;
  const highPriorityBacklogCount = activeTasks.filter(
    (task) => task.priority === "high" && task.status === "backlog",
  ).length;
  const completionRate = tasks.length
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;
  const weeklyForecast = buildWeeklyForecast(activeTasks);
  const subjectInsights = buildSubjectInsights(tasks);
  const mostLoadedDay = [...weeklyForecast].sort((a, b) => b.minutes - a.minutes)[0];
  const topSubject = subjectInsights[0] || null;
  const healthScore = getHealthScore({
    overdueCount,
    dueSoonCount,
    unscheduledCount,
    highPriorityBacklogCount,
    completionRate,
  });

  return {
    healthScore,
    healthLabel: getHealthLabel(healthScore),
    healthExplanation: buildHealthExplanation({
      completionRate,
      overdueCount,
      dueSoonCount,
      unscheduledCount,
      highPriorityBacklogCount,
      healthScore,
    }),
    overdueCount,
    dueSoonCount,
    unscheduledCount,
    highPriorityBacklogCount,
    averageTaskSize:
      activeTasks.length
        ? Math.round(activeTasks.reduce((sum, task) => sum + getTaskMinutes(task), 0) / activeTasks.length)
        : 0,
    focusHoursLogged:
      tasks.reduce((sum, task) => sum + getSessionMinutes(task), 0) / 60,
    completionRate,
    subjectInsights,
    weeklyForecast,
    highlights: buildHighlights({
      overdueCount,
      dueSoonCount,
      unscheduledCount,
      mostLoadedDay,
      topSubject,
    }),
  };
}
