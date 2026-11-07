import { NextRequest, NextResponse } from 'next/server';
import {
  DEVICE_COOKIE,
  DEVICE_MAX_AGE,
  SESSION_COOKIE,
  cookieOptions,
  createToken,
  getDeviceKey,
  isLocalHost,
  safeEqual,
  verifyToken,
} from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/session[?mac_key=...]
 * Returns { deviceAuthorized, authenticated } — evaluated on the server.
 */
export async function GET(req: NextRequest) {
  const authenticated = verifyToken(req.cookies.get(SESSION_COOKIE)?.value, 'session');
  let deviceAuthorized =
    authenticated ||
    isLocalHost(req.headers.get('host')) ||
    verifyToken(req.cookies.get(DEVICE_COOKIE)?.value, 'device');

  let setDeviceCookie = false;
  const key = req.nextUrl.searchParams.get('mac_key');
  const expectedKey = getDeviceKey();
  if (!deviceAuthorized && key && expectedKey && safeEqual(key, expectedKey)) {
    deviceAuthorized = true;
    setDeviceCookie = true;
  }

  const res = NextResponse.json(
    { deviceAuthorized, authenticated },
    { headers: { 'Cache-Control': 'no-store' } },
  );
  if (setDeviceCookie) {
    const token = createToken('device', DEVICE_MAX_AGE);
    if (token) res.cookies.set(DEVICE_COOKIE, token, cookieOptions(DEVICE_MAX_AGE));
  }
  return res;
}
