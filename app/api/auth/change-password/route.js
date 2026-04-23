import User from "../../../../src/auth/model/User.model.js";
import connectDB from "../../../../src/auth/db/dbConnection.js";
import { apiError, apiResponse } from "../../../../src/auth/utils/api.js";
import { requireUser } from "../../../../src/auth/utils/session.js";

export async function POST(request) {
  try {
    const currentUser = await requireUser();
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return apiError("Current password and new password are required.");
    }
    if (newPassword.length < 6) {
      return apiError("New password must be at least 6 characters long.");
    }

    await connectDB();
    const user = await User.findById(currentUser._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return apiError("Current password is incorrect.", 401);

    user.password = newPassword;
    await user.save();

    return apiResponse({ success: true, message: "Password updated successfully." });
  } catch (error) {
    return apiError(error.message || "Failed to change password.", error.status || 500);
  }
}
