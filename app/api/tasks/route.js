import { nanoid } from "nanoid";
import connectDB from "../../../src/auth/db/dbConnection.js";
import Task from "../../../src/auth/model/Task.model.js";
import { apiError, apiResponse } from "../../../src/auth/utils/api.js";
import { serializeTask } from "../../../src/auth/utils/serialize.js";
import { requireUser } from "../../../src/auth/utils/session.js";
import { ensureRecurringTasksForUser } from "../../../src/auth/utils/tasks.js";

export async function GET() {
  try {
    const user = await requireUser();
    await connectDB();
    await ensureRecurringTasksForUser(user._id);
    const tasks = await Task.find({ userId: user._id }).sort({ createdAt: -1 });
    return apiResponse({ success: true, tasks: tasks.map(serializeTask) });
  } catch (error) {
    return apiError(error.message || "Failed to load tasks.", error.status || 500);
  }
}

export async function POST(request) {
  try {
    const user = await requireUser();
    const payload = await request.json();
    await connectDB();

    const task = await Task.create({
      publicId: payload.id || nanoid(),
      userId: user._id,
      title: payload.title,
      subject: payload.subject,
      type: payload.type,
      priority: payload.priority,
      status: payload.status,
      estimatedMinutes: payload.estimatedMinutes,
      deadline: payload.deadline,
      scheduledDate: payload.scheduledDate,
      effort: payload.effort,
      notes: payload.notes,
      links: payload.links,
      subtasks: payload.subtasks,
      sessions: payload.sessions,
      recurring: payload.recurring,
      completedAt: payload.completedAt,
    });

    return apiResponse({ success: true, task: serializeTask(task) }, { status: 201 });
  } catch (error) {
    console.error(error);
    return apiError(error.message || "Failed to create task.", error.status || 500);
  }
}
