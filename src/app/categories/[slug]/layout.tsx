import type { Metadata } from 'next';
import { categories } from '@/data/categories';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const category = categories.find(
    (c) =>
      c.slug === decoded ||
      c.slug === slug ||
      c.slug.replace('-', '') === decoded.replace('-', '')
  );

  if (!category) {
    return {
      title: 'محطات فكر وفلسفة',
    };
  }

  const title = `${category.name} — ${category.timeSlot} | فكر وفلسفة`;
  return {
    title,
    description: category.description,
    openGraph: {
      title,
      description: category.description,
      type: 'website',
      locale: 'ar_SA',
      siteName: 'فكر وفلسفة',
    },
  };
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
