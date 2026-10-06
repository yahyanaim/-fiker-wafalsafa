'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useArticles, YAHIA_NAIM_AUTHOR } from '@/context/ArticlesContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArticleCard } from '@/components/ArticleCard';
import { toArabicNumerals } from '@/utils/arabic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function AuthorProfilePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { articles, isLoading } = useArticles();

  // Sole author: Yahia Naim
  const author = YAHIA_NAIM_AUTHOR;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col">
        <Header />
        <div className="flex-1 max-w-4xl mx-auto px-4 py-20 w-full animate-pulse space-y-6 pt-32">
          <div className="h-28 w-28 bg-neutral-200 rounded-full" />
          <div className="h-10 w-64 bg-neutral-200" />
        </div>
        <Footer />
      </div>
    );
  }

  // Articles written by this author (all published articles belong to Yahia Naim)
  const authorArticles = articles.filter((a) => a.isPublished);
  const totalWords = authorArticles.reduce((sum, a) => sum + a.wordCount, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />

      {/* Top Section: Author Profile in Dark Blue & Yellow */}
      <section className="bg-[#0a1226] text-white pt-[65px] md:pt-[80px] lg:pt-[90px] border-b border-[#1e293b]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-16">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-right">
            {/* User Avatar with Yellow Ring */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-[#FACC15] shrink-0 bg-[#0e1b38] shadow-lg">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e1b38] border border-[#FACC15]/40 text-[#FACC15] text-xs font-bold mb-3">
                <span>المشرف العام والمحرر الوحيد</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold text-white font-signature mb-2">
                {author.name}
              </h1>

              <p className="text-neutral-300 text-sm sm:text-base mb-4 font-semibold">
                {author.title}
              </p>

              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-6 text-justify font-light">
                {author.bio}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-6 text-xs text-neutral-300">
                <span className="font-bold text-[#FACC15]">
                  {toArabicNumerals(authorArticles.length)} مقالات
                </span>
                <span>•</span>
                <span className="font-bold text-[#FACC15]">
                  {toArabicNumerals(totalWords)} كلمة
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Author's Articles in 3-Column Grid */}
      <main className="flex-1 w-full bg-white py-8 sm:py-10 md:py-12 lg:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1260px] mx-auto border-r border-[#0a1226] border-t border-[#0a1226]">
          {authorArticles.length === 0 ? (
            <div className="py-20 text-center text-neutral-500">
              <p className="text-base sm:text-lg">لم ينشر هذا الكاتب مقالات بعد.</p>
              <Link
                href="/"
                className="inline-block mt-4 px-5 py-2 bg-[#0a1226] text-white text-xs font-bold hover:bg-[#FACC15] hover:text-[#0a1226] transition-colors"
              >
                العودة للرئيسية
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {authorArticles.map((article, idx) => (
                <div
                  key={article.id}
                  className="border-l border-b border-[#0a1226] flex flex-col justify-between"
                >
                  <ArticleCard article={article} index={idx} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
