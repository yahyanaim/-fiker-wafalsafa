'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CategoryIcon } from './CategoryIcon';
import { formatWordCountBadge } from '@/utils/arabic';

export interface FeaturedPostData {
  id?: string;
  title: string;
  author: string;
  cover: string;
  brief: string;
  words: number;
  slug: string;
  categorySlug?: string;
  categoryName?: string;
}

interface HeroFeaturedProps {
  article: FeaturedPostData;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({ article }) => {
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/articles/${article.slug || article.id}`
        : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.brief,
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
    <section className="w-full border-t border-b border-[#1e293b] bg-[#0a1226] text-white relative overflow-hidden">
      <div
        className="max-w-[1440px] mx-auto min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-6 sm:p-12 relative bg-cover bg-center"
        style={{
          backgroundImage: `url(${article.cover})`,
        }}
      >
        {/* Dark Blue gradient overlay for rich contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1226] via-[#0a1226]/75 to-[#0a1226]/40 z-0 pointer-events-none" />

        {/* Top: Category Icon Badge in Dark Blue & Gold */}
        <div className="relative z-10 flex items-center justify-between w-full">
          {article.categorySlug && (
            <Link
              href={`/categories/${article.categorySlug}`}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a1226]/85 backdrop-blur-md border border-[#FACC15]/40 text-white hover:border-[#FACC15] transition-colors"
            >
              <CategoryIcon
                name={article.categoryName || article.categorySlug}
                slug={article.categorySlug}
                size={18}
                onDark={true}
              />
              <span className="text-xs font-bold text-[#FACC15]">
                {article.categoryName || article.categorySlug}
              </span>
            </Link>
          )}

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsBookmarked(!isBookmarked);
            }}
            className="p-1 text-white hover:text-[#FACC15] transition-colors cursor-pointer"
            title="حفظ المقال"
          >
            <svg
              viewBox="0 0 6.98 10.18"
              width="14"
              height="18"
              fill={isBookmarked ? '#FACC15' : 'none'}
              stroke="currentColor"
              strokeWidth="1.1"
            >
              <polygon points=".5 .5 6.48 .5 6.48 8.98 3.49 6.03 .5 8.98 .5 .5" />
            </svg>
          </button>
        </div>

        {/* Bottom: Title, Brief, Cursive Signature & Stats */}
        <div className="relative z-10 mt-auto pt-6 sm:pt-8 max-w-4xl text-right">
          {/* Title: Greta Arabic Bold */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.2] sm:leading-[1.18] tracking-tight break-words">
            <Link
              href={`/articles/${article.slug || article.id}`}
              className="hover:text-[#FACC15] transition-colors"
            >
              {article.title}
            </Link>
          </h2>

          {/* Brief */}
          <p className="mt-3 sm:mt-4 text-white/95 text-sm sm:text-lg lg:text-xl leading-relaxed text-justify max-w-3xl font-light">
            <Link
              href={`/articles/${article.slug || article.id}`}
              className="hover:opacity-90 transition-opacity block"
            >
              {article.brief}
            </Link>
          </p>

          {/* Author Name in Cursive Signature: Always Yahia Naim */}
          <div className="mt-4 font-signature text-2xl sm:text-3xl text-[#FACC15]">
            <Link href="/authors/yahia-naim" className="hover:opacity-85">
              يحيى نعيم
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between border-t border-[#1e293b] pt-4 mt-6 text-xs sm:text-sm text-neutral-300">
            <span className="font-bold text-[#FACC15]">
              {formatWordCountBadge(article.words)}
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="p-1 text-white hover:text-[#FACC15] transition-colors cursor-pointer relative"
                title="مشاركة المقال"
              >
                <svg width="18" height="18" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M320,32v128C64,160,0,291.2,0,480c33.3-126.7,128-192,256-192h64v128l192-202.3L320,32z" />
                </svg>
                {copied && (
                  <span className="absolute -top-7 right-0 text-[10px] bg-[#FACC15] text-[#0a1226] font-bold px-1.5 py-0.5 whitespace-nowrap shadow rounded">
                    تم النسخ!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
