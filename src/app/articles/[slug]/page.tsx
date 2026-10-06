'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useArticles } from '@/context/ArticlesContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CategoryIcon } from '@/components/CategoryIcon';
import { ArticleBodyRenderer } from '@/components/ArticleBodyRenderer';
import { ArticleCard } from '@/components/ArticleCard';
import { formatWordCountBadge } from '@/utils/arabic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ArticlePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { articles, categories, authors, getArticleBySlug, isLoading } = useArticles();
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, []);

  const article = getArticleBySlug(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col">
        <Header />
        <div className="flex-1 max-w-4xl mx-auto px-4 py-24 w-full animate-pulse space-y-6 margin-below-nav">
          <div className="h-96 w-full bg-neutral-200" />
          <div className="h-8 w-3/4 bg-neutral-200" />
          <div className="space-y-4 pt-8">
            <div className="h-4 w-full bg-neutral-200" />
            <div className="h-4 w-5/6 bg-neutral-200" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    notFound();
  }

  const category =
    categories.find(
      (c) =>
        c.slug === article.categorySlug ||
        c.slug.replace(/-/g, '') === (article.categorySlug || '').replace(/-/g, '')
    ) || categories[0];

  const author = {
    id: 'author-yahia-naim',
    slug: 'yahia-naim',
    name: 'يحيى نعيم',
    title: 'الكاتب والمدير العام - فكر وفلسفة',
    bio: 'مؤسس ورئيس تحرير منصة فكر وفلسفة. باحث ومفكر متفرغ في تقاطعات الفلسفة، وتاريخ الأفكار، والعلوم الإنسانية، والأدب المعاصر.',
    avatar: '/authors/yahia-naim.jpg',
  };

  const relatedArticles = articles
    .filter((a) => a.id !== article.id && a.isPublished)
    .slice(0, 3);

  const handleShare = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const currentUrl = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: currentUrl,
        });
        return;
      } catch {
        // fallback
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBookmark = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Header with blurry frosted glassmorphism */}
      <Header />

      {/* Main Article Page Structure */}
      <main className="flex-1 w-full bg-white">
        {/* 1. Article Page Top Section: Cover Photo extends from y=0 under the blurry navbar */}
        <div className="relative w-full bg-[#0a1226] text-white border-b border-[#1e293b] overflow-hidden">
          <div
            className="relative w-full min-h-[500px] md:min-h-[580px] flex flex-col justify-between overflow-hidden bg-cover bg-center"
            style={{
              backgroundImage: `url(${article.coverImage})`,
            }}
          >
            {/* Dark Blue gradient overlay: lighter at top so photo shines through the blurry navbar */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1226] via-[#0a1226]/65 to-[#0a1226]/20 z-0" />

            {/* Top Bar inside Hero: Category Icon positioned below the blurry navbar */}
            <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-12 pt-[85px] md:pt-[105px] lg:pt-[115px]">
              {category && (
                <Link
                  href={`/categories/${category.slug}`}
                  title={category.name}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a1226]/80 backdrop-blur-md border border-[#FACC15]/40 text-white hover:border-[#FACC15] transition-colors"
                >
                  <CategoryIcon
                    name={category.name}
                    slug={category.slug}
                    size={20}
                    onDark={true}
                  />
                  <span className="text-xs font-bold text-[#FACC15]">{category.name}</span>
                </Link>
              )}
            </div>

            {/* Bottom Hero Content: Title, Brief, Cursive Author Signature */}
            <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-12 pb-10 sm:pb-14">
              <div className="max-w-4xl">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.18] tracking-tight">
                  {article.title}
                </h1>

                <p className="mt-4 sm:mt-5 text-white/95 text-base sm:text-xl leading-relaxed text-justify max-w-3xl font-light">
                  {article.excerpt}
                </p>

                <div className="mt-5 text-2xl sm:text-3xl font-signature text-[#FACC15]">
                  <Link
                    href={`/authors/yahia-naim`}
                    className="hover:opacity-85 transition-opacity"
                  >
                    {author.name}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Article Content Section */}
        <section className="max-w-[820px] mx-auto px-4 sm:px-6 py-10 sm:py-16">
          {/* Article Stats & Bookmark / Share Bar */}
          <div className="article-stats-bookmark flex items-center justify-between border-b border-neutral-200 pb-3 mb-8">
            <div className="article-stats text-sm sm:text-base font-bold text-black">
              <div>{formatWordCountBadge(article.wordCount)}</div>
            </div>

            <div className="side-btns article-body flex items-center gap-3">
              <button
                onClick={handleShare}
                className="share-btn light article-body p-1 hover:opacity-60 transition-opacity cursor-pointer relative text-black"
                title="مشاركة المقال"
                aria-label="مشاركة المقال"
              >
                <svg width="20" height="20" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M320,32v128C64,160,0,291.2,0,480c33.3-126.7,128-192,256-192h64v128l192-202.3L320,32z" />
                </svg>
                {copied && (
                  <span className="absolute -top-7 right-0 text-[10px] bg-black text-white px-2 py-0.5 whitespace-nowrap shadow z-10">
                    تم النسخ!
                  </span>
                )}
              </button>

              <button
                onClick={handleBookmark}
                className="bookmark-btn top-below-nav p-1 hover:opacity-60 transition-opacity cursor-pointer text-black"
                title="حفظ المقال"
                aria-label="حفظ المقال"
              >
                <svg
                  width="16"
                  height="20"
                  viewBox="0 0 10.38 15"
                  fill={isBookmarked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <polygon points=".5 .5 9.88 .5 9.88 13.81 5.19 9.17 .5 13.81 .5 .5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Pure Deep Black Text Content (101n exact typography & line-height) */}
          <div className="text-content text-black">
            <ArticleBodyRenderer content={article.body} />
          </div>

          {/* Article Tags and Date (101n layout: Category hashtag on right, publication date on left) */}
          <div className="article-tags-and-date flex items-center justify-between border-t border-neutral-200 pt-6 mt-12 text-sm sm:text-base">
            <ul className="tags flex flex-wrap items-center gap-3">
              {category && (
                <li>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="font-bold text-black hover:opacity-75 transition-opacity"
                    title={category.name}
                  >
                    <span className="hash-letter text-neutral-400 font-bold ml-0.5">#</span>
                    {category.name}
                  </Link>
                </li>
              )}
              {article.tags?.map((t) => (
                <li key={t} className="text-neutral-700">
                  <span className="hash-letter text-neutral-400 font-bold ml-0.5">#</span>
                  {t}
                </li>
              ))}
            </ul>

            <div className="publish-date text-neutral-500 font-medium">
              {article.publishDate}
            </div>
          </div>

          {/* 101n Circular Share Section */}
          <div className="article-share-section mt-10 pt-6 border-t border-neutral-100" id="share-section">
            <div>
              <h3 className="article-share-text text-base sm:text-lg font-bold text-black mb-4">
                شارك
              </h3>
              <ul className="article-share-items flex items-center gap-3">
                {/* Copy link */}
                <li className="article-share-item">
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full border border-[#0a1226] flex items-center justify-center text-[#0a1226] hover:bg-[#FACC15] hover:text-[#0a1226] hover:border-[#FACC15] transition-colors cursor-pointer relative"
                    title="نسخ الرابط"
                  >
                    <svg width="18" height="18" viewBox="0 0 512 512" fill="currentColor">
                      <path d="M320,32v128C64,160,0,291.2,0,480c33.3-126.7,128-192,256-192h64v128l192-202.3L320,32z" />
                    </svg>
                  </button>
                </li>

                {/* Email */}
                <li className="article-share-item">
                  <a
                    href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(shareUrl)}`}
                    title="مشاركة بالبريد"
                    className="w-10 h-10 rounded-full border border-[#0a1226] flex items-center justify-center text-[#0a1226] hover:bg-[#FACC15] hover:text-[#0a1226] hover:border-[#FACC15] transition-colors"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </a>
                </li>

                {/* X (Twitter) */}
                <li className="article-share-item">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="شارك على إكس"
                    className="w-10 h-10 rounded-full border border-[#0a1226] flex items-center justify-center text-[#0a1226] hover:bg-[#FACC15] hover:text-[#0a1226] hover:border-[#FACC15] transition-colors"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </li>

                {/* Facebook */}
                <li className="article-share-item">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="شارك على فيسبوك"
                    className="w-10 h-10 rounded-full border border-[#0a1226] flex items-center justify-center text-[#0a1226] hover:bg-[#FACC15] hover:text-[#0a1226] hover:border-[#FACC15] transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Author Spotlight Box: Yahia Naim with his photo */}
          <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#0a1226]/5 border border-[#0a1226]/15 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-right">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#FACC15] shrink-0 bg-neutral-100 shadow-md">
              <Image
                src="/authors/yahia-naim.jpg"
                alt="يحيى نعيم"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <h4 className="text-2xl font-bold font-signature text-[#0a1226]">
                  <Link href="/authors/yahia-naim" className="hover:text-[#D97706] transition-colors">
                    {author.name}
                  </Link>
                </h4>
                <span className="text-xs font-bold text-[#0a1226] px-3 py-1 rounded-full bg-[#FACC15]/30 self-center sm:self-auto border border-[#FACC15]/60">
                  الكاتب والمشرف العام
                </span>
              </div>
              <p className="text-xs font-semibold text-neutral-500 mb-2">
                {author.title}
              </p>
              <p className="text-sm text-neutral-700 leading-relaxed font-light text-justify">
                {author.bio}
              </p>
            </div>
          </div>
        </section>

        {/* 3. Recommendations Section (Related Articles in 3-Column Border Grid) */}
        {relatedArticles.length > 0 && (
          <section className="w-full mt-16 sm:mt-24 border-t-2 border-[#0a1226]">
            <div className="max-w-[1260px] mx-auto border-r border-[#0a1226]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.map((rel, idx) => (
                  <div
                    key={rel.id}
                    className="border-l border-b border-[#0a1226] flex flex-col justify-between"
                  >
                    <ArticleCard article={rel} index={idx} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* 101n Footer */}
      <Footer />
    </div>
  );
}
