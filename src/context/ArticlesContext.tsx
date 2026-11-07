'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Article, Author, Category, NewsletterSubscriber, SocialLinks } from '@/types';
import { categories } from '@/data/categories';
import { initialArticles } from '@/data/initialArticles';
import { countArabicWords, calculateReadingTime } from '@/utils/arabic';

export const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  twitter: 'https://x.com/yahia_naim',
  instagram: 'https://instagram.com/yahia_naim',
  facebook: 'https://facebook.com/yahia.naim',
  linkedin: 'https://linkedin.com/in/yahyanaim',
  github: 'https://github.com/yahyanaim',
  email: 'yahyanaim2001@gmail.com',
};

interface ArticlesContextType {
  articles: Article[];
  categories: Category[];
  authors: Author[];
  newsletterSubscribers: NewsletterSubscriber[];
  socialLinks: SocialLinks;
  isLoading: boolean;
  getArticleById: (id: string) => Article | undefined;
  getArticleBySlug: (slug: string) => Article | undefined;
  getArticlesByCategory: (categorySlug: string) => Article[];
  getArticlesByAuthor: (authorId: string) => Article[];
  getFeaturedArticle: () => Article | undefined;
  createArticle: (
    newArticle: Omit<
      Article,
      'id' | 'publishDate' | 'isoDate' | 'wordCount' | 'readingTimeMinutes' | 'slug'
    > & { id?: string; slug?: string }
  ) => Article;
  updateArticle: (id: string, updatedFields: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  toggleArticlePublish: (id: string) => void;
  updateSocialLinks: (links: SocialLinks) => void;
  subscribeNewsletter: (email: string) => { success: boolean; message: string };
  resetToSeedData: () => void;
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(undefined);

export const YAHIA_NAIM_AUTHOR: Author = {
  id: 'author-yahia-naim',
  slug: 'yahia-naim',
  name: 'يحيى نعيم',
  title: 'الكاتب والمدير العام - فكر وفلسفة',
  bio: 'مؤسس ورئيس تحرير منصة فكر وفلسفة. باحث ومفكر متفرغ في تقاطعات الفلسفة، وتاريخ الأفكار، والعلوم الإنسانية، والأدب المعاصر.',
  avatar: '/authors/yahia-naim.jpg',
  location: 'فكر وفلسفة',
  articlesCount: 61,
  twitter: 'https://x.com/yahia_naim',
  instagram: 'https://instagram.com/yahia_naim',
  facebook: 'https://facebook.com/yahia.naim',
  linkedin: 'https://linkedin.com/in/yahyanaim',
  github: 'https://github.com/yahyanaim',
  email: 'mailto:yahyanaim2001@gmail.com',
};

const ARTICLES_STORAGE_KEY = 'fiker_articles_v6';
const AUTHORS_STORAGE_KEY = 'fiker_authors_v6';
const NEWSLETTER_STORAGE_KEY = 'fiker_newsletter_v6';
const SOCIAL_LINKS_STORAGE_KEY = 'fiker_yahia_social_links';

function sanitizeArticlesList(list: Article[]): Article[] {
  const initialMap = new Map<string, Article>();
  initialArticles.forEach((initArt) => {
    if (initArt.id) initialMap.set(String(initArt.id).toLowerCase(), initArt);
    if (initArt.slug) initialMap.set(String(initArt.slug).toLowerCase(), initArt);
  });

  const sanitized = list.map((a: Article) => {
    const matched =
      initialMap.get(String(a.id || '').toLowerCase()) ||
      (a.slug ? initialMap.get(String(a.slug).toLowerCase()) : undefined);
    const coverImage =
      a.coverImage ||
      a.cover ||
      matched?.coverImage ||
      matched?.cover ||
      '';
    return {
      ...a,
      coverImage,
      cover: coverImage,
      authorId: 'author-yahia-naim',
      author: 'يحيى نعيم',
      authorSlug: 'yahia-naim',
    };
  });

  const existingIds = new Set(sanitized.map((a: Article) => a.id));
  const missing = initialArticles
    .filter((a) => !existingIds.has(a.id))
    .map((a) => ({
      ...a,
      cover: a.coverImage,
      authorId: 'author-yahia-naim',
      author: 'يحيى نعيم',
      authorSlug: 'yahia-naim',
    }));
  return [...sanitized, ...missing];
}

export function ArticlesProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [authors, setAuthors] = useState<Author[]>([YAHIA_NAIM_AUTHOR]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(DEFAULT_SOCIAL_LINKS);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize from LocalStorage first for instant render, then hydrate from /api/store
  useEffect(() => {
    let cancelled = false;
    try {
      const legacyKeys = [
        'fiker_articles_v1', 'fiker_authors_v1', 'fiker_newsletter_v1',
        'fiker_articles_v2', 'fiker_authors_v2',
        'fiker_articles_v3', 'fiker_authors_v3',
        'fiker_articles_v4', 'fiker_authors_v4',
        'fiker_articles_v5', 'fiker_authors_v5', 'fiker_newsletter_v5',
      ];
      legacyKeys.forEach((key) => {
        try {
          localStorage.removeItem(key);
        } catch {
          // ignore
        }
      });

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthors([YAHIA_NAIM_AUTHOR]);
      localStorage.setItem(AUTHORS_STORAGE_KEY, JSON.stringify([YAHIA_NAIM_AUTHOR]));

      const storedArticles = localStorage.getItem(ARTICLES_STORAGE_KEY);
      if (storedArticles) {
        try {
          const parsed = JSON.parse(storedArticles) as Article[];
          const merged = sanitizeArticlesList(parsed);
          setArticles(merged);
          localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(merged));
        } catch {
          setArticles(initialArticles);
          localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(initialArticles));
        }
      } else {
        localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(initialArticles));
      }

      const storedNewsletter = localStorage.getItem(NEWSLETTER_STORAGE_KEY);
      if (storedNewsletter) {
        setNewsletterSubscribers(JSON.parse(storedNewsletter));
      }

      const storedSocial = localStorage.getItem(SOCIAL_LINKS_STORAGE_KEY);
      if (storedSocial) {
        setSocialLinks({ ...DEFAULT_SOCIAL_LINKS, ...JSON.parse(storedSocial) });
      }
    } catch (e) {
      console.error('Failed to load data from localStorage:', e);
    } finally {
      setIsLoading(false);
    }

    // Fetch canonical server state so all visitors see published articles and social links
    fetch('/api/store', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((serverData) => {
        if (cancelled || !serverData) return;
        if (Array.isArray(serverData.articles) && serverData.articles.length > 0) {
          const sanitized = sanitizeArticlesList(serverData.articles);
          setArticles(sanitized);
          try {
            localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(sanitized));
          } catch {
            // ignore
          }
        }
        if (Array.isArray(serverData.newsletterSubscribers) && serverData.newsletterSubscribers.length > 0) {
          setNewsletterSubscribers(serverData.newsletterSubscribers);
          try {
            localStorage.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify(serverData.newsletterSubscribers));
          } catch {
            // ignore
          }
        }
        if (serverData.socialLinks) {
          const mergedLinks = { ...DEFAULT_SOCIAL_LINKS, ...serverData.socialLinks };
          setSocialLinks(mergedLinks);
          try {
            localStorage.setItem(SOCIAL_LINKS_STORAGE_KEY, JSON.stringify(mergedLinks));
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        // Offline or local-only fallback
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Save to LocalStorage and sync to server store
  const saveArticles = (newArticles: Article[]) => {
    setArticles(newArticles);
    try {
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(newArticles));
    } catch (e) {
      console.error('Failed to save articles to localStorage', e);
    }
    fetch('/api/store', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ action: 'sync_articles', articles: newArticles }),
    }).catch(() => {
      // ignore offline
    });
  };

  const updateSocialLinks = (links: SocialLinks) => {
    setSocialLinks(links);
    try {
      localStorage.setItem(SOCIAL_LINKS_STORAGE_KEY, JSON.stringify(links));
    } catch {
      // ignore
    }
    fetch('/api/store', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ action: 'sync_social', socialLinks: links }),
    }).catch(() => {
      // ignore
    });
  };

  const getArticleById = (id: string): Article | undefined => {
    if (!id) return undefined;
    const decoded = decodeURIComponent(id).trim().toLowerCase();
    const raw = id.trim().toLowerCase();
    return articles.find((a) => {
      const aId = (a.id || '').trim().toLowerCase();
      const aSlug = (a.slug || '').trim().toLowerCase();
      return aId === raw || aId === decoded || aSlug === raw || aSlug === decoded;
    });
  };

  const getArticleBySlug = (slug: string): Article | undefined => {
    if (!slug) return undefined;
    const decoded = decodeURIComponent(slug).trim().toLowerCase();
    const raw = slug.trim().toLowerCase();
    return articles.find((a) => {
      const aSlug = (a.slug || '').trim().toLowerCase();
      const aId = (a.id || '').trim().toLowerCase();
      const aTitle = (a.title || '').trim().toLowerCase();
      return (
        aSlug === raw ||
        aSlug === decoded ||
        aId === raw ||
        aId === decoded ||
        aTitle === raw ||
        aTitle === decoded ||
        aSlug.replace(/[؟?!\.,\s_-]/g, '') === decoded.replace(/[؟?!\.,\s_-]/g, '')
      );
    });
  };

  const getArticlesByCategory = (categorySlug: string): Article[] => {
    if (!categorySlug || categorySlug === 'all') {
      return articles.filter((a) => a.isPublished);
    }
    return articles.filter((a) => a.isPublished && a.categorySlug === categorySlug);
  };

  const getArticlesByAuthor = (): Article[] => {
    return articles.filter((a) => a.isPublished);
  };

  const getFeaturedArticle = (): Article | undefined => {
    const featured = articles.find((a) => a.isFeatured && a.isPublished);
    return featured || articles.find((a) => a.isPublished);
  };

  const createArticle = (
    newArticleData: Omit<
      Article,
      'id' | 'publishDate' | 'isoDate' | 'wordCount' | 'readingTimeMinutes' | 'slug'
    > & { id?: string; slug?: string }
  ): Article => {
    const id = newArticleData.id || `art-${Date.now()}`;
    const wordCount = countArabicWords(newArticleData.body);
    const readingTime = calculateReadingTime(wordCount);

    const now = new Date();
    const arabicMonths = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    const publishDate = `${now.getDate()} ${arabicMonths[now.getMonth()]} ${now.getFullYear()}`;
    const isoDate = now.toISOString().split('T')[0];

    const slug =
      newArticleData.slug ||
      newArticleData.title
        .trim()
        .toLowerCase()
        .replace(/[^\u0621-\u064A0-9a-zA-Z]+/g, '-')
        .replace(/^-|-$/g, '') ||
      `essay-${id}`;

    const createdArticle: Article = {
      ...newArticleData,
      id,
      slug,
      cover: newArticleData.coverImage,
      wordCount,
      readingTimeMinutes: readingTime,
      publishDate,
      isoDate,
      isPublished: newArticleData.isPublished ?? true,
      views: 1,
      likes: 0,
    };

    const updatedList = [createdArticle, ...articles];
    saveArticles(updatedList);
    return createdArticle;
  };

  const updateArticle = (id: string, updatedFields: Partial<Article>) => {
    const updatedList = articles.map((art) => {
      if (art.id === id || art.slug === id) {
        const body = updatedFields.body !== undefined ? updatedFields.body : art.body;
        const wordCount = countArabicWords(body);
        const readingTime = calculateReadingTime(wordCount);
        const coverImage = updatedFields.coverImage ?? art.coverImage;
        return {
          ...art,
          ...updatedFields,
          coverImage,
          cover: coverImage,
          wordCount,
          readingTimeMinutes: readingTime,
        };
      }
      return art;
    });

    saveArticles(updatedList);
  };

  const deleteArticle = (id: string) => {
    const updatedList = articles.filter((art) => art.id !== id && art.slug !== id);
    saveArticles(updatedList);
  };

  const toggleArticlePublish = (id: string) => {
    const updatedList = articles.map((art) => {
      if (art.id === id || art.slug === id) {
        return { ...art, isPublished: !art.isPublished };
      }
      return art;
    });
    saveArticles(updatedList);
  };

  const subscribeNewsletter = (email: string): { success: boolean; message: string } => {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'يرجى إدخال بريد إلكتروني صحيح' };
    }

    const trimmed = email.trim().toLowerCase();
    const already = newsletterSubscribers.some((sub) => sub.email === trimmed);
    if (already) {
      return { success: false, message: 'هذا البريد الإلكتروني مسجل بالفعل في نشرتنا الأسبوعية' };
    }

    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: trimmed,
      subscribedAt: new Date().toLocaleDateString('ar-SA'),
    };

    const updated = [newSub, ...newsletterSubscribers];
    setNewsletterSubscribers(updated);
    try {
      localStorage.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    fetch('/api/store', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'subscribe', email: trimmed }),
    }).catch(() => {
      // ignore
    });

    return {
      success: true,
      message: 'أهلاً بك في فكر وفلسفة! تم تسجيلك بنجاح في نشرة التأملات الأسبوعية.',
    };
  };

  const resetToSeedData = () => {
    try {
      localStorage.removeItem(ARTICLES_STORAGE_KEY);
      localStorage.removeItem(AUTHORS_STORAGE_KEY);
      localStorage.removeItem(NEWSLETTER_STORAGE_KEY);
      setArticles(initialArticles);
      setAuthors([YAHIA_NAIM_AUTHOR]);
      setNewsletterSubscribers([]);
      fetch('/api/store', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ action: 'reset' }),
      }).catch(() => {
        // ignore
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Merge dynamic socialLinks onto the author object so consumers reading `authors[0]` get live links
  const liveAuthor: Author = {
    ...YAHIA_NAIM_AUTHOR,
    twitter: socialLinks.twitter,
    instagram: socialLinks.instagram,
    facebook: socialLinks.facebook,
    linkedin: socialLinks.linkedin,
    github: socialLinks.github,
    email: socialLinks.email.startsWith('mailto:')
      ? socialLinks.email
      : `mailto:${socialLinks.email}`,
  };

  return (
    <ArticlesContext.Provider
      value={{
        articles,
        categories,
        authors: authors.length > 0 ? [liveAuthor] : [liveAuthor],
        newsletterSubscribers,
        socialLinks,
        isLoading,
        getArticleById,
        getArticleBySlug,
        getArticlesByCategory,
        getArticlesByAuthor,
        getFeaturedArticle,
        createArticle,
        updateArticle,
        deleteArticle,
        toggleArticlePublish,
        updateSocialLinks,
        subscribeNewsletter,
        resetToSeedData,
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
}

export function useArticles() {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error('useArticles must be used within an ArticlesProvider');
  }
  return context;
}
