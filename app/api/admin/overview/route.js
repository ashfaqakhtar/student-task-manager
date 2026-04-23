import connectDB from "../../../../src/auth/db/dbConnection.js";
import Task from "../../../../src/auth/model/Task.model.js";
import User from "../../../../src/auth/model/User.model.js";
import { apiError, apiResponse } from "../../../../src/auth/utils/api.js";
import { requireAdmin } from "../../../../src/auth/utils/session.js";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const users = await User.find().select("-password -otp -otpExpiry").sort({ createdAt: -1 });
    const tasks = await Task.find().sort({ createdAt: -1 }).limit(100);

    const userTaskCounts = await Task.aggregate([
      { $group: { _id: "$userId", taskCount: { $sum: 1 } } },
    ]);

    const countMap = new Map(
      userTaskCounts.map((item) => [item._id.toString(), item.taskCount]),
    );

    return apiResponse({
      success: true,
      users: users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        taskCount: countMap.get(user._id.toString()) || 0,
      })),
      tasks: tasks.map((task) => ({
        id: task.publicId,
        title: task.title,
        subject: task.subject,
        status: task.status,
        priority: task.priority,
        userId: task.userId.toString(),
      })),
    });
  } catch (error) {
    return apiError(error.message || "Failed to load admin data.", error.status || 500);
  }
}
