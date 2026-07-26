/**
 * Per-visitor question quota, enforced with an HMAC-signed cookie.
 *
 * The cookie holds the count itself, signed so the browser can't edit it. That
 * means no database, no Redis, no IP tracking — the tradeoff is that clearing
 * cookies resets the quota, which is fine for a friendly limit whose job is to
 * stop casual abuse rather than a determined one.
 *
 * Every failure mode (missing, malformed, expired, tampered) resolves to "fresh
 * visitor" rather than an error. A broken cookie should never cost someone the
 * ability to use the site.
 */

export const MAX_QUESTIONS = 3;

const COOKIE_NAME = "sza_q";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days
const MAX_AGE_MS = MAX_AGE_SECONDS * 1000;

export { COOKIE_NAME };

/**
 * Read the secret at call time, not module scope. Next 16 inlines module-level
 * `process.env` reads at build time, which would bake in whatever was set (or
 * unset) during the build rather than what's configured on the server.
 */
function getSecret(): string | null {
  const secret = process.env.CHAT_SECRET;
  return secret && secret.length > 0 ? secret : null;
}

let keyPromise: Promise<CryptoKey> | null = null;
let keyPromiseSecret: string | null = null;

function getKey(secret: string): Promise<CryptoKey> {
  // Cache the imported key, but re-import if the secret changed (dev reloads).
  if (!keyPromise || keyPromiseSecret !== secret) {
    keyPromiseSecret = secret;
    keyPromise = crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
  }
  return keyPromise;
}

function toBase64Url(bytes: ArrayBuffer): string {
  const binary = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await getKey(secret);
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return toBase64Url(sig);
}

/** Constant-time string compare, so we don't leak signature bytes via timing. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * How many questions this visitor has already used.
 * Returns 0 for anyone we can't positively identify.
 */
export async function readUsedCount(
  cookieValue: string | undefined,
): Promise<number> {
  const secret = getSecret();
  if (!secret || !cookieValue) return 0;

  const parts = cookieValue.split(".");
  if (parts.length !== 3) return 0;

  const [countRaw, issuedRaw, signature] = parts;
  const expected = await sign(`${countRaw}.${issuedRaw}`, secret);
  if (!timingSafeEqual(signature, expected)) return 0;

  const count = Number.parseInt(countRaw, 10);
  const issuedAt = Number.parseInt(issuedRaw, 10);
  if (!Number.isFinite(count) || !Number.isFinite(issuedAt)) return 0;
  if (Date.now() - issuedAt > MAX_AGE_MS) return 0; // stale, start over

  return Math.max(0, Math.min(count, MAX_QUESTIONS));
}

/**
 * Serialised `Set-Cookie` value recording `count` used questions.
 * Returns null when there's no secret configured — in that case we simply don't
 * set a cookie rather than setting an unsigned, forgeable one.
 */
export async function buildQuotaCookie(count: number): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;

  const issuedAt = Date.now();
  const payload = `${count}.${issuedAt}`;
  const signature = await sign(payload, secret);

  const attrs = [
    `${COOKIE_NAME}=${payload}.${signature}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${MAX_AGE_SECONDS}`,
  ];
  if (process.env.NODE_ENV === "production") attrs.push("Secure");

  return attrs.join("; ");
}

export function isQuotaConfigured(): boolean {
  return getSecret() !== null;
}
