import { useMemo } from "react";
import {
  differenceInCalendarDays,
  format,
  isSameWeek,
  parseISO,
  startOfToday,
  subDays,
} from "date-fns";
import { useTaskStore } from "../store/taskStore";
import { getUrgency, priorityOrder, urgencyOrder } from "../utils/urgency";
import { isTaskOnDay } from "../utils/dates";

function matchesFilters(task, filters) {
  const search = filters.search.trim().toLowerCase();
  const titleText = `${task.title} ${task.notes}`.toLowerCase();

  return (
    (!search || titleText.includes(search)) &&
    (!filters.subject || task.subject === filters.subject) &&
    (!filters.status || task.status === filters.status) &&
    (!filters.priority || task.priority === filters.priority) &&
    (!filters.type || task.type === filters.type)
  );
}

function sortTasks(tasks, sortBy) {
  const defaultSort = [...tasks].sort((a, b) => {
    const urgencyA = urgencyOrder[getUrgency(a.deadline) || "none"];
    const urgencyB = urgencyOrder[getUrgency(b.deadline) || "none"];
    if (urgencyA !== urgencyB) return urgencyA - urgencyB;
    const weekA = a.deadline ? differenceInCalendarDays(parseISO(a.deadline), new Date()) : 999;
    const weekB = b.deadline ? differenceInCalendarDays(parseISO(b.deadline), new Date()) : 999;
    if (weekA !== weekB) return weekA - weekB;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  if (sortBy === "priority") {
    return [...tasks].sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
    );
  }
  if (sortBy === "title") {
    return [...tasks].sort((a, b) => a.title.localeCompare(b.title));
  }
  if (sortBy === "deadline") {
    return [...tasks].sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return a.deadline.localeCompare(b.deadline);
    });
  }
  return defaultSort;
}

function buildStreak(tasks) {
  const sessionDays = new Set();
  tasks.forEach((task) =>
    task.sessions.forEach((session) =>
      sessionDays.add(format(parseISO(session.endedAt), "yyyy-MM-dd")),
    ),
  );

  let streak = 0;
  let cursor = startOfToday();
  while (sessionDays.has(format(cursor, "yyyy-MM-dd"))) {
    streak += 1;
    cursor = subDays(cursor, 1);
  }
  return streak;
}

export function useTasks(filters, sortBy) {
  const tasks = useTaskStore((state) => state.tasks);

  return useMemo(() => {
    const filteredTasks = sortTasks(
      tasks.filter((task) => matchesFilters(task, filters)),
      sortBy,
    );
    const activeTasks = tasks.filter((task) => task.status !== "completed");
    const dueToday = activeTasks.filter((task) => getUrgency(task.deadline) === "today");
    const upcoming = activeTasks
      .filter((task) => task.deadline)
      .sort((a, b) => a.deadline.localeCompare(b.deadline));
    const sessionsThisWeek = tasks.flatMap((task) =>
      task.sessions.filter((session) =>
        isSameWeek(parseISO(session.endedAt), new Date(), { weekStartsOn: 1 }),
      ),
    );
    const studyHoursThisWeek =
      sessionsThisWeek.reduce((sum, session) => sum + session.durationMinutes, 0) / 60;

    return {
      tasks,
      filteredTasks,
      activeTasks,
      dueTodayCount: dueToday.length,
      estimatedHoursThisWeek:
        activeTasks.reduce((sum, task) => sum + Number(task.estimatedMinutes || 0), 0) / 60,
      completionRate: tasks.length
        ? Math.round(
            (tasks.filter((task) => task.status === "completed").length / tasks.length) *
              100,
          )
        : 0,
      streak: buildStreak(tasks),
      upcomingTasks: upcoming,
      studyHoursThisWeek,
      sessionsThisWeekCount: sessionsThisWeek.length,
      getTasksForDay: (day) => tasks.filter((task) => isTaskOnDay(task, day)),
    };
  }, [filters, sortBy, tasks]);
}
