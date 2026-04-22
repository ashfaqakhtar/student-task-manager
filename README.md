# Smart Study Planner

Smart Study Planner is a premium-feel student task manager built with React, Vite, Zustand, `date-fns`, and localStorage persistence. It ships with a polished dark-first UI, Kanban planning, calendar workload mapping, Pomodoro focus mode, recurring tasks, subtasks, and saved filter views.

## Setup

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Features

- Overview dashboard with deadline timeline, smart sorting, combined filters, and saved views
- Kanban board with native HTML5 drag-and-drop across and within columns
- Monthly calendar with workload heatmap and day detail panel
- Focus mode with Pomodoro timer, session logging, inline notes, and subtask checklist
- Recurring tasks that automatically generate the next instance
- Subject color system persisted in localStorage
- Dark theme by default with a light mode toggle
- First-launch name prompt and zero-task empty state

## Keyboard Shortcuts

- `n` open a new task
- `Escape` close open modals
- `/` focus search
- `b` open Board
- `o` open Overview
- `c` open Calendar
- `f` open Focus mode for the first task in progress
