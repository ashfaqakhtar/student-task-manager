import { nanoid } from "nanoid";
import { addDays, addWeeks } from "date-fns";
import { create } from "zustand";
import { readLocalStorage, writeLocalStorage } from "../hooks/useLocalStorage";
import { getNextRecurringDate } from "../utils/dates";
import { getNextSubjectColor } from "../utils/subjectColors";
import { apiClient } from "../utils/apiClient";

export const SUBJECT_COLORS_KEY = "ssp_subject_colors";
export const PREFS_KEY = "ssp_prefs";

export const defaultPrefs = {
  theme: "light",
  savedViews: [],
  shortcutHintDismissed: false,
};

function normalizeTask(task) {
  return {
    ...task,
    id: task.id || nanoid(),
    scheduledDate: task.scheduledDate || null,
    effort: task.effort || "medium",
    notes: task.notes || "",
    links: task.links || [],
    subtasks: task.subtasks || [],
    syllabus: task.syllabus || null,
    sessions: task.sessions || [],
  };
}

function buildSubjectColorMap(tasks, persistedMap) {
  return tasks.reduce((map, task) => {
    if (!task.subject) return map;
    if (map[task.subject]) return map;
    return { ...map, [task.subject]: getNextSubjectColor(map) };
  }, persistedMap);
}

function persistLocalState(get) {
  const { prefs, subjectColorMap } = get();
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

export const useTaskStore = create((set, get) => ({
  tasks: [],
  prefs: defaultPrefs,
  subjectColorMap: {},
  hydrated: false,
  user: null,
  authEmail: "",
  authMode: "login",
  adminData: { users: [], tasks: [] },
  initializeStore: async () => {
    const prefs = { ...defaultPrefs, ...readLocalStorage(PREFS_KEY, defaultPrefs) };
    const persistedColorMap = readLocalStorage(SUBJECT_COLORS_KEY, {});
    set({ prefs, subjectColorMap: persistedColorMap });

    try {
      const auth = await apiClient("/api/auth/me", { method: "GET" });
      const user = auth.user;
      if (user) {
        const taskResponse = await apiClient("/api/tasks", { method: "GET" });
        const tasks = taskResponse.tasks.map(normalizeTask);
        set({
          user,
          tasks,
          subjectColorMap: buildSubjectColorMap(tasks, persistedColorMap),
          hydrated: true,
        });
      } else {
        set({ user: null, tasks: [], hydrated: true });
      }
    } catch (error) {
      console.error("Failed to initialize app state", error);
      set({ user: null, tasks: [], hydrated: true });
    }

    persistLocalState(get);
  },
  setTheme: (theme) => {
    set((state) => ({ prefs: { ...state.prefs, theme } }));
    persistLocalState(get);
  },
  dismissShortcutHint: () => {
    set((state) => ({
      prefs: { ...state.prefs, shortcutHintDismissed: true },
    }));
    persistLocalState(get);
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
    persistLocalState(get);
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
    persistLocalState(get);
    return color;
  },
  registerUser: async (payload) => {
    const response = await apiClient("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    set({ authEmail: response.email, authMode: "verify" });
    return response;
  },
  verifyOtp: async (payload) => {
    const response = await apiClient("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const user = response.user;
    set({ user, authEmail: "", authMode: "login" });
    const taskResponse = await apiClient("/api/tasks", { method: "GET" });
    const tasks = taskResponse.tasks.map(normalizeTask);
    set((state) => ({
      tasks,
      subjectColorMap: buildSubjectColorMap(tasks, state.subjectColorMap),
    }));
    persistLocalState(get);
    return response;
  },
  loginUser: async (payload) => {
    const response = await apiClient("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const user = response.user;
    const taskResponse = await apiClient("/api/tasks", { method: "GET" });
    const tasks = taskResponse.tasks.map(normalizeTask);
    set((state) => ({
      user,
      tasks,
      subjectColorMap: buildSubjectColorMap(tasks, state.subjectColorMap),
      authMode: "login",
      authEmail: "",
    }));
    persistLocalState(get);
    return response;
  },
  logoutUser: async () => {
    await apiClient("/api/auth/logout", { method: "POST" });
    set({ user: null, tasks: [], adminData: { users: [], tasks: [] } });
  },
  changePassword: async (payload) => {
    return apiClient("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  setAuthMode: (authMode) => set({ authMode }),
  setAuthEmail: (authEmail) => set({ authEmail }),
  fetchTasks: async () => {
    const response = await apiClient("/api/tasks", { method: "GET" });
    const tasks = response.tasks.map(normalizeTask);
    set((state) => ({
      tasks,
      subjectColorMap: buildSubjectColorMap(tasks, state.subjectColorMap),
    }));
    persistLocalState(get);
  },
  addTask: async (task) => {
    get().ensureSubjectColor(task.subject);
    const response = await apiClient("/api/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    });
    set((state) => ({ tasks: [normalizeTask(response.task), ...state.tasks] }));
    persistLocalState(get);
  },
  updateTask: async (taskId, updates) => {
    if (updates.subject) get().ensureSubjectColor(updates.subject);
    const response = await apiClient(`/api/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    set((state) => ({
      tasks: state.tasks.flatMap((task) => {
        if (task.id !== taskId) return [task];
        const base = normalizeTask(response.task);
        const recurringTask = response.recurringTask
          ? [normalizeTask(response.recurringTask)]
          : [];
        return [base, ...recurringTask];
      }),
    }));
    persistLocalState(get);
  },
  deleteTask: async (taskId) => {
    await apiClient(`/api/tasks/${taskId}`, { method: "DELETE" });
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== taskId) }));
  },
  toggleSubtask: async (taskId, subtaskId) => {
    const task = get().tasks.find((item) => item.id === taskId);
    if (!task) return;
    const subtasks = task.subtasks.map((subtask) =>
      subtask.id === subtaskId ? { ...subtask, done: !subtask.done } : subtask,
    );
    await get().updateTask(taskId, { subtasks });
  },
  toggleSyllabusTopic: async (taskId, topicId) => {
    const task = get().tasks.find((item) => item.id === taskId);
    if (!task?.syllabus) return;
    const topics = (task.syllabus.topics || []).map((topic) =>
      topic.id === topicId ? { ...topic, done: !topic.done } : topic,
    );
    await get().updateTask(taskId, {
      syllabus: {
        ...task.syllabus,
        topics,
      },
    });
  },
  addSession: async (taskId, session) => {
    const task = get().tasks.find((item) => item.id === taskId);
    if (!task) return;
    await get().updateTask(taskId, { sessions: [...task.sessions, session] });
  },
  completeTask: async (taskId) => {
    const task = get().tasks.find((item) => item.id === taskId);
    if (!task) return;
    await get().updateTask(taskId, {
      status: "completed",
      completedAt: new Date().toISOString(),
    });
  },
  reorderTasks: async ({ taskId, targetStatus }) => {
    const response = await apiClient("/api/tasks/reorder", {
      method: "POST",
      body: JSON.stringify({ taskId, targetStatus }),
    });
    const tasks = response.tasks.map(normalizeTask);
    set({ tasks });
  },
  loadAdminOverview: async () => {
    const response = await apiClient("/api/admin/overview", { method: "GET" });
    set({ adminData: response });
  },
  updateUserRole: async (userId, role) => {
    await apiClient(`/api/admin/users/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    await get().loadAdminOverview();
  },
  deleteTaskAsAdmin: async (taskId) => {
    await apiClient(`/api/admin/tasks/${taskId}`, { method: "DELETE" });
    await get().loadAdminOverview();
    await get().fetchTasks();
  },
  createLocalRecurringTask: cloneRecurringTask,
}));
