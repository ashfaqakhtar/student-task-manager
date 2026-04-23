import connectDB from "../../../../src/auth/db/dbConnection.js";
import Task from "../../../../src/auth/model/Task.model.js";
import { apiError, apiResponse } from "../../../../src/auth/utils/api.js";
import { serializeTask } from "../../../../src/auth/utils/serialize.js";
import { requireUser } from "../../../../src/auth/utils/session.js";

export async function POST(request) {
  try {
    const user = await requireUser();
    const { taskId, targetStatus } = await request.json();
    await connectDB();
    const task = await Task.findOne({ userId: user._id, publicId: taskId });
    if (!task) return apiError("Task not found.", 404);

    task.status = targetStatus;
    await task.save();

    const tasks = await Task.find({ userId: user._id }).sort({ createdAt: -1 });
    return apiResponse({ success: true, tasks: tasks.map(serializeTask) });
  } catch (error) {
    return apiError(error.message || "Failed to reorder task.", error.status || 500);
  }
}
