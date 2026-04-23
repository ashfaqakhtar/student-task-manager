import { apiResponse } from "../../../../src/auth/utils/api.js";
import { getSessionUser } from "../../../../src/auth/utils/session.js";
import { serializeUser } from "../../../../src/auth/utils/serialize.js";

export async function GET() {
  const user = await getSessionUser();

  return apiResponse({
    success: true,
    user: serializeUser(user),
  });
}
