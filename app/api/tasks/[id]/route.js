import connectDB from "../../../../src/auth/db/dbConnection.js";
import Task from "../../../../src/auth/model/Task.model.js";
import { apiError, apiResponse } from "../../../../src/auth/utils/api.js";
import { serializeTask } from "../../../../src/auth/utils/serialize.js";
import { requireUser } from "../../../../src/auth/utils/session.js";
import { handleRecurringCompletion } from "../../../../src/auth/utils/tasks.js";

async function getTaskOrError(userId, taskId) {
  const task = await Task.findOne({ userId, publicId: taskId });
  if (!task) {
    const error = new Error("Task not found.");
    error.status = 404;
    throw error;
  }
  return task;
}

export async function PATCH(request, { params }) {
  try {
    const user = await requireUser();
    const { id } = params;
    const payload = await request.json();
    await connectDB();
    const task = await getTaskOrError(user._id, id);

    Object.assign(task, {
      ...payload,
      deadline: payload.deadline ?? task.deadline,
      scheduledDate: payload.scheduledDate ?? task.scheduledDate,
    });

    if (payload.status === "completed" && !task.completedAt) {
      task.completedAt = new Date();
      await task.save();
      const recurringTask = await handleRecurringCompletion(task);
      return apiResponse({
        success: true,
        task: serializeTask(task),
        recurringTask: recurringTask ? serializeTask(recurringTask) : null,
      });
    }

    if (payload.status && payload.status !== "completed") {
      task.completedAt = null;
    }

    await task.save();
    return apiResponse({ success: true, task: serializeTask(task) });
  } catch (error) {
    return apiError(error.message || "Failed to update task.", error.status || 500);
  }
}

export async function DELETE(_, { params }) {
  try {
    const user = await requireUser();
    const { id } = params;
    await connectDB();
    await Task.findOneAndDelete({ userId: user._id, publicId: id });
    return apiResponse({ success: true });
  } catch (error) {
    return apiError(error.message || "Failed to delete task.", error.status || 500);
  }
}
