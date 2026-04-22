"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTaskStore } from "./store/taskStore";
import { useTasks } from "./hooks/useTasks";
import { useTodayView } from "./hooks/useTodayView";
import { useSubjectColors } from "./hooks/useSubjectColors";
import PageWrapper from "./components/Layout/PageWrapper";
import Sidebar from "./components/Layout/Sidebar";
import TopBar from "./components/Layout/TopBar";
import OverviewView from "./components/Overview/OverviewView";
import TodayView from "./components/Today/TodayView";
import KanbanBoard from "./components/Board/KanbanBoard";
import CalendarGrid from "./components/Calendar/CalendarGrid";
import FocusModal from "./components/Focus/FocusModal";
import NewTaskModal from "./components/Task/NewTaskModal";
import EditTaskModal from "./components/Task/EditTaskModal";
import Button from "./components/UI/Button";
import Input from "./components/UI/Input";

const DEFAULT_FILTERS = {
  search: "",
  subject: "",
  status: "",
  priority: "",
  type: "",
};

function NameGate({ onSubmit }) {
  const [value, setValue] = useState("");
  return (
    <div className="name-gate">
      <div className="name-gate__card">
        <h1>What should we call you?</h1>
        <Input value={value} onChange={(event) => setValue(event.target.value)} />
        <Button onClick={() => value.trim() && onSubmit(value.trim())}>Let&apos;s go</Button>
      </div>
    </div>
  );
}

export default function App() {
  const searchRef = useRef(null);
  const [view, setView] = useState("overview");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState("smart");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [newTaskStatus, setNewTaskStatus] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [focusTask, setFocusTask] = useState(null);

  const {
    hydrated,
    prefs,
    tasks,
    initializeStore,
    setTheme,
    setName,
    addTask,
    updateTask,
    deleteTask,
    toggleSubtask,
    addSession,
    completeTask,
    reorderTasks,
    saveViewPreset,
    dismissShortcutHint,
  } = useTaskStore();
  const { subjectColorMap, getSubjectColor } = useSubjectColors();
  const taskData = useTasks(filters, sortBy);
  const todayData = useTodayView();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  useEffect(() => {
    document.documentElement.dataset.theme = prefs.theme;
  }, [prefs.theme]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.target.matches("input, textarea, select")) return;
      if (event.key === "n") setNewTaskStatus("backlog");
      if (event.key === "Escape") {
        setNewTaskStatus("");
        setEditingTask(null);
        setFocusTask(null);
      }
      if (event.key === "/") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "b") setView("board");
      if (event.key === "t") setView("today");
      if (event.key === "o") setView("overview");
      if (event.key === "c") setView("calendar");
      if (event.key === "f") {
        const firstTask = tasks.find((task) => task.status === "in-progress");
        if (firstTask) setFocusTask(firstTask);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tasks]);

  const subjects = useMemo(
    () =>
      Object.keys(subjectColorMap).sort().map((name) => ({
        name,
        color: getSubjectColor(name),
      })),
    [getSubjectColor, subjectColorMap],
  );

  if (!hydrated) return null;
  if (!prefs.name) return <NameGate onSubmit={setName} />;

  const applyPreset = (presetName) => {
    const preset = prefs.savedViews.find((item) => item.name === presetName);
    if (preset) setFilters(preset.filters);
  };

  return (
    <div className="app-shell">
      <Sidebar
        name={prefs.name}
        currentView={view}
        onChangeView={setView}
        subjects={subjects}
        activeSubject={filters.subject}
        onSelectSubject={(subject) => {
          setView("overview");
          setFilters((current) => ({ ...current, subject }));
        }}
        streak={taskData.streak}
        sessionsThisWeekCount={taskData.sessionsThisWeekCount}
        theme={prefs.theme}
        onThemeChange={setTheme}
      />
      <PageWrapper>
        <TopBar view={view} onNewTask={() => setNewTaskStatus("backlog")} />
        {!tasks.length ? (
          <div className="empty-state">
            <h2>No tasks yet. Press N to add your first one.</h2>
          </div>
        ) : null}
        {view === "today" && tasks.length ? (
          <TodayView
            data={todayData}
            colors={subjectColorMap}
            onFocus={(task) => setFocusTask(task)}
          />
        ) : null}
        {view === "overview" && tasks.length ? (
          <OverviewView
            {...taskData}
            filteredTasks={taskData.filteredTasks}
            filters={filters}
            sortBy={sortBy}
            colors={subjectColorMap}
            subjects={subjects.map((subject) => subject.name)}
            savedViews={prefs.savedViews}
            searchRef={searchRef}
            onFilterChange={(key, value) => {
              if (key === "preset") return applyPreset(value);
              setFilters((current) => ({ ...current, [key]: value }));
              dismissShortcutHint();
            }}
            onSortChange={setSortBy}
            onClear={() => setFilters(DEFAULT_FILTERS)}
            onSaveView={() => {
              const name = window.prompt("Name this view");
              if (name) saveViewPreset({ name, filters });
            }}
            onFocus={(task) => setFocusTask(task)}
            onToggleSubtask={toggleSubtask}
            showShortcutHint={!prefs.shortcutHintDismissed}
            onDismissShortcutHint={dismissShortcutHint}
          />
        ) : null}
        {view === "board" && tasks.length ? (
          <KanbanBoard
            tasks={tasks}
            colors={subjectColorMap}
            onQuickAdd={setNewTaskStatus}
            onFocus={setFocusTask}
            onComplete={completeTask}
            onEdit={setEditingTask}
            onDelete={deleteTask}
            onReorder={reorderTasks}
          />
        ) : null}
        {view === "calendar" && tasks.length ? (
          <CalendarGrid
            currentMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            getTasksForDay={taskData.getTasksForDay}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />
        ) : null}
        <div className="shortcut-bar">N new task / T today / search / B board / O overview / C calendar / F focus / Esc close</div>
      </PageWrapper>
      {newTaskStatus ? (
        <NewTaskModal
          subjects={subjects.map((subject) => subject.name)}
          defaultStatus={newTaskStatus}
          onSubmit={(task) => {
            addTask(task);
            setNewTaskStatus("");
          }}
          onClose={() => setNewTaskStatus("")}
        />
      ) : null}
      {editingTask ? (
        <EditTaskModal
          initialTask={editingTask}
          subjects={subjects.map((subject) => subject.name)}
          onSubmit={(task) => {
            updateTask(task.id, task);
            setEditingTask(null);
          }}
          onClose={() => setEditingTask(null)}
        />
      ) : null}
      {focusTask ? (
        <FocusModal
          task={tasks.find((task) => task.id === focusTask.id) || focusTask}
          color={getSubjectColor(focusTask.subject)}
          onClose={() => setFocusTask(null)}
          onComplete={completeTask}
          onToggleSubtask={toggleSubtask}
          onNotesSave={(taskId, notes) => updateTask(taskId, { notes })}
          onLogSession={addSession}
        />
      ) : null}
    </div>
  );
}
