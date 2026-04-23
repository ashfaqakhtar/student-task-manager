import { addDays, addWeeks, isBefore, startOfDay } from "date-fns";
import { nanoid } from "nanoid";
import Task from "../model/Task.model.js";

function nextDateForTask(task) {
  if (!task.recurring || !task.deadline) return null;
  const deadline = new Date(task.deadline);
  return task.recurring.frequency === "daily" ? addDays(deadline, 1) : addWeeks(deadline, 1);
}

async function createRecurringClone(task, deadline, scheduledDate) {
  return Task.create({
    publicId: nanoid(),
    userId: task.userId,
    title: task.title,
    subject: task.subject,
    type: task.type,
    priority: task.priority,
    status: "backlog",
    estimatedMinutes: task.estimatedMinutes,
    deadline,
    scheduledDate,
    effort: task.effort,
    notes: task.notes,
    links: task.links,
    subtasks: task.subtasks.map((subtask) => ({ ...subtask.toObject?.() || subtask, done: false })),
    sessions: [],
    recurring: task.recurring,
    completedAt: null,
  });
}

export async function ensureRecurringTasksForUser(userId) {
  const recurringTasks = await Task.find({
    userId,
    recurring: { $ne: null },
    completedAt: { $ne: null },
    deadline: { $ne: null },
  });

  for (const task of recurringTasks) {
    let nextDeadline = nextDateForTask(task);
    while (nextDeadline && isBefore(nextDeadline, startOfDay(new Date()))) {
      const existing = await Task.findOne({
        userId,
        title: task.title,
        subject: task.subject,
        type: task.type,
        deadline: nextDeadline,
      });

      if (!existing) {
        const nextScheduled = task.scheduledDate
          ? task.recurring.frequency === "daily"
            ? addDays(new Date(task.scheduledDate), 1)
            : addWeeks(new Date(task.scheduledDate), 1)
          : null;
        await createRecurringClone(task, nextDeadline, nextScheduled);
      }

      nextDeadline = task.recurring.frequency === "daily"
        ? addDays(nextDeadline, 1)
        : addWeeks(nextDeadline, 1);
    }
  }
}

export async function handleRecurringCompletion(task) {
  if (!task.recurring) return null;
  const nextDeadline = nextDateForTask(task);
  if (!nextDeadline) return null;
  const nextScheduled = task.scheduledDate
    ? task.recurring.frequency === "daily"
      ? addDays(new Date(task.scheduledDate), 1)
      : addWeeks(new Date(task.scheduledDate), 1)
    : null;

  const existing = await Task.findOne({
    userId: task.userId,
    title: task.title,
    subject: task.subject,
    type: task.type,
    deadline: nextDeadline,
  });

  if (existing) return existing;
  return createRecurringClone(task, nextDeadline, nextScheduled);
}
