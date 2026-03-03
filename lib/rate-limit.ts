type RateLimitEntry = {
  count: number;
  firstAttemptAt: number;
  blockedUntil?: number;
};

const attempts = new Map<string, RateLimitEntry>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 6;
const BLOCK_MS = 15 * 60 * 1000;

export function getClientKey(input: string | null): string {
  if (!input) {
    return "unknown";
  }

  return input.split(",")[0]?.trim() || "unknown";
}

export function assertLoginRateLimit(key: string) {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current) {
    attempts.set(key, { count: 1, firstAttemptAt: now });
    return;
  }

  if (current.blockedUntil && current.blockedUntil > now) {
    const retryAfter = Math.ceil((current.blockedUntil - now) / 1000);
    throw new Error(`RATE_LIMITED:${retryAfter}`);
  }

  if (now - current.firstAttemptAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttemptAt: now });
    return;
  }

  current.count += 1;

  if (current.count >= MAX_ATTEMPTS) {
    current.blockedUntil = now + BLOCK_MS;
  }

  attempts.set(key, current);

  if (current.blockedUntil) {
    const retryAfter = Math.ceil((current.blockedUntil - now) / 1000);
    throw new Error(`RATE_LIMITED:${retryAfter}`);
  }
}

export function clearLoginRateLimit(key: string) {
  attempts.delete(key);
}
