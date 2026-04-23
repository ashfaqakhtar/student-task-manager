import { useMemo } from "react";
import { isSameDay, parseISO, startOfToday } from "date-fns";
import { useTaskStore } from "../store/taskStore";
import { getUrgency } from "../utils/urgency";
import { getRecommendationReasons, isQuickWin, rankTasks } from "../utils/taskRanking";

export function useTodayView() {
  const tasks = useTaskStore((state) => state.tasks);

  return useMemo(() => {
    const today = startOfToday();
    const activeTasks = tasks.filter((task) => task.status !== "completed");
    const plannedToday = activeTasks.filter(
      (task) => task.scheduledDate && isSameDay(parseISO(task.scheduledDate), today),
    );
    const dueToday = activeTasks.filter((task) => getUrgency(task.deadline) === "today");
    const inProgress = activeTasks.filter((task) => task.status === "in-progress");
    const quickWins = rankTasks(activeTasks.filter(isQuickWin)).slice(0, 4);
    const recommended = rankTasks(activeTasks)
      .slice(0, 3)
      .map((task) => ({
        ...task,
        recommendationReasons: getRecommendationReasons(task),
      }));
    const totalPlannedMinutes = plannedToday.reduce(
      (sum, task) => sum + Number(task.estimatedMinutes || 0),
      0,
    );

    return {
      recommended,
      plannedToday,
      dueToday,
      inProgress,
      quickWins,
      totalPlannedMinutes,
      totalRecommendedMinutes: recommended.reduce(
        (sum, task) => sum + Number(task.estimatedMinutes || 0),
        0,
      ),
    };
  }, [tasks]);
}
