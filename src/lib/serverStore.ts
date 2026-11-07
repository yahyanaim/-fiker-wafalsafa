import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import { Article, NewsletterSubscriber, SocialLinks } from '@/types';
import { initialArticles } from '@/data/initialArticles';

export const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  twitter: 'https://x.com/yahia_naim',
  instagram: 'https://instagram.com/yahia_naim',
  facebook: 'https://facebook.com/yahia.naim',
  linkedin: 'https://linkedin.com/in/yahyanaim',
  github: 'https://github.com/yahyanaim',
  email: 'yahyanaim2001@gmail.com',
};

export interface PlatformStoreData {
  articles: Article[];
  newsletterSubscribers: NewsletterSubscriber[];
  socialLinks: SocialLinks;
}

const STORE_PATH = path.join(process.cwd(), 'src', 'data', 'platformStore.json');

export async function readPlatformStore(): Promise<PlatformStoreData> {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<PlatformStoreData>;
    return {
      articles:
        Array.isArray(parsed.articles) && parsed.articles.length > 0
          ? parsed.articles
          : initialArticles,
      newsletterSubscribers: Array.isArray(parsed.newsletterSubscribers)
        ? parsed.newsletterSubscribers
        : [],
      socialLinks: {
        ...DEFAULT_SOCIAL_LINKS,
        ...(parsed.socialLinks || {}),
      },
    };
  } catch {
    return {
      articles: initialArticles,
      newsletterSubscribers: [],
      socialLinks: DEFAULT_SOCIAL_LINKS,
    };
  }
}

export async function writePlatformStore(
  partial: Partial<PlatformStoreData>
): Promise<PlatformStoreData> {
  const current = await readPlatformStore();
  const next: PlatformStoreData = {
    articles: partial.articles ?? current.articles,
    newsletterSubscribers:
      partial.newsletterSubscribers ?? current.newsletterSubscribers,
    socialLinks: partial.socialLinks
      ? { ...current.socialLinks, ...partial.socialLinks }
      : current.socialLinks,
  };

  try {
    await fs.writeFile(STORE_PATH, JSON.stringify(next, null, 2), 'utf8');
  } catch (err) {
    console.warn('Could not persist platformStore.json:', err);
  }

  return next;
}
