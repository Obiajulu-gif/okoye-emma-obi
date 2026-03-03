import bcrypt from "bcryptjs";
import { z } from "zod";

import { ADMIN_SESSION_COOKIE, adminCookieOptions, signAdminSession } from "@/lib/auth";
import { assertLoginRateLimit, clearLoginRateLimit, getClientKey } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const key = getClientKey(forwarded);

    try {
      assertLoginRateLimit(key);
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("RATE_LIMITED:")) {
        const retryAfter = Number(error.message.split(":")[1] || "60");
        return Response.json(
          { error: "Too many attempts. Try again later." },
          { status: 429, headers: { "Retry-After": String(retryAfter) } },
        );
      }
      throw error;
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !passwordHash) {
      return Response.json(
        { error: "Admin credentials are not configured" },
        { status: 500 },
      );
    }

    const { email, password } = parsed.data;
    const emailMatches = email.toLowerCase() === adminEmail.toLowerCase();

    const isBcryptHash = /^\$2[aby]\$/.test(passwordHash);
    const passwordMatches = isBcryptHash
      ? await bcrypt.compare(password, passwordHash)
      : password === passwordHash;

    if (!emailMatches || !passwordMatches) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    clearLoginRateLimit(key);

    const token = await signAdminSession(email);
    const response = Response.json({ ok: true });
    response.headers.append(
      "Set-Cookie",
      `${ADMIN_SESSION_COOKIE}=${token}; Path=${adminCookieOptions.path}; HttpOnly; SameSite=${adminCookieOptions.sameSite}; Max-Age=${adminCookieOptions.maxAge};${adminCookieOptions.secure ? " Secure;" : ""}`,
    );

    return response;
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Login failed",
      },
      { status: 500 },
    );
  }
}
