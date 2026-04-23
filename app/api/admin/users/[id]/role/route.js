import connectDB from "../../../../../../src/auth/db/dbConnection.js";
import User from "../../../../../../src/auth/model/User.model.js";
import { apiError, apiResponse } from "../../../../../../src/auth/utils/api.js";
import { requireAdmin } from "../../../../../../src/auth/utils/session.js";

export async function PATCH(request, { params }) {
  try {
    const admin = await requireAdmin();
    const { id } = params;
    const { role } = await request.json();
    if (!["user", "admin"].includes(role)) {
      return apiError("Invalid role.", 400);
    }

    await connectDB();
    const user = await User.findById(id);
    if (!user) return apiError("User not found.", 404);
    if (user._id.toString() === admin._id.toString()) {
      return apiError("You cannot change your own role.", 400);
    }

    user.role = role;
    await user.save();
    return apiResponse({ success: true });
  } catch (error) {
    return apiError(error.message || "Failed to update role.", error.status || 500);
  }
}
