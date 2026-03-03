import type { NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/auth";

export async function assertAdminSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    throw new Error("Unauthorized");
  }

  const payload = await verifyAdminSession(token);
  if (!payload) {
    throw new Error("Unauthorized");
  }

  return payload;
}
