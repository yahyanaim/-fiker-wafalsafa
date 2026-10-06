'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CategoryIcon } from './CategoryIcon';
import { formatWordCountBadge } from '@/utils/arabic';

export interface CardPostItem {
  id?: string;
  title: string;
  author?: string;
  authorId?: string;
  authorSlug?: string;
  cover?: string;
  coverImage?: string;
  brief?: string;
  excerpt?: string;
  words?: number;
  wordCount?: number;
  slug?: string;
  categorySlug?: string;
  categoryName?: string;
}

interface ArticleCardProps {
  article: CardPostItem;
  index?: number;
}

const CARD_PALETTE = [
  '#35688f', // Slate Blue
  '#b0782b', // Warm Ochre
  '#49264c', // Deep Plum
  '#1f616d', // Deep Teal
  '#b8484a', // Terracotta Red
  '#9c3545', // Crimson
  '#3d5941', // Forest Olive
  '#b4533c', // Amber Terracotta
  '#2b3e50', // Midnight Slate
];

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, index = 0 }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  const cardColor = CARD_PALETTE[index % CARD_PALETTE.length];
  const postTitle = article.title;
  const postAuthor = 'يحيى نعيم';
  const postExcerpt = article.excerpt || article.brief || '';
  const postWords = article.wordCount || article.words || 450;
  const postSlug = article.slug || article.id || '';
  const postCover = article.cover || article.coverImage || '';
  const categorySlug = article.categorySlug || 'philosophy';
  const categoryName = article.categoryName || '';

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/articles/${postSlug}`
        : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: postTitle,
          text: postExcerpt,
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

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="recommendation-item flex flex-col justify-between h-full w-full bg-white px-6 sm:px-8 lg:px-11 py-6 sm:py-7">
      {/* 1. Category Glyph Icon at Top-Right */}
      <div className="w-full flex items-center justify-start mb-2.5">
        {categorySlug && (
          <Link
            href={`/categories/${categorySlug}`}
            className="category-icon text-[#0a1226] hover:text-[#F59E0B] transition-colors"
            title={categoryName || categorySlug}
          >
            <CategoryIcon
              name={categoryName || categorySlug}
              slug={categorySlug}
              size={16}
              onDark={false}
            />
          </Link>
        )}
      </div>

      {/* 2. Artwork Container (101note Height and Style: 330px, Aspect Square, Rounded 28px) */}
      <Link
        href={`/articles/${postSlug}`}
        className="post-img-outer-container block w-full max-w-[330px] mx-auto mb-4 group cursor-pointer"
        title="الذهاب إلى المقال"
      >
        <div
          className="post-img-container w-full aspect-square rounded-[26px] sm:rounded-[28px] flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] shadow-xs"
          style={{ backgroundColor: cardColor }}
        >
          {postCover ? (
            <img
              src={postCover}
              alt={postTitle}
              className="w-full h-full object-cover rounded-[26px] sm:rounded-[28px]"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4">
              <span className="text-white text-3xl font-bold tracking-wider font-amiri select-none">
                فِكْر وفَلْسَفَة
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* 3. Post Info: Title -> Author Signature -> Brief Excerpt */}
      <div className="post-info text-[#0a1226] flex items-start flex-col w-full grow text-right">
        {/* Title in Greta Arabic Bold */}
        <Link
          href={`/articles/${postSlug}`}
          title="الذهاب إلى المقال"
          className="w-full text-right group"
        >
          <h3 className="post-title font-bold text-xl sm:text-[21px] text-[#0a1226] group-hover:text-[#D97706] leading-tight line-clamp-2 transition-colors">
            {postTitle}
          </h3>
        </Link>

        {/* Author Name in Cursive Signature Font: Always Yahia Naim */}
        <p className="author-name font-signature text-2xl sm:text-3xl text-neutral-900 hover:text-[#F59E0B] transition-colors mt-1 mb-2.5 w-full text-right">
          <Link href="/authors/yahia-naim">
            {postAuthor}
          </Link>
        </p>

        {/* Brief Excerpt */}
        <p className="post-brief text-justify text-xs sm:text-[13.5px] text-neutral-800 leading-relaxed line-clamp-3 mb-5 w-full font-light">
          <Link
            href={`/articles/${postSlug}`}
            title="الذهاب إلى المقال"
            className="hover:opacity-85"
          >
            {postExcerpt}
          </Link>
        </p>

        {/* 3. Footer Info: Word count on right, Share + Bookmark on left */}
        <div className="article-stats-bookmark flex items-center justify-between w-full pt-4 mt-auto border-t border-neutral-200">
          {/* Word count badge */}
          <div className="article-stats text-xs font-bold text-black">
            {formatWordCountBadge(postWords)}
          </div>

          {/* Action buttons */}
          <div className="side-btns post-card flex items-center gap-3">
            {/* Curved share arrow */}
            <button
              onClick={handleShare}
              className="share-btn light post-card p-1 text-black hover:opacity-60 transition-opacity cursor-pointer relative"
              title="مشاركة المقال"
              aria-label="مشاركة المقال"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 512 512"
                fill="currentColor"
                className="share-icon"
              >
                <path d="M320,32v128C64,160,0,291.2,0,480c33.3-126.7,128-192,256-192h64v128l192-202.3L320,32z" />
              </svg>
              {copied && (
                <span className="absolute -top-7 right-0 text-[10px] bg-black text-white px-1.5 py-0.5 whitespace-nowrap shadow">
                  تم النسخ!
                </span>
              )}
            </button>

            {/* Bookmark polygon */}
            <button
              onClick={handleBookmark}
              className="bookmark-btn top-below-nav p-1 text-black hover:opacity-60 transition-opacity cursor-pointer"
              title="حفظ المقال"
              aria-label="حفظ المقال"
            >
              <svg
                viewBox="0 0 6.98 10.18"
                width="12"
                height="16"
                fill={isBookmarked ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.1"
                className="bookmark-icon"
              >
                <polygon points=".5 .5 6.48 .5 6.48 8.98 3.49 6.03 .5 8.98 .5 .5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
