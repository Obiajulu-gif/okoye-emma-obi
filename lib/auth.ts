import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const ADMIN_SESSION_COOKIE = "admin_session";

export interface AdminSessionPayload extends JWTPayload {
  email: string;
}

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 24) {
    throw new Error("SESSION_SECRET must be set and at least 24 characters long");
  }

  return new TextEncoder().encode(secret);
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
