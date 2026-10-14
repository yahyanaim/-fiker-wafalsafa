'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Article } from '@/types';
import { getCategoryBySlug } from '@/data/categories';
import { CategoryIcon } from '@/components/CategoryIcon';
import { toPng } from 'html-to-image';
import {
  X,
  Download,
  Copy,
  Sparkles,
  Smartphone,
  Square,
  Image as ImageIcon,
  Loader2,
  Check,
  Type,
  Ratio,
  ArrowUpCircle,
  Shapes
} from 'lucide-react';
import { GRETA_BOLD_BASE64 } from '@/utils/gretaBoldBase64';

interface QuoteCardShareModalProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
  shareUrl?: string;
}

export const QuoteCardShareModal: React.FC<QuoteCardShareModalProps> = ({
  article,
  isOpen,
  onClose,
  shareUrl,
}) => {
  const currentUrl =
    shareUrl || (typeof window !== 'undefined' ? window.location.href : '');

  // Authentic page information from Fikr wa Falsafa (Strictly NO 101)
  const category = getCategoryBySlug(article.categorySlug);
  const categoryName = category?.name || 'فلسفة';
  const currentYear = '2026';
  const articleNumber = article.id.replace(/\D/g, '').slice(0, 4) || '1750';
  const siteDomain = 'fikrwfalsafa.com';

  // Options & Customization
  const [displayText, setDisplayText] = useState(article.title || '');
  const [isUsingTitle, setIsUsingTitle] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<'portrait' | 'story' | 'square'>('portrait');
  const [verticalPosition, setVerticalPosition] = useState<'high' | 'ultra' | 'mid'>('high');
  const [iconStyle, setIconStyle] = useState<'category' | 'station'>('category');
  const [iconLayout, setIconLayout] = useState<'inline' | 'stacked'>('inline');
  const [highlightKeyword, setHighlightKeyword] = useState<string>('');
  const [showDoodles, setShowDoodles] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  // Derive proxy safe cover image URL to avoid CORS tainting during export
  const safeCoverImage = useMemo(() => {
    if (!article.coverImage) return '/file.svg';
    if (article.coverImage.startsWith('http://') || article.coverImage.startsWith('https://')) {
      return `/api/proxy-image?url=${encodeURIComponent(article.coverImage)}`;
    }
    return article.coverImage;
  }, [article.coverImage]);

  // Ensure Greta Arabic Bold font is registered and ready in document.fonts
  useEffect(() => {
    if (typeof document !== 'undefined' && 'fonts' in document) {
      try {
        const boldFont = new FontFace(
          'Greta Arabic AR LT',
          "url('/fonts/GretaArabicARLT-Bold.woff2') format('woff2')",
          { weight: '700', style: 'normal' }
        );
        boldFont.load().then((loadedFont) => {
          document.fonts.add(loadedFont);
        }).catch(() => {
          // System or pre-cached font will serve as fall-through
        });
      } catch (e) {
        console.warn('FontFace API note:', e);
      }
    }
  }, []);

  // Extract keywords for quick highlighting
  useEffect(() => {
    if (article.title) {
      setDisplayText(article.title);
      setIsUsingTitle(true);
      const words = article.title
        .split(/[\s\n]+/)
        .map((w) => w.replace(/[«»"،.؛:]/g, '').trim())
        .filter((w) => w.length > 2);
      if (words.length > 0) {
        setHighlightKeyword(words[words.length - 1]);
      }
    }
  }, [article.title]);

  // List of words for the interactive highlight selector
  const wordsList = useMemo(() => {
    return displayText
      .split(/[\s\n]+/)
      .map((w) => w.replace(/[«»"،.؛:]/g, '').trim())
      .filter((w) => w.length > 1);
  }, [displayText]);

  // Memoized Base64 Font Embed CSS (Pure data URI - zero network fetch needed)
  const base64FontEmbedCss = useMemo(() => {
    return `@font-face {
      font-family: 'Greta Arabic AR LT';
      src: url('data:font/woff2;charset=utf-8;base64,${GRETA_BOLD_BASE64}') format('woff2');
      font-weight: 700;
      font-style: normal;
    }`;
  }, []);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSelectTitleMode = () => {
    setIsUsingTitle(true);
    setDisplayText(article.title);
    const words = article.title
      .split(/[\s\n]+/)
      .map((w) => w.replace(/[«»"،.؛:]/g, '').trim())
      .filter((w) => w.length > 2);
    if (words.length > 0) setHighlightKeyword(words[words.length - 1]);
  };

  const handleSelectQuoteMode = () => {
    setIsUsingTitle(false);
    const quote = article.excerpt || article.title;
    setDisplayText(quote);
    const words = quote
      .split(/[\s\n]+/)
      .map((w) => w.replace(/[«»"،.؛:]/g, '').trim())
      .filter((w) => w.length > 2);
    if (words.length > 0) setHighlightKeyword(words[0]);
  };

  // Copy share message
  const handleCopy = async () => {
    try {
      const msg = `«${displayText}»\n\n— من مقال: ${article.title}\nمنصة فكر وفلسفة\n${currentUrl}`;
      await navigator.clipboard.writeText(msg);
      setCopied(true);
      showToast('تم نسخ الاقتباس ورابط المقال بنجاح!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('فشل في نسخ النص');
    }
  };

  // Social share links
  const handleShareTwitter = () => {
    const text = `«${displayText.slice(0, 180)}»\n\n— من مقال: ${article.title}\nمنصة فكر وفلسفة`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = () => {
    const text = `«${displayText}»\n\n— من مقال: *${article.title}*\nمنصة فكر وفلسفة\n\n${currentUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // High-Resolution Export: Uses html-to-image with embedded base64 font
  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      if (!cardRef.current) return;

      if (typeof document !== 'undefined' && document.fonts) {
        try {
          await document.fonts.load("700 24px 'Greta Arabic AR LT'");
        } catch (e) {
          console.warn('Font load timeout check:', e);
        }
        await document.fonts.ready;
      }

      const dataUrl = await toPng(cardRef.current, {
        quality: 0.98,
        pixelRatio: 3, // High-res 3x output for ultra crisp text and artwork
        cacheBust: true,
        fontEmbedCSS: base64FontEmbedCss,
        skipFonts: true, // Prevents html-to-image from scanning external CSS stylesheets
      });

      const downloadLink = document.createElement('a');
      downloadLink.download = `fikrwfalsafa-${article.slug || 'poster'}.png`;
      downloadLink.href = dataUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      showToast('تم تحميل بوستر المقال عالي الدقة (PNG) بالخط والتصميم بنجاح!');
    } catch (err: any) {
      console.error('Download error:', err);
      showToast(err?.message || 'حدث خطأ أثناء إنشاء الصورة');
    } finally {
      setIsDownloading(false);
    }
  };

  // Determine vertical positioning class: Elevated as requested ("make it Up a little not under")
  const verticalPositionClass =
    verticalPosition === 'ultra'
      ? 'bottom-[36%] sm:bottom-[40%]'
      : verticalPosition === 'mid'
      ? 'bottom-[20%] sm:bottom-[24%]'
      : 'bottom-[28%] sm:bottom-[32%]'; // 'high' default: leaves bottom 30% spacious & visible

  // Helper to render the paragraph with Greta Arabic font and yellow hand-drawn scratches
  const renderParagraphContent = () => {
    if (!displayText) return null;
    const lines = displayText.split('\n');

    return (
      <div className="relative text-right w-full">
        {lines.map((line, lineIdx) => {
          const words = line.split(' ');
          return (
            <div key={lineIdx} className="relative leading-[1.28] whitespace-normal">
              {words.map((word, wordIdx) => {
                const cleanWord = word.replace(/[«»"،.؛:]/g, '').trim();
                const isCircled =
                  showDoodles &&
                  highlightKeyword &&
                  cleanWord === highlightKeyword.trim();

                return (
                  <React.Fragment key={wordIdx}>
                    {isCircled ? (
                      <span className="relative inline-block mx-1">
                        <span className="relative z-10 text-white font-bold">{word}</span>
                        {/* Hand-drawn yellow marker loop around the selected keyword */}
                        <svg
                          className="absolute -inset-x-3 -inset-y-2 w-[calc(100%+24px)] h-[calc(100%+16px)] pointer-events-none z-0"
                          viewBox="0 0 120 50"
                          fill="none"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M 112 25 C 112 10, 85 4, 55 4 C 20 4, 5 12, 6 25 C 7 38, 25 45, 60 45 C 95 45, 114 38, 114 23 C 114 12, 98 6, 75 6"
                            stroke="#FDE047"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {/* Small hand-drawn sparkle doodle near circled word */}
                        <span className="absolute -left-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-90">
                          <svg className="w-4 h-4 text-[#FDE047]" viewBox="0 0 24 24" fill="none" stroke="#FDE047" strokeWidth="2.2">
                            <circle cx="12" cy="12" r="2" fill="#FDE047" />
                            <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                          </svg>
                        </span>
                      </span>
                    ) : (
                      <span className="text-white font-bold">{word}</span>
                    )}
                    {wordIdx < words.length - 1 ? ' ' : ''}
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}

        {/* Hand-drawn yellow brush underline under the text block */}
        {showDoodles && (
          <div className="pointer-events-none mt-2.5 flex flex-col items-end">
            <svg className="w-32 sm:w-44 h-3 text-[#FDE047] drop-shadow-sm" viewBox="0 0 200 12" fill="none">
              <path
                d="M 195 5 C 145 10, 65 3, 5 7"
                stroke="#FDE047"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            {/* Small rectangular hatched doodle underneath */}
            <div className="mr-2 mt-1">
              <svg className="w-6 h-2.5 text-[#FDE047] opacity-85" viewBox="0 0 36 14" fill="none" stroke="#FDE047" strokeWidth="2" strokeLinecap="round">
                <rect x="2" y="2" width="32" height="10" rx="2" />
                <line x1="9" y1="2" x2="6" y2="12" />
                <line x1="17" y1="2" x2="14" y2="12" />
                <line x1="25" y1="2" x2="22" y2="12" />
              </svg>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-[#111827] text-white rounded-2xl border border-neutral-700 shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#0b0f19]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FDE047]/20 text-[#FDE047] flex items-center justify-center border border-[#FDE047]/40 shadow-sm">
              <Sparkles size={18} />
            </div>
            <div>
              <h2
                className="text-base sm:text-lg font-bold text-white"
                style={{ fontFamily: "'Greta Arabic AR LT', 'GretaArabicARLT', sans-serif" }}
              >
                تصميم وتحميل بوستر المشاركة — فكر وفلسفة
              </h2>
              <p className="text-[11px] sm:text-xs text-neutral-400">
                بوستر فني يدمج لوحة المقال مع شعار فكر وفلسفة، أيقونة التصنيف، والنص بالخط العريض في موضع مرتفع
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-6 max-h-[82vh] overflow-y-auto">
          {/* Left Column: Live Visual Poster Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#070b13] p-4 sm:p-6 rounded-xl border border-neutral-800/80">
            <div className="flex items-center justify-between w-full max-w-[440px] mb-3 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5 font-bold text-neutral-300">
                <ImageIcon size={14} className="text-[#FDE047]" />
                <span>معاينة حية للبوستر:</span>
              </span>
              <span className="text-[11px] text-neutral-400 font-mono">
                {aspectRatio === 'portrait' ? '4:5 بوستر' : aspectRatio === 'story' ? '9:16 ستوري' : '1:1 مربع'}
              </span>
            </div>

            {/* The Live Visual Card Container */}
            <div
              ref={cardRef}
              dir="rtl"
              className={`relative w-full rounded-xl overflow-hidden shadow-2xl transition-all duration-300 select-none bg-neutral-900 ${
                aspectRatio === 'portrait'
                  ? 'aspect-[4/5] max-w-[440px]'
                  : aspectRatio === 'story'
                  ? 'aspect-[9/16] max-w-[360px]'
                  : 'aspect-square max-w-[440px]'
              }`}
            >
              {/* Force Inlined Font Declaration with base64 data URI to guarantee instant rendering in exported PNG */}
              <style dangerouslySetInnerHTML={{ __html: base64FontEmbedCss }} />

              {/* 1. Full-Bleed Artwork Image (Original Painting Unaltered) */}
              <img
                src={safeCoverImage}
                alt={article.title}
                crossOrigin="anonymous"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0"
              />

              {/* 2. Soft Bottom-Right & Top Shadows (Leaves the art subject visible on the left and bottom) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/45 pointer-events-none z-10" />
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/55 to-transparent pointer-events-none z-10" />

              {/* 3. Top Header Bar (Branding: فِكْر وفَلْسَفَة, Strictly NO 101) */}
              <div className="absolute top-5 left-6 right-6 flex items-center justify-between z-20" dir="ltr">
                {/* Top Left: 20 over 26 */}
                <div className="flex flex-col text-[11px] font-bold text-white leading-tight font-sans tracking-wide select-none drop-shadow-sm">
                  <span>{currentYear.slice(0, 2)}</span>
                  <span>{currentYear.slice(2, 4)}</span>
                </div>

                {/* Top Center: Fikr wa Falsafa Brand Name (NO 101) */}
                <div className="flex items-center gap-1.5 text-white select-none drop-shadow-md">
                  <span
                    className="font-bold text-xs sm:text-sm tracking-wide text-white drop-shadow-sm"
                    style={{ fontFamily: "'Greta Arabic AR LT', 'GretaArabicARLT', sans-serif" }}
                  >
                    فِكْر وفَلْسَفَة
                  </span>
                </div>

                {/* Top Right: Article Number */}
                <div className="text-[11px] font-mono font-bold text-white tracking-widest select-none drop-shadow-sm">
                  {articleNumber}
                </div>
              </div>

              {/* 4. Left Margin Vertical Domain: fikrwfalsafa.com */}
              <div
                className="absolute left-2.5 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-[9px] tracking-widest text-white/80 font-sans select-none z-20"
                dir="ltr"
              >
                {siteDomain}
              </div>

              {/* 5. Content Quadrant: Elevated Position ("Up a little not under"), RTL, NO AUTHOR NAME */}
              <div
                className={`absolute ${verticalPositionClass} right-6 sm:right-8 max-w-[68%] sm:max-w-[62%] text-right z-20 flex flex-col items-start transition-all duration-300`}
                dir="rtl"
              >
                {/* Line 1: Category Icon & Category Name in strict RTL (Icon on the FAR RIGHT) */}
                {iconLayout === 'stacked' ? (
                  <div className="w-full flex flex-col items-start justify-start mb-2.5 text-right select-none" dir="rtl">
                    <div className="mb-1 text-white shrink-0 flex items-center justify-start drop-shadow-md">
                      {iconStyle === 'station' ? (
                        <svg viewBox="0 0 24 24" width={22} height={22} fill="white" className="drop-shadow-sm">
                          <rect x="2.5" y="2.5" width="8" height="8" rx="3.5" />
                          <rect x="13.5" y="2.5" width="8" height="8" rx="3.5" />
                          <rect x="2.5" y="13.5" width="8" height="8" rx="3.5" />
                          <rect x="13.5" y="13.5" width="8" height="8" rx="3.5" />
                        </svg>
                      ) : (
                        <CategoryIcon
                          name={categoryName}
                          slug={category?.slug}
                          size={22}
                          onDark={true}
                          className="text-white drop-shadow-sm"
                        />
                      )}
                    </div>
                    <div
                      className="text-white/95 text-xs sm:text-sm font-semibold tracking-wide drop-shadow-sm flex items-center justify-start gap-1"
                      style={{ fontFamily: "'Greta Arabic AR LT', 'GretaArabicARLT', sans-serif" }}
                    >
                      <span>/</span>
                      <span>{categoryName}</span>
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-full flex items-center justify-start gap-2 mb-2.5 text-right select-none"
                    dir="rtl"
                  >
                    {/* Category Icon on the FAR RIGHT in RTL */}
                    <div className="text-white shrink-0 flex items-center justify-center drop-shadow-md">
                      {iconStyle === 'station' ? (
                        <svg viewBox="0 0 24 24" width={22} height={22} fill="white" className="drop-shadow-sm">
                          <rect x="2.5" y="2.5" width="8" height="8" rx="3.5" />
                          <rect x="13.5" y="2.5" width="8" height="8" rx="3.5" />
                          <rect x="2.5" y="13.5" width="8" height="8" rx="3.5" />
                          <rect x="13.5" y="13.5" width="8" height="8" rx="3.5" />
                        </svg>
                      ) : (
                        <CategoryIcon
                          name={categoryName}
                          slug={category?.slug}
                          size={22}
                          onDark={true}
                          className="text-white drop-shadow-sm"
                        />
                      )}
                    </div>

                    {/* Slash and Category Name */}
                    <div
                      className="text-white/95 text-xs sm:text-sm font-semibold tracking-wide drop-shadow-sm flex items-center gap-1"
                      style={{ fontFamily: "'Greta Arabic AR LT', 'GretaArabicARLT', sans-serif" }}
                    >
                      <span>/</span>
                      <span>{categoryName}</span>
                    </div>
                  </div>
                )}

                {/* Line 2+: Arabic Paragraph / Title (Greta Arabic AR LT Bold font from reference image, NO AUTHOR NAME) */}
                <div
                  className="w-full text-white text-lg sm:text-2xl md:text-[26px] font-bold tracking-tight drop-shadow-md"
                  style={{ fontFamily: "'Greta Arabic AR LT', 'GretaArabicARLT', sans-serif" }}
                >
                  {renderParagraphContent()}
                </div>
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="flex items-center gap-2 mt-4 bg-[#0d1322] p-1.5 rounded-xl border border-neutral-800">
              <button
                type="button"
                onClick={() => setAspectRatio('portrait')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  aspectRatio === 'portrait'
                    ? 'bg-[#FDE047] text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Ratio size={13} />
                <span>4:5 بوستر (إنستجرام)</span>
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio('story')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  aspectRatio === 'story'
                    ? 'bg-[#FDE047] text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Smartphone size={13} />
                <span>9:16 ستوري</span>
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio('square')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  aspectRatio === 'square'
                    ? 'bg-[#FDE047] text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Square size={13} />
                <span>1:1 مربع</span>
              </button>
            </div>
          </div>

          {/* Right Column: Customization Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1. Mode Switch: Title vs Excerpt */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                النص العربي على البوستر:
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[#0d1322] p-1 rounded-xl border border-neutral-800">
                <button
                  type="button"
                  onClick={handleSelectTitleMode}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isUsingTitle
                      ? 'bg-neutral-800 text-white border border-neutral-700 shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Type size={14} />
                  <span>عنوان المقال</span>
                </button>

                <button
                  type="button"
                  onClick={handleSelectQuoteMode}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    !isUsingTitle
                      ? 'bg-neutral-800 text-white border border-neutral-700 shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Sparkles size={14} />
                  <span>اقتباس من المقال</span>
                </button>
              </div>
            </div>

            {/* 2. Textarea to edit title/quote */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                تعديل نص المقال (بخط Greta Arabic AR LT):
              </label>
              <textarea
                value={displayText}
                onChange={(e) => setDisplayText(e.target.value)}
                rows={3}
                className="w-full p-3 bg-[#0d1322] border border-neutral-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#FDE047] transition-colors resize-none leading-relaxed"
                style={{ fontFamily: "'Greta Arabic AR LT', 'GretaArabicARLT', sans-serif" }}
                placeholder="اكتب النص هنا..."
              />
              <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-1">
                <span>{displayText.length} حرفاً</span>
                <button
                  type="button"
                  onClick={() => setDisplayText(article.title)}
                  className="hover:text-[#FDE047] underline cursor-pointer"
                >
                  استعادة العنوان الأصلي
                </button>
              </div>
            </div>

            {/* 3. Vertical Position Control ("make it Up a little not under") */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5 flex items-center gap-1">
                <ArrowUpCircle size={14} className="text-[#FDE047]" />
                <span>موضع النص الرأسي (رفع النص للأعلى):</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-[#0d1322] p-1 rounded-xl border border-neutral-800 text-xs">
                <button
                  type="button"
                  onClick={() => setVerticalPosition('high')}
                  className={`py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                    verticalPosition === 'high'
                      ? 'bg-[#FDE047] text-black shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  مرتفع (مطابق للصورة)
                </button>
                <button
                  type="button"
                  onClick={() => setVerticalPosition('ultra')}
                  className={`py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                    verticalPosition === 'ultra'
                      ? 'bg-[#FDE047] text-black shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  مرتفع جداً
                </button>
                <button
                  type="button"
                  onClick={() => setVerticalPosition('mid')}
                  className={`py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                    verticalPosition === 'mid'
                      ? 'bg-[#FDE047] text-black shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  وسط
                </button>
              </div>
            </div>

            {/* 4. Category Icon Style Selector in RTL */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5 flex items-center gap-1" dir="rtl">
                <Shapes size={14} className="text-[#FDE047]" />
                <span>شكل أيقونة التصنيف:</span>
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[#0d1322] p-1 rounded-xl border border-neutral-800 text-xs" dir="rtl">
                <button
                  type="button"
                  onClick={() => setIconStyle('category')}
                  className={`py-2 px-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    iconStyle === 'category'
                      ? 'bg-[#FDE047] text-black font-extrabold shadow-xs'
                      : 'text-neutral-300 hover:text-white bg-neutral-800/80'
                  }`}
                  dir="rtl"
                >
                  <CategoryIcon
                    name={categoryName}
                    slug={category?.slug}
                    size={16}
                    onDark={iconStyle !== 'category'}
                  />
                  <span>أيقونة التصنيف ({categoryName})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIconStyle('station')}
                  className={`py-2 px-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    iconStyle === 'station'
                      ? 'bg-[#FDE047] text-black font-extrabold shadow-xs'
                      : 'text-neutral-300 hover:text-white bg-neutral-800/80'
                  }`}
                  dir="rtl"
                >
                  <span className="text-base leading-none">✣</span>
                  <span>المستوحاة من الصورة (4 مربعات)</span>
                </button>
              </div>

              {/* Sub-selector: Category icon layout (Inline RTL vs Stacked RTL) */}
              <div className="grid grid-cols-2 gap-2 mt-2 bg-[#070b13] p-1 rounded-lg border border-neutral-800/60 text-[11px]" dir="rtl">
                <button
                  type="button"
                  onClick={() => setIconLayout('inline')}
                  className={`py-1.5 px-2 rounded-md font-bold transition-all cursor-pointer ${
                    iconLayout === 'inline'
                      ? 'bg-neutral-700 text-white shadow-xs'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  بجانب الاسم (مضمن RTL)
                </button>
                <button
                  type="button"
                  onClick={() => setIconLayout('stacked')}
                  className={`py-1.5 px-2 rounded-md font-bold transition-all cursor-pointer ${
                    iconLayout === 'stacked'
                      ? 'bg-neutral-700 text-white shadow-xs'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  فوق الاسم (مكدس RTL)
                </button>
              </div>
            </div>

            {/* 5. Interactive Word Selector for Yellow Loop Highlight */}
            {showDoodles && wordsList.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  الكلمة المحاطة بالدائرة الصفراء:
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-[#0d1322] rounded-xl border border-neutral-800">
                  {wordsList.map((w, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setHighlightKeyword(w)}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        highlightKeyword === w
                          ? 'bg-[#FDE047] text-black font-extrabold shadow-xs'
                          : 'bg-neutral-800 text-neutral-300 hover:text-white'
                      }`}
                      style={{ fontFamily: "'Greta Arabic AR LT', 'GretaArabicARLT', sans-serif" }}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Doodles & Scratches Toggle */}
            <div className="bg-[#0d1322] p-3 rounded-xl border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">
                  الخط الأصفر واللمسات الفنية
                </span>
                <span className="text-[11px] text-neutral-400 block mt-0.5">
                  رسم خط يدوي أصفر وحركات تعبيرية كما في الصورة المرجعية
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowDoodles(!showDoodles)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  showDoodles ? 'bg-[#FDE047]' : 'bg-neutral-700'
                }`}
              >
                <div
                  className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    showDoodles ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 7. Download High-Res PNG Button */}
            <div>
              <button
                type="button"
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#FDE047] hover:bg-yellow-300 text-black font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg hover:shadow-yellow-500/20 disabled:opacity-50"
              >
                {isDownloading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>جارٍ إنشاء وتصدير البوستر...</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span>تحميل البوستر عالي الدقة (PNG)</span>
                  </>
                )}
              </button>
              <span className="text-[11px] text-neutral-400 block text-center mt-1.5">
                جاهز مباشرة للنشر على إنستجرام وتويتر وحالات الواتساب بالدقة الكاملة
              </span>
            </div>

            {/* 8. Direct Social Links & Copy */}
            <div className="pt-2.5 border-t border-neutral-800/80">
              <span className="text-xs font-bold text-neutral-300 block mb-2">
                مشاركة سريعة مع الرابط:
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleShareTwitter}
                  className="py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>نشر على إكس</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="py-2 px-3 rounded-xl bg-[#075e54]/30 hover:bg-[#075e54]/50 border border-[#25D366]/40 text-[#25D366] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                  <span>واتساب</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check size={14} className="text-[#FDE047]" /> : <Copy size={14} />}
                <span>{copied ? 'تم النسخ للحافظة!' : 'نسخ النص والرابط'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMsg && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 bg-[#FDE047] text-black px-4 py-2 rounded-xl text-xs font-bold shadow-xl animate-fade-in flex items-center gap-2">
            <Check size={14} />
            <span>{toastMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
