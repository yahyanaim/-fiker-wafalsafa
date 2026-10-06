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

              <div className="flex items-center justify-center md:justify-start gap-6 text-xs text-neutral-300 mb-6">
                <span className="font-bold text-[#FACC15]">
                  {toArabicNumerals(authorArticles.length)} مقالات
                </span>
                <span>•</span>
                <span className="font-bold text-[#FACC15]">
                  {toArabicNumerals(totalWords)} كلمة
                </span>
              </div>

              {/* Social Media Links */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                {author.twitter && (
                  <a
                    href={author.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0e1b38] border border-neutral-700 text-xs text-white hover:border-[#FACC15] hover:text-[#FACC15] transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>إكس (تويتر)</span>
                  </a>
                )}
                {author.instagram && (
                  <a
                    href={author.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0e1b38] border border-neutral-700 text-xs text-white hover:border-[#FACC15] hover:text-[#FACC15] transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                    <span>إنستجرام</span>
                  </a>
                )}
                {author.facebook && (
                  <a
                    href={author.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0e1b38] border border-neutral-700 text-xs text-white hover:border-[#FACC15] hover:text-[#FACC15] transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>فيسبوك</span>
                  </a>
                )}
                {author.linkedin && (
                  <a
                    href={author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0e1b38] border border-neutral-700 text-xs text-white hover:border-[#FACC15] hover:text-[#FACC15] transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span>لينكد إن</span>
                  </a>
                )}
                {author.github && (
                  <a
                    href={author.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0e1b38] border border-neutral-700 text-xs text-white hover:border-[#FACC15] hover:text-[#FACC15] transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    <span>جيت هب</span>
                  </a>
                )}
                {author.email && (
                  <a
                    href={author.email}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0e1b38] border border-neutral-700 text-xs text-white hover:border-[#FACC15] hover:text-[#FACC15] transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span>البريد</span>
                  </a>
                )}
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
