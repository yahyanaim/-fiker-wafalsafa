'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useArticles } from '@/context/ArticlesContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CategoryBar } from '@/components/CategoryBar';
import { ArticleCard } from '@/components/ArticleCard';
import { CategoryIcon } from '@/components/CategoryIcon';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { categories, getArticlesByCategory } = useArticles();

  const category = categories.find(
    (c) => c.slug === slug || c.slug.replace('-', '') === slug.replace('-', '')
  );

  if (!category) {
    notFound();
  }

  const categoryArticles = getArticlesByCategory(category.slug);

  const handleSelectCategory = (targetSlug: string) => {
    if (targetSlug === 'all') {
      router.push('/');
    } else {
      router.push(`/categories/${targetSlug}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* 101n Fixed Header */}
      <Header />

      {/* Top Black Section with Category Timeline Bar */}
      <section className="bg-black text-white pt-[65px] md:pt-[80px] lg:pt-[90px] border-b border-black">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10">
          <CategoryBar
            selectedCategory={category.slug}
            onSelectCategory={handleSelectCategory}
          />

          {/* Active Category Header Banner */}
          <div className="mt-8 sm:mt-10 border-t border-neutral-900 pt-6 sm:pt-8 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 rounded-full border border-white flex items-center justify-center text-white">
                <CategoryIcon
                  name={category.name}
                  slug={category.slug}
                  size={18}
                  onDark={true}
                />
              </span>
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
                محطة التوقيت: {category.timeSlot}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-3">
              {category.name}
            </h1>
            <p className="text-neutral-300 text-base sm:text-lg max-w-2xl leading-relaxed font-light">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Articles List in 101n 3-Column Newspaper Grid */}
      <main className="flex-1 w-full bg-white py-8 sm:py-10 md:py-12 lg:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1260px] mx-auto border-r border-black border-t border-black">
          {categoryArticles.length === 0 ? (
            <div className="text-center py-24 text-neutral-500">
              <p className="text-base sm:text-lg">لا توجد مقالات في هذه المحطة حالياً.</p>
              <Link
                href="/"
                className="inline-block mt-4 px-5 py-2 bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
              >
                العودة للرئيسية
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {categoryArticles.map((article, idx) => (
                <div
                  key={article.id}
                  className="border-l border-b border-black flex flex-col justify-between"
                >
                  <ArticleCard article={article} index={idx} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 101n Footer */}
      <Footer />
    </div>
  );
}
