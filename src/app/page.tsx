'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CategoryBar } from '@/components/CategoryBar';
import { ArticleCard } from '@/components/ArticleCard';
import { HeroFeatured } from '@/components/HeroFeatured';
import { formatWordCountBadge } from '@/utils/arabic';
import { useArticles } from '@/context/ArticlesContext';
import homeData from '@/data/homeData101n.json';

export default function HomePage() {
  const { articles } = useArticles();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const publishedArticles = useMemo(
    () => articles.filter((a) => a.isPublished),
    [articles]
  );

  // Map published articles by id and slug for live lookup
  const publishedMap = useMemo(() => {
    const map = new Map<string, (typeof publishedArticles)[number]>();
    publishedArticles.forEach((a) => {
      if (a.id) map.set(String(a.id), a);
      if (a.slug) map.set(String(a.slug), a);
    });
    return map;
  }, [publishedArticles]);

  // Set of original seed IDs/slugs from homeData101n.json so we can detect newly created admin articles
  const seedKeys = useMemo(() => {
    const keys = new Set<string>();
    if (homeData.topTeaser) {
      keys.add(String(homeData.topTeaser.id));
      keys.add(String(homeData.topTeaser.slug));
    }
    homeData.sections.forEach((s) => {
      if (s.banner) {
        keys.add(String(s.banner.id));
        keys.add(String(s.banner.slug));
      }
      s.posts.forEach((p) => {
        keys.add(String(p.id));
        keys.add(String(p.slug));
      });
    });
    return keys;
  }, []);

  // Build live sections that preserve exact seed order & banners while reflecting admin edits/creations/deletions
  const allSections = useMemo(() => {
    return homeData.sections.map((sec) => {
      // Newly created published articles in this category
      const customInCat = publishedArticles
        .filter(
          (a) =>
            a.categorySlug === sec.categorySlug &&
            !seedKeys.has(String(a.id)) &&
            !seedKeys.has(String(a.slug))
        )
        .map((a) => ({
          id: a.id,
          title: a.title,
          author: 'يحيى نعيم',
          cover: a.coverImage || a.cover || '',
          brief: a.excerpt,
          words: a.wordCount,
          slug: a.slug,
          categorySlug: a.categorySlug,
          categoryName: sec.categoryName,
        }));

      // Existing seed posts updated with latest title/excerpt/cover from context (and filtered if unpublished/deleted)
      const syncedSeedPosts = sec.posts
        .map((p) => {
          const live =
            publishedMap.get(String(p.id)) || publishedMap.get(String(p.slug));
          if (!live) return null;
          return {
            ...p,
            id: live.id,
            slug: live.slug,
            title: live.title,
            brief: live.excerpt || p.brief,
            cover: live.coverImage || live.cover || p.cover,
            words: live.wordCount || p.words,
            categorySlug: live.categorySlug || sec.categorySlug,
          };
        })
        .filter((p): p is NonNullable<typeof p> => p !== null);

      const liveBannerSource = sec.banner
        ? publishedMap.get(String(sec.banner.id)) ||
          publishedMap.get(String(sec.banner.slug))
        : undefined;

      const syncedBanner =
        sec.banner && liveBannerSource
          ? {
              ...sec.banner,
              id: liveBannerSource.id,
              slug: liveBannerSource.slug,
              title: liveBannerSource.title,
              brief: liveBannerSource.excerpt || sec.banner.brief,
              cover:
                liveBannerSource.coverImage ||
                liveBannerSource.cover ||
                sec.banner.cover,
              words: liveBannerSource.wordCount || sec.banner.words,
            }
          : sec.banner;

      return {
        ...sec,
        banner: syncedBanner,
        posts: [...customInCat, ...syncedSeedPosts],
      };
    });
  }, [publishedArticles, publishedMap, seedKeys]);

  // Top teaser article (Active shift or selected category)
  const topTeaser = useMemo(() => {
    if (selectedCategory !== 'all') {
      const sec = allSections.find((s) => s.categorySlug === selectedCategory);
      if (sec && sec.banner) return sec.banner;
    }
    // If admin created a new featured article, feature it at the top; otherwise use synced signature top teaser
    const customFeatured = publishedArticles.find(
      (a) =>
        a.isFeatured &&
        !seedKeys.has(String(a.id)) &&
        !seedKeys.has(String(a.slug)) &&
        a.id !== '1850' &&
        a.id !== '1849'
    );
    if (customFeatured) {
      return {
        id: customFeatured.id,
        title: customFeatured.title,
        author: 'يحيى نعيم',
        cover: customFeatured.coverImage || customFeatured.cover || '',
        brief: customFeatured.excerpt,
        words: customFeatured.wordCount,
        slug: customFeatured.slug,
        categorySlug: customFeatured.categorySlug,
        categoryName: 'فلسفة',
      };
    }

    if (homeData.topTeaser) {
      const liveTop =
        publishedMap.get(String(homeData.topTeaser.id)) ||
        publishedMap.get(String(homeData.topTeaser.slug));
      if (liveTop) {
        return {
          ...homeData.topTeaser,
          id: liveTop.id,
          slug: liveTop.slug,
          title: liveTop.title,
          brief: liveTop.excerpt || homeData.topTeaser.brief,
          cover:
            liveTop.coverImage || liveTop.cover || homeData.topTeaser.cover,
          words: liveTop.wordCount || homeData.topTeaser.words,
        };
      }
    }
    return homeData.topTeaser || allSections[0]?.banner;
  }, [selectedCategory, allSections, publishedArticles, publishedMap, seedKeys]);

  // Sections to display
  const activeSections = useMemo(() => {
    if (selectedCategory !== 'all') {
      return allSections.filter((s) => s.categorySlug === selectedCategory);
    }
    return allSections;
  }, [selectedCategory, allSections]);

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
      <section className="relative w-full bg-[#0a1226] text-white pt-0 border-b border-[#1e293b] overflow-hidden min-h-[500px] sm:min-h-[560px] md:min-h-[640px]">
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
            <div className="mt-6 sm:mt-12 pb-6 sm:pb-12 border-t border-[#1e293b]/80 pt-6 sm:pt-10">
              {/* Giant Title: Greta Arabic Bold */}
              <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-[95px] xl:text-[105px] font-bold text-white leading-[1.15] sm:leading-[1.08] tracking-tight text-right break-words">
                <Link
                  href={`/articles/${topTeaser.slug || topTeaser.id}`}
                  title="الذهاب إلى المقال"
                  className="hover:text-[#FACC15] transition-colors"
                >
                  {topTeaser.title}
                </Link>
              </h1>

              {/* Excerpt: Greta Arabic Regular */}
              <p className="mt-4 sm:mt-8 text-base sm:text-xl lg:text-[26px] text-white/95 leading-relaxed text-justify max-w-3xl font-light">
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
                    onClick={(e) => {
                      e.preventDefault();
                      setIsBookmarked((prev) => !prev);
                    }}
                    className="p-1 text-white hover:text-[#FACC15] transition-colors cursor-pointer"
                    title="حفظ المقال"
                    aria-label="حفظ المقال"
                  >
                    <svg
                      viewBox="0 0 6.98 10.18"
                      width="12"
                      height="16"
                      fill={isBookmarked ? '#FACC15' : 'none'}
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
            {/* 3x3 Newspaper Grid with spacing separating borders from hero & middle sections */}
            <div className="py-8 sm:py-10 md:py-12 lg:py-14 px-4 sm:px-6 lg:px-8">
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
