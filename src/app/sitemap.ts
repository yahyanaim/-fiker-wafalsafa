import type { MetadataRoute } from 'next';
import { categories } from '@/data/categories';
import { readPlatformStore } from '@/lib/serverStore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fiker-wafalsafa.com';
  const store = await readPlatformStore();
  const published = store.articles.filter((a) => a.isPublished);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/authors`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/authors/yahia-naim`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const articleRoutes: MetadataRoute.Sitemap = published.map((art) => ({
    url: `${baseUrl}/articles/${encodeURIComponent(art.slug || art.id)}`,
    lastModified: art.isoDate ? new Date(art.isoDate) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
