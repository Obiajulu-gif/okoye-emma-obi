import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
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

    const forwarded = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip");
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

    const adminEmail = process.env.ADMIN_EMAIL?.trim();
    const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();
    const adminPassword = process.env.ADMIN_PASSWORD?.trim();

    if (!adminEmail || (!passwordHash && !adminPassword)) {
      return Response.json(
        { error: "Admin credentials are not configured" },
        { status: 500 },
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    const password = parsed.data.password;
    const emailMatches = email === adminEmail.toLowerCase();

    let passwordMatches = false;
    const candidateSecret = passwordHash || adminPassword || "";
    const isBcryptHash = /^\$2[aby]\$/.test(candidateSecret);

    if (isBcryptHash) {
      try {
        passwordMatches = await bcrypt.compare(password, candidateSecret);
      } catch {
        passwordMatches = false;
      }
    } else {
      passwordMatches = password === candidateSecret;
    }

    if (!emailMatches || !passwordMatches) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    clearLoginRateLimit(key);

    const token = await signAdminSession(adminEmail);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, adminCookieOptions);

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
