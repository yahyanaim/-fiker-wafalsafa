import 'server-only';
import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Server-side admin session helpers.
 * Secrets come from environment variables and are never shipped to the browser.
 *
 *   ADMIN_PASSCODE    – passcode required to log in to /admin
 *   ADMIN_SECRET      – random string used to sign session cookies
 *   ADMIN_DEVICE_KEY  – (optional) secret for the "?mac_key=" device unlock link
 */

export const SESSION_COOKIE = 'fiker_admin_session';
export const DEVICE_COOKIE = 'fiker_admin_device';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
export const DEVICE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

const isProd = process.env.NODE_ENV === 'production';

function getSecret(): string | null {
  const secret = process.env.ADMIN_SECRET;
  if (secret && secret.length >= 16) return secret;
  // Dev-only fallback so the project runs locally without configuration.
  return isProd ? null : 'dev-only-insecure-secret-change-me';
}

export function getPasscode(): string | null {
  const pass = process.env.ADMIN_PASSCODE;
  if (pass) return pass;
  return isProd ? null : 'admin101';
}

export function getDeviceKey(): string | null {
  return process.env.ADMIN_DEVICE_KEY || null;
}

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

/** Creates a signed token: `<kind>.<expiresAt>.<signature>` */
export function createToken(kind: 'session' | 'device', maxAgeSeconds: number): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const expires = Math.floor(Date.now() / 1000) + maxAgeSeconds;
  const payload = `${kind}.${expires}`;
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyToken(token: string | undefined, kind: 'session' | 'device'): boolean {
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [k, exp, sig] = parts;
  if (k !== kind) return false;
  const expNum = Number(exp);
  if (!Number.isFinite(expNum) || expNum < Math.floor(Date.now() / 1000)) return false;
  return safeEqual(sig, sign(`${k}.${exp}`, secret));
}

export function isLocalHost(host: string | null): boolean {
  if (!host) return false;
  const hostname = host.split(':')[0];
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.local');
}

export const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: isProd,
  sameSite: 'strict' as const,
  path: '/',
  maxAge,
});
