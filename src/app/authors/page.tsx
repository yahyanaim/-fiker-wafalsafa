'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useArticles, YAHIA_NAIM_AUTHOR } from '@/context/ArticlesContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { toArabicNumerals } from '@/utils/arabic';

export default function AuthorsPage() {
  const { articles } = useArticles();
  const author = YAHIA_NAIM_AUTHOR;

  const authorArticles = articles.filter((a) => a.isPublished);
  const totalWords = authorArticles.reduce((sum, a) => sum + a.wordCount, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />

      {/* Top Section: Dark Blue & Yellow Header */}
      <section className="bg-[#0a1226] text-white pt-[65px] md:pt-[80px] lg:pt-[90px] border-b border-[#1e293b]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-16 text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e1b38] border border-[#FACC15]/40 text-[#FACC15] text-xs font-bold mb-4">
            <span>الكاتب والمشرف العام للمنصة</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4">
            كاتب المنصة: يحيى نعيم
          </h1>
          <p className="text-neutral-300 text-base sm:text-lg max-w-2xl leading-relaxed font-light">
            مؤسس ورئيس تحرير منصة فكر وفلسفة، يقدم مقالات وأبحاثاً وتأملات في الفلسفة والعلوم والأدب.
          </p>
        </div>
      </section>

      {/* Single Author Spotlight Card */}
      <main className="flex-1 w-full bg-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="border-2 border-[#0a1226] bg-white p-8 sm:p-12 shadow-sm rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* User Photo */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-[#FACC15] shrink-0 bg-neutral-100 shadow-md">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Bio & Details */}
            <div className="flex-1 text-center sm:text-right">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0a1226] font-signature">
                  {author.name}
                </h2>
                <span className="inline-block px-3 py-1 bg-[#FACC15]/20 text-[#0a1226] text-xs font-bold rounded-full border border-[#FACC15]/50">
                  المدير العام والمحرر الوحيد
                </span>
              </div>

              <p className="text-sm font-semibold text-neutral-600 mb-4">
                {author.title}
              </p>

              <p className="text-neutral-800 text-base leading-relaxed mb-6 text-justify">
                {author.bio}
              </p>

              <div className="pt-6 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs sm:text-sm text-neutral-600">
                  <span className="font-bold text-[#0a1226]">
                    {toArabicNumerals(authorArticles.length)} مقالاً منشوراً
                  </span>
                  <span>•</span>
                  <span className="font-bold text-[#0a1226]">
                    {toArabicNumerals(totalWords)} كلمة
                  </span>
                </div>

                <Link
                  href={`/authors/yahia-naim`}
                  className="px-6 py-2.5 bg-[#0a1226] text-white hover:bg-[#FACC15] hover:text-[#0a1226] transition-colors rounded-lg font-bold text-xs sm:text-sm shadow-xs"
                >
                  استعراض جميع المقالات ←
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
