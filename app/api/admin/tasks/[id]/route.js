import connectDB from "../../../../../src/auth/db/dbConnection.js";
import Task from "../../../../../src/auth/model/Task.model.js";
import { apiError, apiResponse } from "../../../../../src/auth/utils/api.js";
import { requireAdmin } from "../../../../../src/auth/utils/session.js";

export async function DELETE(_, { params }) {
  try {
    await requireAdmin();
    const { id } = params;
    await connectDB();
    await Task.findOneAndDelete({ publicId: id });
    return apiResponse({ success: true });
  } catch (error) {
    return apiError(error.message || "Failed to delete task.", error.status || 500);
  }
}
