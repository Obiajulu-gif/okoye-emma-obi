import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const ADMIN_SESSION_COOKIE = "admin_session";

export interface AdminSessionPayload extends JWTPayload {
  email: string;
}

let warnedAboutDevSecret = false;

function getSecretKey() {
  const configuredSecret = process.env.SESSION_SECRET?.trim();

  if (configuredSecret && configuredSecret.length >= 24) {
    return new TextEncoder().encode(configuredSecret);
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set and at least 24 characters long");
  }

  if (!warnedAboutDevSecret) {
    warnedAboutDevSecret = true;
    console.warn(
      "SESSION_SECRET is missing/short. Using an insecure development fallback secret.",
    );
  }

  return new TextEncoder().encode("dev-only-session-secret-change-me-now");
}

export async function signAdminSession(email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyAdminSession(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.email !== "string") {
      return null;
    }

    return payload as AdminSessionPayload;
  } catch {
    return null;
  }
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};
