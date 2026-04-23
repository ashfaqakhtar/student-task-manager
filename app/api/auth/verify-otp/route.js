import User from "../../../../src/auth/model/User.model.js";
import connectDB from "../../../../src/auth/db/dbConnection.js";
import { apiError, apiResponse } from "../../../../src/auth/utils/api.js";
import { setAuthCookie, signAuthToken } from "../../../../src/auth/utils/session.js";
import { serializeUser } from "../../../../src/auth/utils/serialize.js";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();
    if (!email || !otp) {
      return apiError("Email and OTP are required.");
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return apiError("No account found for this email.", 404);
    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      return apiError("Invalid or expired OTP.", 400);
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = signAuthToken(user);
    await setAuthCookie(token);

    return apiResponse({
      success: true,
      message: "Account verified successfully.",
      user: serializeUser(user),
    });
  } catch (error) {
    console.error(error);
    return apiError(error.message || "Failed to verify OTP.", 500);
  }
}
