import { NextResponse } from "next/server";

export function apiResponse(data, init = {}) {
  return NextResponse.json(data, init);
}

export function apiError(message, status = 400, details) {
  return NextResponse.json(
    { success: false, message, ...(details ? { details } : {}) },
    { status },
  );
}
