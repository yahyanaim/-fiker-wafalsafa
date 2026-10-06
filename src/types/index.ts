export interface Category {
  id: string;
  name: string;
  timeSlot: string;
  slotHour: string; // e.g., '08:00', '14:00'
  iconName: string;
  color: string;
  accentBg: string;
  borderAccent: string;
  description: string;
  slug: string;
}

export interface Author {
  id: string;
  slug: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  location?: string;
  articlesCount?: number;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  github?: string;
  email?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string; // Rich formatted text with markdown or HTML
  coverImage: string;
  authorId: string;
  categorySlug: string;
  wordCount: number; // Arabic word count
  publishDate: string; // e.g. "٢٥ سبتمبر ٢٠٢٦"
  isoDate: string; // e.g. "2026-09-25"
  readingTimeMinutes: number;
  isFeatured?: boolean;
  isPublished: boolean;
  tags?: string[];
  views?: number;
  likes?: number;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}
