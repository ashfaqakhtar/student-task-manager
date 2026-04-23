import User from "../../../../src/auth/model/User.model.js";
import connectDB from "../../../../src/auth/db/dbConnection.js";
import { apiError, apiResponse } from "../../../../src/auth/utils/api.js";
import { setAuthCookie, signAuthToken } from "../../../../src/auth/utils/session.js";
import { serializeUser } from "../../../../src/auth/utils/serialize.js";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return apiError("Email and password are required.");
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return apiError("Invalid email or password.", 401);
    if (!user.isVerified) return apiError("Please verify your email with the OTP first.", 403);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return apiError("Invalid email or password.", 401);

    const token = signAuthToken(user);
    await setAuthCookie(token);

    return apiResponse({
      success: true,
      message: "Logged in successfully.",
      user: serializeUser(user),
    });
  } catch (error) {
    console.error(error);
    return apiError(error.message || "Login failed.", 500);
  }
}
