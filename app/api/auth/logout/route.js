import { apiResponse } from "../../../../src/auth/utils/api.js";
import { clearAuthCookie } from "../../../../src/auth/utils/session.js";

export async function POST() {
  await clearAuthCookie();
  return apiResponse({ success: true, message: "Logged out successfully." });
}
