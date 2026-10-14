'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Article } from '@/types';
import { getCategoryBySlug } from '@/data/categories';
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
  Ratio
} from 'lucide-react';

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

  // Authentic page information from Fikr wa Falsafa
  const category = getCategoryBySlug(article.categorySlug);
  const categoryName = category?.name || 'فلسفة';
  const authorName = 'يحيى نعيم';
  const currentYear = '2026';
  const articleNumber = article.id.replace(/\D/g, '').slice(0, 4) || '1750';
  const siteDomain = 'fikerwafalsafa.com';

  // Options
  const [displayText, setDisplayText] = useState(article.title || '');
  const [isUsingTitle, setIsUsingTitle] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<'portrait' | 'story' | 'square'>('portrait');
  const [highlightKeyword, setHighlightKeyword] = useState<string>('');
  const [showDoodles, setShowDoodles] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  // Derive proxy safe cover image URL to avoid CORS tainting during export
  const safeCoverImage = React.useMemo(() => {
    if (!article.coverImage) return '/file.svg';
    if (article.coverImage.startsWith('http://') || article.coverImage.startsWith('https://')) {
      return `/api/proxy-image?url=${encodeURIComponent(article.coverImage)}`;
    }
    return article.coverImage;
  }, [article.coverImage]);

  // Extract keywords for quick highlighting
  useEffect(() => {
    if (article.title) {
      setDisplayText(article.title);
      setIsUsingTitle(true);
      const words = article.title.split(' ').filter((w) => w.length > 2);
      if (words.length > 0) {
        setHighlightKeyword(words[words.length - 1]);
      }
    }
  }, [article.title]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSelectTitleMode = () => {
    setIsUsingTitle(true);
    setDisplayText(article.title);
    const words = article.title.split(' ').filter((w) => w.length > 2);
    if (words.length > 0) setHighlightKeyword(words[words.length - 1]);
  };

  const handleSelectQuoteMode = () => {
    setIsUsingTitle(false);
    const quote = article.excerpt || article.title;
    setDisplayText(quote);
    const words = quote.split(' ').filter((w) => w.length > 2);
    if (words.length > 0) setHighlightKeyword(words[0]);
  };

  // Copy share message
  const handleCopy = async () => {
    try {
      const msg = `«${displayText}»\n\n— من مقال: ${article.title}\nبقلم: ${authorName}\n${currentUrl}`;
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
    const text = `«${displayText.slice(0, 180)}»\n\n— من مقال: ${article.title}\nبقلم ${authorName}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = () => {
    const text = `«${displayText}»\n\n— من مقال: *${article.title}*\nبقلم: ${authorName}\n\n${currentUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // High-Resolution Export: Uses html-to-image to snapshot the exact rendered DOM
  // This guarantees 100% font match (Greta Arabic + Arslan Wessam A), native RTL, exact layout, and yellow scratches
  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      if (!cardRef.current) return;

      // Ensure fonts are loaded before taking screenshot
      if (typeof document !== 'undefined' && document.fonts) {
        await document.fonts.ready;
      }

      // Snapshot DOM element directly
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.98,
        pixelRatio: 3, // High-res 3x output (approx 1320 x 1650 px for crisp print/Instagram quality)
        cacheBust: true,
      });

      const downloadLink = document.createElement('a');
      downloadLink.download = `fiker-${article.slug || 'poster'}.png`;
      downloadLink.href = dataUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      showToast('تم تحميل البوستر عالي الدقة (PNG) بالخطوط والتصميم الأصلي بنجاح!');
    } catch (err: any) {
      console.error('Download error:', err);
      showToast(err?.message || 'حدث خطأ أثناء إنشاء الصورة');
    } finally {
      setIsDownloading(false);
    }
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
              <h2 className="text-base sm:text-lg font-bold text-white" style={{ fontFamily: "'Greta Arabic AR LT', 'GretaArabicARLT', sans-serif" }}>
                تصميم وتحميل بوستر المشاركة (نمط 101 Note)
              </h2>
              <p className="text-[11px] sm:text-xs text-neutral-400">
                مطابقة كاملة لخط المنصة، توقيع الكاتب (يحيى نعيم)، معلومات فكر وفلسفة، واللمسات التعبيرية
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

            {/* The Live Visual Card Container (Identical to reference screenshot) */}
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
              {/* 1. Full-Bleed Artwork Image (Original Painting Unaltered) */}
              <img
                src={safeCoverImage}
                alt={article.title}
                crossOrigin="anonymous"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0"
              />

              {/* 2. Soft Bottom-Right & Top Shadows (Leaves the art subject visible on the left) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/45 pointer-events-none z-10" />
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/55 to-transparent pointer-events-none z-10" />

              {/* 3. Top Header Bar (LTR for numerical symmetry) */}
              <div className="absolute top-5 left-6 right-6 flex items-center justify-between z-20" dir="ltr">
                {/* Top Left: 20 over 26 */}
                <div className="flex flex-col text-[11px] font-bold text-white leading-tight font-sans tracking-wide select-none drop-shadow-sm">
                  <span>{currentYear.slice(0, 2)}</span>
                  <span>{currentYear.slice(2, 4)}</span>
                </div>

                {/* Top Center: Fikr wa Falsafa White Logo Emblem (Geometric 101 Mark) */}
                <div className="flex items-center gap-1.5 text-white select-none drop-shadow-sm">
                  <svg className="w-11 h-5.5" viewBox="0 0 1838.72 834.92" fill="#FFFFFF">
                    <rect y="29.27" width="194.1" height="194.1" />
                    <rect x="1450.52" y="29.27" width="194.1" height="194.1" />
                    <path d="M956.66,834.92c-230.19,0-417.46-187.28-417.46-417.46S726.48,0,956.66,0s417.46,187.27,417.46,417.46-187.28,417.46-417.46,417.46ZM956.66,195.94c-122.15,0-221.52,99.37-221.52,221.52s99.37,221.53,221.52,221.53,221.53-99.37,221.53-221.53-99.37-221.52-221.53-221.52Z" />
                    <rect x="194.1" y="223.36" width="194.1" height="582.29" />
                    <rect x="1644.62" y="223.36" width="194.1" height="582.29" />
                  </svg>
                </div>

                {/* Top Right: Note/Article Number from Page */}
                <div className="text-[11px] font-mono font-bold text-white tracking-widest select-none drop-shadow-sm">
                  {articleNumber}
                </div>
              </div>

              {/* 4. Left Margin Vertical Domain: fikerwafalsafa.com */}
              <div
                className="absolute left-2.5 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-[9px] tracking-widest text-white/80 font-sans select-none z-20"
                dir="ltr"
              >
                {siteDomain}
              </div>

              {/* 5. Bottom Right Content Quadrant (RTL, exact positioning from reference) */}
              <div
                className="absolute bottom-6 sm:bottom-8 right-6 sm:right-8 max-w-[62%] sm:max-w-[58%] text-right z-20 flex flex-col items-end"
                dir="rtl"
              >
                {/* Line 1: Category with 4-dot clover glyph */}
                <div
                  className="flex items-center gap-1.5 text-white text-xs sm:text-sm font-semibold mb-1 drop-shadow-sm"
                  style={{ fontFamily: "'Greta Arabic AR LT', 'GretaArabicARLT', sans-serif" }}
                >
                  <span>/ {categoryName}</span>
                  {/* 4 dots clover glyph */}
                  <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
                    <div className="w-1 h-1 bg-white rounded-full" />
                    <div className="w-1 h-1 bg-white rounded-full" />
                    <div className="w-1 h-1 bg-white rounded-full" />
                    <div className="w-1 h-1 bg-white rounded-full" />
                  </div>
                </div>

                {/* Line 2: Author Name in the Authentic Arslan Wessam A Signature Font */}
                <div
                  className="text-white text-2xl sm:text-3xl lg:text-[34px] mb-1.5 leading-none drop-shadow-sm select-none"
                  style={{
                    fontFamily: "'Arslan Wessam A', '(A) Arslan Wessam A (A) Arslan Wessam A', cursive",
                  }}
                >
                  {authorName}
                </div>

                {/* Line 3+: The Main Title with Authentic Scratches & Yellow Accents */}
                <div className="relative text-right">
                  <h3
                    className="text-white text-lg sm:text-2xl font-bold leading-[1.25] tracking-tight drop-shadow-md whitespace-pre-line"
                    style={{ fontFamily: "'Greta Arabic AR LT', 'GretaArabicARLT', sans-serif" }}
                  >
                    {displayText}
                  </h3>

                  {/* Hand-Drawn Yellow Scratches & Doodles */}
                  {showDoodles && (
                    <div className="pointer-events-none mt-1.5 flex flex-col items-end">
                      {/* Yellow Brush Underline */}
                      <svg className="w-36 sm:w-48 h-3.5 text-[#FDE047]" viewBox="0 0 220 14" fill="none">
                        <path
                          d="M 215 5 C 160 11, 70 2, 5 8"
                          stroke="#FDE047"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      </svg>

                      {/* Small Doodle Sparkles / Accent near the text */}
                      <div className="relative -mt-6 -mr-4 flex items-center gap-1">
                        <svg className="w-6 h-6 text-[#FDE047]" viewBox="0 0 40 40" fill="none">
                          <circle cx="20" cy="20" r="16" stroke="#FDE047" strokeWidth="2.5" strokeDasharray="90 10" />
                          <circle cx="16" cy="16" r="2" fill="#FDE047" />
                          <circle cx="24" cy="16" r="2" fill="#FDE047" />
                          <path d="M 15 25 Q 20 28, 25 25" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                  )}
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
          <div className="lg:col-span-5 space-y-5">
            {/* 1. Mode Switch: Title vs Excerpt */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-2">
                نص البوستر الرئيسي:
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
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                تعديل النص المعروض على البوستر:
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

            {/* 3. Doodles & Highlight Accents Toggle */}
            <div className="bg-[#0d1322] p-3.5 rounded-xl border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">
                  الخط الأصفر واللمسات التعبيرية
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

            {/* 4. Download High-Res PNG Button */}
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

            {/* 5. Direct Social Links & Copy */}
            <div className="pt-3 border-t border-neutral-800/80">
              <span className="text-xs font-bold text-neutral-300 block mb-2.5">
                مشاركة سريعة مع الرابط:
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleShareTwitter}
                  className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>نشر على إكس</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="py-2.5 px-3 rounded-xl bg-[#075e54]/30 hover:bg-[#075e54]/50 border border-[#25D366]/40 text-[#25D366] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
