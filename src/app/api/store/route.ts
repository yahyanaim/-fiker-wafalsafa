import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, isLocalHost, verifyToken } from '@/lib/adminAuth';
import { readPlatformStore, writePlatformStore } from '@/lib/serverStore';
import { Article, NewsletterSubscriber, SocialLinks } from '@/types';

export const dynamic = 'force-dynamic';

function isAuthorizedAdmin(req: NextRequest): boolean {
  const hasSession = verifyToken(req.cookies.get(SESSION_COOKIE)?.value, 'session');
  if (hasSession) return true;
  // In local development on localhost, allow admin mutations if authenticated locally
  return process.env.NODE_ENV !== 'production' && isLocalHost(req.headers.get('host'));
}

export async function GET() {
  const store = await readPlatformStore();
  return NextResponse.json(store, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function PUT(req: NextRequest) {
  let body: {
    action?: 'sync_articles' | 'sync_social' | 'subscribe' | 'reset';
    articles?: Article[];
    socialLinks?: SocialLinks;
    email?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  // Public action: newsletter subscription
  if (body.action === 'subscribe') {
    const email = (body.email || '').trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, message: 'يرجى إدخال بريد إلكتروني صحيح' },
        { status: 400 }
      );
    }

    const current = await readPlatformStore();
    if (current.newsletterSubscribers.some((s) => s.email === email)) {
      return NextResponse.json(
        { ok: false, message: 'هذا البريد الإلكتروني مسجل بالفعل في نشرتنا الأسبوعية' },
        { status: 409 }
      );
    }

    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email,
      subscribedAt: new Date().toLocaleDateString('ar-SA'),
    };
    const updated = await writePlatformStore({
      newsletterSubscribers: [newSub, ...current.newsletterSubscribers],
    });
    return NextResponse.json({
      ok: true,
      subscribers: updated.newsletterSubscribers,
      message: 'أهلاً بك في فكر وفلسفة! تم تسجيلك بنجاح في نشرة التأملات الأسبوعية.',
    });
  }

  // Admin-only actions below
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  if (body.action === 'sync_articles' && Array.isArray(body.articles)) {
    const updated = await writePlatformStore({ articles: body.articles });
    return NextResponse.json({ ok: true, articles: updated.articles });
  }

  if (body.action === 'sync_social' && body.socialLinks) {
    const updated = await writePlatformStore({ socialLinks: body.socialLinks });
    return NextResponse.json({ ok: true, socialLinks: updated.socialLinks });
  }

  if (body.action === 'reset') {
    const { initialArticles } = await import('@/data/initialArticles');
    const { DEFAULT_SOCIAL_LINKS } = await import('@/lib/serverStore');
    const updated = await writePlatformStore({
      articles: initialArticles,
      newsletterSubscribers: [],
      socialLinks: DEFAULT_SOCIAL_LINKS,
    });
    return NextResponse.json({ ok: true, store: updated });
  }

  return NextResponse.json({ ok: false, error: 'invalid_action' }, { status: 400 });
}
