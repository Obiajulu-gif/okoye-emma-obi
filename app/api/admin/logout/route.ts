import { ADMIN_SESSION_COOKIE, adminCookieOptions } from "@/lib/auth";

export async function POST() {
  const response = Response.json({ ok: true });
  response.headers.append(
    "Set-Cookie",
    `${ADMIN_SESSION_COOKIE}=; Path=${adminCookieOptions.path}; HttpOnly; SameSite=${adminCookieOptions.sameSite}; Max-Age=0;${adminCookieOptions.secure ? " Secure;" : ""}`,
  );
  return response;
}
