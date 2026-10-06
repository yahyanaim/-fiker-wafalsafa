'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CategoryBar } from '@/components/CategoryBar';
import { ArticleCard } from '@/components/ArticleCard';
import { HeroFeatured } from '@/components/HeroFeatured';
import { formatWordCountBadge } from '@/utils/arabic';
import homeData from '@/data/homeData101n.json';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  // Top teaser article (Active shift or selected category)
  const topTeaser = useMemo(() => {
    if (selectedCategory !== 'all') {
      const sec = homeData.sections.find((s) => s.categorySlug === selectedCategory);
      if (sec && sec.banner) return sec.banner;
    }
    // Default to the signature top teaser of 101n
    return homeData.topTeaser || homeData.sections[0]?.banner;
  }, [selectedCategory]);

  // Sections to display
  const activeSections = useMemo(() => {
    if (selectedCategory !== 'all') {
      return homeData.sections.filter((s) => s.categorySlug === selectedCategory);
    }
    return homeData.sections;
  }, [selectedCategory]);

  const handleShareTopTeaser = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!topTeaser) return;
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/articles/${topTeaser.slug || topTeaser.id}`
        : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: topTeaser.title,
          text: topTeaser.brief,
          url,
        });
        return;
      } catch {
        // fallback
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 101n Fixed Header */}
      <Header />

      {/* Top Section: Hero Teaser with Article Image Background */}
      <section className="relative w-full bg-[#0a1226] text-white pt-0 border-b border-[#1e293b] overflow-hidden min-h-[560px] md:min-h-[640px]">
        {/* Article Cover Image Background extending under the blurry navbar */}
        {topTeaser && topTeaser.cover && (
          <div
            className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage: `url(${topTeaser.cover})`,
            }}
          >
            {/* Dark gradient overlay for text readability & yellow accent pop */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1226] via-[#0a1226]/85 to-[#0a1226]/40" />
            <div className="absolute inset-0 bg-[#0a1226]/35 backdrop-blur-[1.5px]" />
          </div>
        )}

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-[75px] md:pt-[95px] lg:pt-[105px] py-6 sm:py-10">
          {/* Category Icons Timeline Row */}
          <CategoryBar
            selectedCategory={selectedCategory}
            onSelectCategory={(slug) => setSelectedCategory(slug)}
          />

          {/* Top Teaser Note (Exact giant typography with Yellow accents) */}
          {topTeaser && (
            <div className="mt-8 sm:mt-12 pb-8 sm:pb-12 border-t border-[#1e293b]/80 pt-8 sm:pt-10">
              {/* Giant Title: Greta Arabic Bold */}
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[105px] font-bold text-white leading-[1.08] tracking-tight text-right">
                <Link
                  href={`/articles/${topTeaser.slug || topTeaser.id}`}
                  title="الذهاب إلى المقال"
                  className="hover:text-[#FACC15] transition-colors"
                >
                  {topTeaser.title}
                </Link>
              </h1>

              {/* Excerpt: Greta Arabic Regular */}
              <p className="mt-6 sm:mt-8 text-lg sm:text-2xl lg:text-[26px] text-white/95 leading-relaxed text-justify max-w-3xl font-light">
                <Link
                  href={`/articles/${topTeaser.slug || topTeaser.id}`}
                  title="الذهاب إلى المقال"
                  className="hover:opacity-90 transition-opacity"
                >
                  {topTeaser.brief}
                </Link>
              </p>

              {/* Author Attribution: Yahia Naim */}
              <div className="mt-4 font-signature text-2xl sm:text-3xl text-[#FACC15]">
                <Link href="/authors/yahia-naim" className="hover:opacity-85">
                  يحيى نعيم
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="flex items-center justify-between max-w-3xl mt-8 pt-4 border-t border-[#1e293b] text-xs sm:text-sm text-neutral-300">
                <span className="font-bold text-[#FACC15]">
                  {formatWordCountBadge(topTeaser.words)}
                </span>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleShareTopTeaser}
                    className="p-1 text-white hover:text-[#FACC15] transition-colors cursor-pointer relative"
                    title="مشاركة المقال"
                  >
                    <svg width="17" height="17" viewBox="0 0 512 512" fill="currentColor">
                      <path d="M320,32v128C64,160,0,291.2,0,480c33.3-126.7,128-192,256-192h64v128l192-202.3L320,32z" />
                    </svg>
                    {copied && (
                      <span className="absolute -top-7 right-0 text-[10px] bg-[#FACC15] text-[#0a1226] font-bold px-1.5 py-0.5 whitespace-nowrap shadow rounded">
                        تم النسخ!
                      </span>
                    )}
                  </button>

                  <button
                    className="p-1 text-white hover:text-[#FACC15] transition-colors cursor-pointer"
                    title="حفظ المقال"
                    aria-label="حفظ المقال"
                  >
                    <svg
                      viewBox="0 0 6.98 10.18"
                      width="12"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.1"
                    >
                      <polygon points=".5 .5 6.48 .5 6.48 8.98 3.49 6.03 .5 8.98 .5 .5" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content: Continuous Timeline Flow with 3x3 Grids & Illustrated Featured Banners */}
      <main className="flex-1 w-full bg-white">
        {activeSections.map((section, sectionIdx) => (
          <div key={section.categorySlug} className="w-full">
            {/* 3x3 Newspaper Grid (9 Cards with Colorful Artwork matching 101note) */}
            <div className="max-w-[1260px] mx-auto border-r border-black border-t border-black">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {section.posts.map((post, postIdx) => (
                  <div
                    key={post.id || `${section.categorySlug}-${postIdx}`}
                    className="border-l border-b border-black flex flex-col justify-between"
                  >
                    <ArticleCard article={post} index={sectionIdx * 9 + postIdx} />
                  </div>
                ))}
              </div>
            </div>

            {/* Alternating Illustrated Featured Banner (Between Grids) */}
            {section.banner && (
              <HeroFeatured
                article={{
                  ...section.banner,
                  categorySlug: section.categorySlug,
                  categoryName: section.categoryName,
                }}
              />
            )}
          </div>
        ))}
      </main>

      {/* 101n Footer */}
      <Footer />
    </div>
  );
}
