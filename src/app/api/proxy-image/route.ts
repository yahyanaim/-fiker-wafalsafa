import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Only these image hosts may be proxied (prevents SSRF / open-proxy abuse).
const ALLOWED_HOSTS = new Set([
  'images.unsplash.com',
  'media.101n.com',
  'api.dicebear.com',
  'avatar.vercel.sh',
]);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const TIMEOUT_MS = 10_000;

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('url');
  if (!raw) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return new NextResponse('Invalid url', { status: 400 });
  }
  if (target.protocol !== 'https:' || !ALLOWED_HOSTS.has(target.hostname)) {
    return new NextResponse('Host not allowed', { status: 403 });
  }

  try {
    const res = await fetch(target, {
      redirect: 'error',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FikrWafalsafa/1.0)' },
    });

    if (!res.ok) {
      return new NextResponse('Failed to fetch image', { status: 502 });
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.startsWith('image/') || contentType.includes('svg')) {
      return new NextResponse('Unsupported content type', { status: 415 });
    }
    const declared = Number(res.headers.get('content-length') || 0);
    if (declared > MAX_BYTES) {
      return new NextResponse('Image too large', { status: 413 });
    }

    const buffer = await res.arrayBuffer();
    if (buffer.byteLength > MAX_BYTES) {
      return new NextResponse('Image too large', { status: 413 });
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new NextResponse('Error fetching image', { status: 502 });
  }
}
