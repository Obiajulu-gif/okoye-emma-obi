import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE, adminCookieOptions } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...adminCookieOptions,
    maxAge: 0,
  });
  return response;
}
