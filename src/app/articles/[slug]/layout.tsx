import type { Metadata } from 'next';
import { initialArticles } from '@/data/initialArticles';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const article = initialArticles.find(
    (a) => a.slug === decodedSlug || a.slug === slug
  );

  if (!article) {
    return {
      title: 'مقال فكر وفلسفة',
      description: 'منصة فكر وفلسفة للمقالات الفلسفية والأدبية والعلوم الإنسانية',
    };
  }

  const title = `${article.title} | فكر وفلسفة`;
  const description = article.excerpt;
  const coverImage = article.coverImage || '/og-image.jpg';

  return {
    title,
    description,
    openGraph: {
      title: article.title,
      description,
      type: 'article',
      locale: 'ar_SA',
      siteName: 'فكر وفلسفة',
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [coverImage],
      creator: '@yahia_naim',
    },
  };
}

export default function ArticleLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
