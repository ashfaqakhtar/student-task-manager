import User from "../../../../src/auth/model/User.model.js";
import connectDB from "../../../../src/auth/db/dbConnection.js";
import sendOtpMail from "../../../../src/auth/mail/mail.js";
import { apiError, apiResponse } from "../../../../src/auth/utils/api.js";
import { generateOtp, getOtpExpiry } from "../../../../src/auth/utils/otp.js";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return apiError("Name, email, and password are required.");
    }
    if (password.length < 6) {
      return apiError("Password must be at least 6 characters long.");
    }

    await connectDB();
    const normalizedEmail = email.toLowerCase().trim();
    const otp = generateOtp();
    const otpExpiry = getOtpExpiry();

    const existing = await User.findOne({ email: normalizedEmail });
    let user;

    if (existing && existing.isVerified) {
      return apiError("A verified account already exists with this email.", 409);
    }

    if (existing) {
      existing.name = name.trim();
      existing.password = password;
      existing.otp = otp;
      existing.otpExpiry = otpExpiry;
      user = await existing.save();
    } else {
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        otp,
        otpExpiry,
        role:
          process.env.ADMIN_EMAIL &&
          normalizedEmail === process.env.ADMIN_EMAIL.toLowerCase()
            ? "admin"
            : "user",
      });
    }

    await sendOtpMail({
      email: normalizedEmail,
      name: user.name,
      otp,
      purpose: "verify",
    });

    return apiResponse({
      success: true,
      message: "OTP sent to your email address.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error(error);
    return apiError(error.message || "Failed to start registration.", 500);
  }
}
