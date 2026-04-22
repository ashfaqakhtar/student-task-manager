import { nanoid } from "nanoid";
import { addDays, addWeeks } from "date-fns";
import { create } from "zustand";
import { readLocalStorage, writeLocalStorage } from "../hooks/useLocalStorage";
import { getNextRecurringDate } from "../utils/dates";
import { getNextSubjectColor } from "../utils/subjectColors";

export const TASKS_KEY = "ssp_tasks";
export const SUBJECT_COLORS_KEY = "ssp_subject_colors";
export const PREFS_KEY = "ssp_prefs";

export const defaultPrefs = {
  theme: "light",
  name: "",
  savedViews: [],
  shortcutHintDismissed: false,
};

function normalizeTask(task) {
  return {
    ...task,
    scheduledDate: task.scheduledDate || null,
    effort: task.effort || "medium",
    notes: task.notes || "",
    links: task.links || [],
    subtasks: task.subtasks || [],
    sessions: task.sessions || [],
  };
}

function persist(get) {
  const { tasks, prefs, subjectColorMap } = get();
  writeLocalStorage(TASKS_KEY, tasks);
  writeLocalStorage(PREFS_KEY, prefs);
  writeLocalStorage(SUBJECT_COLORS_KEY, subjectColorMap);
}

function cloneRecurringTask(task) {
  const nextDate = getNextRecurringDate(task);
  if (!nextDate) return null;
  const nextScheduledDate = task.scheduledDate
    ? task.recurring.frequency === "daily"
      ? addDays(new Date(task.scheduledDate), 1)
      : addWeeks(new Date(task.scheduledDate), 1)
    : null;

  return {
    ...task,
    id: nanoid(),
    status: "backlog",
    completedAt: null,
    sessions: [],
    createdAt: new Date().toISOString(),
    deadline: nextDate.toISOString(),
    scheduledDate: nextScheduledDate ? nextScheduledDate.toISOString() : null,
    subtasks: task.subtasks.map((subtask) => ({ ...subtask, done: false })),
  };
}

function ensureRecurringTasks(tasks) {
  const taskList = tasks.map(normalizeTask);

  tasks.forEach((task) => {
    if (!task.recurring || !task.completedAt || !task.deadline) return;

    let nextDate = getNextRecurringDate(task);
    while (nextDate && nextDate < new Date()) {
      const existingFutureTask = taskList.find(
        (candidate) =>
          candidate.title === task.title &&
          candidate.subject === task.subject &&
          candidate.type === task.type &&
          candidate.deadline === nextDate.toISOString(),
      );

      if (!existingFutureTask) {
        const nextTask = normalizeTask({
          ...cloneRecurringTask({ ...normalizeTask(task), deadline: nextDate.toISOString() }),
        });
        taskList.push(nextTask);
      }

      nextDate = task.recurring.frequency === "daily"
        ? addDays(nextDate, 1)
        : addWeeks(nextDate, 1);
    }
  });

  return taskList;
}

function buildSubjectColorMap(tasks, persistedMap) {
  return tasks.reduce((map, task) => {
    if (!task.subject) return map;
    if (map[task.subject]) return map;
    return { ...map, [task.subject]: getNextSubjectColor(map) };
  }, persistedMap);
}

export const useTaskStore = create((set, get) => ({
  tasks: [],
  prefs: defaultPrefs,
  subjectColorMap: {},
  hydrated: false,
  initializeStore: () => {
    const tasks = ensureRecurringTasks(readLocalStorage(TASKS_KEY, []));
    const prefs = { ...defaultPrefs, ...readLocalStorage(PREFS_KEY, defaultPrefs) };
    const subjectColorMap = buildSubjectColorMap(
      tasks,
      readLocalStorage(SUBJECT_COLORS_KEY, {}),
    );
    set({ tasks, prefs, subjectColorMap, hydrated: true });
    persist(get);
  },
  setTheme: (theme) => {
    set((state) => ({ prefs: { ...state.prefs, theme } }));
    persist(get);
  },
  setName: (name) => {
    set((state) => ({ prefs: { ...state.prefs, name } }));
    persist(get);
  },
  dismissShortcutHint: () => {
    set((state) => ({
      prefs: { ...state.prefs, shortcutHintDismissed: true },
    }));
    persist(get);
  },
  saveViewPreset: (preset) => {
    set((state) => ({
      prefs: {
        ...state.prefs,
        savedViews: [
          ...state.prefs.savedViews.filter((item) => item.name !== preset.name),
          preset,
        ],
      },
    }));
    persist(get);
  },
  ensureSubjectColor: (subject) => {
    if (!subject) return null;
    const trimmed = subject.trim();
    const existing = get().subjectColorMap[trimmed];
    if (existing) return existing;
    const color = getNextSubjectColor(get().subjectColorMap);
    set((state) => ({
      subjectColorMap: { ...state.subjectColorMap, [trimmed]: color },
    }));
    persist(get);
    return color;
  },
  addTask: (task) => {
    get().ensureSubjectColor(task.subject);
    set((state) => ({ tasks: [normalizeTask(task), ...state.tasks] }));
    persist(get);
  },
  updateTask: (taskId, updates) => {
    if (updates.subject) get().ensureSubjectColor(updates.subject);
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? normalizeTask({ ...task, ...updates }) : task,
      ),
    }));
    persist(get);
  },
  deleteTask: (taskId) => {
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== taskId) }));
    persist(get);
  },
  toggleSubtask: (taskId, subtaskId) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id !== taskId
          ? task
          : {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId
                  ? { ...subtask, done: !subtask.done }
                  : subtask,
              ),
            },
      ),
    }));
    persist(get);
  },
  addSession: (taskId, session) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, sessions: [...task.sessions, session] }
          : task,
      ),
    }));
    persist(get);
  },
  completeTask: (taskId) => {
    let createdRecurringTask = null;
    set((state) => ({
      tasks: state.tasks.flatMap((task) => {
        if (task.id !== taskId) return [task];
        const completedTask = {
          ...task,
          status: "completed",
          completedAt: new Date().toISOString(),
        };
        if (task.recurring) {
          createdRecurringTask = cloneRecurringTask(completedTask);
        }
        return createdRecurringTask ? [completedTask, createdRecurringTask] : [completedTask];
      }),
    }));
    persist(get);
  },
  reorderTasks: ({ taskId, targetStatus, beforeTaskId }) => {
    if (beforeTaskId === taskId) return;
    const tasks = [...get().tasks];
    const sourceIndex = tasks.findIndex((task) => task.id === taskId);
    if (sourceIndex === -1) {
      console.error("Unable to reorder task: source not found", taskId);
      return;
    }
    const [movedTask] = tasks.splice(sourceIndex, 1);
    movedTask.status = targetStatus;
    const insertIndex = beforeTaskId
      ? tasks.findIndex((task) => task.id === beforeTaskId)
      : tasks.findLastIndex((task) => task.status === targetStatus) + 1;
    tasks.splice(insertIndex < 0 ? tasks.length : insertIndex, 0, movedTask);
    set({ tasks });
    persist(get);
  },
}));
