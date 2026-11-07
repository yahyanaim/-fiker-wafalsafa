import { NextRequest, NextResponse } from 'next/server';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  cookieOptions,
  createToken,
  getPasscode,
  safeEqual,
} from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

// Very small in-memory brute-force limiter (per IP).
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function clientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const now = Date.now();
  const entry = attempts.get(ip);
  if (entry && entry.resetAt > now && entry.count >= MAX_ATTEMPTS) {
    return NextResponse.json({ ok: false, error: 'too_many_attempts' }, { status: 429 });
  }

  const expected = getPasscode();
  if (!expected) {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  let passcode = '';
  try {
    const body = (await req.json()) as { passcode?: unknown };
    passcode = typeof body.passcode === 'string' ? body.passcode.trim() : '';
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!passcode || !safeEqual(passcode, expected)) {
    const next = entry && entry.resetAt > now ? entry : { count: 0, resetAt: now + WINDOW_MS };
    next.count += 1;
    attempts.set(ip, next);
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  attempts.delete(ip);
  const token = createToken('session', SESSION_MAX_AGE);
  if (!token) {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, cookieOptions(SESSION_MAX_AGE));
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', cookieOptions(0));
  return res;
}
