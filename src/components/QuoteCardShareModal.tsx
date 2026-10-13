'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Article } from '@/types';
import { getCategoryBySlug } from '@/data/categories';
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

  // Category and Author information from current page
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Extract keywords for quick highlighting
  useEffect(() => {
    if (article.title) {
      setDisplayText(article.title);
      setIsUsingTitle(true);
      const words = article.title.split(' ').filter((w) => w.length > 3);
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
    const words = article.title.split(' ').filter((w) => w.length > 3);
    if (words.length > 0) setHighlightKeyword(words[words.length - 1]);
  };

  const handleSelectQuoteMode = () => {
    setIsUsingTitle(false);
    const quote = article.excerpt || article.title;
    setDisplayText(quote);
    const words = quote.split(' ').filter((w) => w.length > 3);
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

  // Safe image loader through proxy to prevent CORS taint
  const loadSafeImage = async (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      const isRemote = src.startsWith('http://') || src.startsWith('https://');
      const safeSrc = isRemote ? `/api/proxy-image?url=${encodeURIComponent(src)}` : src;

      img.onload = () => resolve(img);
      img.onerror = () => {
        const fallbackImg = new Image();
        fallbackImg.crossOrigin = 'anonymous';
        fallbackImg.onload = () => resolve(fallbackImg);
        fallbackImg.onerror = () => reject(new Error('Image failed to load'));
        fallbackImg.src = src;
      };
      img.src = safeSrc;
    });
  };

  // High-Resolution Canvas Generator respecting exact fonts, RTL, and positioning
  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Explicitly load exact web fonts into the browser context
      if (typeof document !== 'undefined' && document.fonts) {
        try {
          await Promise.all([
            document.fonts.load('bold 48px "Greta Arabic AR LT"'),
            document.fonts.load('bold 52px "Greta Arabic AR LT"'),
            document.fonts.load('600 24px "Greta Arabic AR LT"'),
            document.fonts.load('42px "Arslan Wessam A"'),
            document.fonts.load('42px "(A) Arslan Wessam A (A) Arslan Wessam A"'),
            document.fonts.ready,
          ]);
        } catch {
          // Continue if already available
        }
      }

      // Sizing
      // 4:5 Portrait: 1080 x 1350 (Reference Image)
      // 9:16 Story: 1080 x 1920
      // 1:1 Square: 1080 x 1080
      let width = 1080;
      let height = 1350;
      if (aspectRatio === 'story') {
        height = 1920;
      } else if (aspectRatio === 'square') {
        height = 1080;
      }

      canvas.width = width;
      canvas.height = height;

      // 2. Draw Cover Artwork edge-to-edge
      try {
        const img = await loadSafeImage(article.coverImage);
        const scale = Math.max(width / img.width, height / img.height);
        const x = (width - img.width * scale) / 2;
        const y = (height - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      } catch {
        ctx.fillStyle = '#263238';
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Vignette Overlays:
      // Keep the upper and left portions of the artwork visible (like the man in the reference photo)
      // and gently darken the bottom-right for clean RTL text contrast.
      const bottomGrad = ctx.createLinearGradient(0, height * 0.45, 0, height);
      bottomGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      bottomGrad.addColorStop(0.35, 'rgba(0, 0, 0, 0.25)');
      bottomGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.65)');
      bottomGrad.addColorStop(1, 'rgba(0, 0, 0, 0.90)');
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, 0, width, height);

      // Radial dark shadow in bottom-right corner
      const radGrad = ctx.createRadialGradient(
        width * 0.85,
        height * 0.85,
        50,
        width * 0.85,
        height * 0.85,
        650
      );
      radGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);

      // Top bar subtle shadow
      const topGrad = ctx.createLinearGradient(0, 0, 0, 150);
      topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
      topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, width, 150);

      // 4. Top Bar Header:
      const topPadding = 65;

      // 4a. Top Left: 20 over 26
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.direction = 'ltr';
      ctx.fillText(currentYear.slice(0, 2), 75, topPadding);
      ctx.fillText(currentYear.slice(2, 4), 75, topPadding + 22);

      // 4b. Top Center: Fikr wa Falsafa White Logo Emblem (Identical to 101 Note white glyph)
      const logoX = width / 2;
      const logoY = topPadding - 12;

      // Draw geometric emblem
      ctx.fillStyle = '#FFFFFF';
      // Left pillar
      ctx.beginPath();
      ctx.roundRect(logoX - 44, logoY, 15, 48, 4);
      ctx.fill();
      // Center ring
      ctx.beginPath();
      ctx.arc(logoX, logoY + 24, 21, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000'; // Cutout ring center
      ctx.beginPath();
      ctx.arc(logoX, logoY + 24, 10, 0, Math.PI * 2);
      ctx.fill();
      // Right pillar
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(logoX + 29, logoY, 15, 48, 4);
      ctx.fill();

      // 4c. Top Right: Article ID / Reading time
      ctx.textAlign = 'right';
      ctx.font = 'bold 22px system-ui, -apple-system, monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText(articleNumber, width - 75, topPadding + 10);

      // 5. Left Vertical Watermark (Rotated 90°): fikerwafalsafa.com
      ctx.save();
      ctx.translate(50, height * 0.52);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '500 16px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '1.5px';
      ctx.fillText(siteDomain, 0, 0);
      ctx.restore();

      // 6. Bottom Right Content Block:
      // Respect exact position from reference photo:
      // Anchored to the right margin, constrained width (~58% of canvas) leaving left side visible
      const contentRight = width - 75;
      const contentBottom = height - 90;
      const maxTextWidth = width * 0.58;

      ctx.direction = 'rtl';
      ctx.textAlign = 'right';

      // 6a. Measure Text & Wrap in Greta Arabic Bold
      ctx.font = 'bold 48px "Greta Arabic AR LT", "GretaArabicARLT", sans-serif';
      const textLineHeight = 68;

      const words = displayText.split(' ');
      const lines: string[] = [];
      let curLine = '';

      for (let i = 0; i < words.length; i++) {
        const testLine = curLine ? `${curLine} ${words[i]}` : words[i];
        const m = ctx.measureText(testLine);
        if (m.width > maxTextWidth && i > 0) {
          lines.push(curLine);
          curLine = words[i];
        } else {
          curLine = testLine;
        }
      }
      if (curLine) lines.push(curLine);

      const totalTextHeight = lines.length * textLineHeight;
      const textStartY = contentBottom - totalTextHeight + 45;

      // Position Author and Category right above the title
      const authorY = textStartY - 52;
      const categoryY = authorY - 44;

      // 6b. Category Glyph (4 dots clover) + Category Name: ✤ / [التصنيف]
      const glyphX = contentRight;
      const glyphY = categoryY - 14;
      ctx.fillStyle = '#FFFFFF';

      ctx.beginPath();
      ctx.arc(glyphX - 4, glyphY - 4, 3.5, 0, Math.PI * 2);
      ctx.arc(glyphX + 4, glyphY - 4, 3.5, 0, Math.PI * 2);
      ctx.arc(glyphX - 4, glyphY + 4, 3.5, 0, Math.PI * 2);
      ctx.arc(glyphX + 4, glyphY + 4, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Category Name in Greta Arabic
      ctx.font = '600 22px "Greta Arabic AR LT", "GretaArabicARLT", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillText(`/ ${categoryName}`, glyphX - 22, categoryY);

      // 6c. Author Signature in Arslan Wessam A Cursive Script
      ctx.font = '40px "Arslan Wessam A", "(A) Arslan Wessam A (A) Arslan Wessam A", cursive';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(authorName, contentRight, authorY);

      // 6d. Main Title in Greta Arabic Bold
      ctx.font = 'bold 48px "Greta Arabic AR LT", "GretaArabicARLT", sans-serif';
      ctx.fillStyle = '#FFFFFF';

      lines.forEach((line, idx) => {
        const lineY = textStartY + idx * textLineHeight;
        ctx.fillText(line, contentRight, lineY);
      });

      // 6e. Hand-Drawn Yellow Doodles (Brush Underline & Loop)
      if (showDoodles) {
        ctx.save();
        ctx.strokeStyle = '#FDE047'; // Bright 101 Note Yellow
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Yellow underline under the main headline
        const lastLineY = textStartY + (lines.length - 1) * textLineHeight;
        const underlineY = lastLineY + 14;
        const underlineWidth = Math.min(300, maxTextWidth * 0.55);
        const startX = contentRight - 40;

        ctx.beginPath();
        ctx.moveTo(startX, underlineY);
        ctx.bezierCurveTo(
          startX - underlineWidth * 0.3,
          underlineY - 4,
          startX - underlineWidth * 0.7,
          underlineY + 6,
          startX - underlineWidth,
          underlineY + 2
        );
        ctx.stroke();

        // Yellow loop around the focal keyword
        if (highlightKeyword && displayText.includes(highlightKeyword)) {
          const loopCenterX = contentRight - 140;
          const loopCenterY = lastLineY - 14;
          ctx.beginPath();
          ctx.ellipse(loopCenterX, loopCenterY, 120, 34, -0.04, 0, Math.PI * 1.95);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 7. Trigger Direct PNG Download
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const downloadLink = document.createElement('a');
      downloadLink.download = `fiker-${article.slug || 'poster'}.png`;
      downloadLink.href = dataUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      showToast('تم تحميل بوستر المقال عالي الدقة (PNG) بنجاح!');
    } catch (err: any) {
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
              <h2 className="text-base sm:text-lg font-bold text-white font-arabic">
                تصميم وتحميل بوستر المشاركة (نمط 101 Note)
              </h2>
              <p className="text-[11px] sm:text-xs text-neutral-400">
                بوستر فني يدمج لوحة المقال مع الترويسة الأيقونية، خط غريتا العربي، توقيع الكاتب، واللمسات التعبيرية
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
            <div className="flex items-center justify-between w-full max-w-[420px] mb-3 text-xs text-neutral-400">
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
              className={`relative w-full rounded-xl overflow-hidden shadow-2xl transition-all duration-300 select-none border border-neutral-700/60 ${
                aspectRatio === 'portrait'
                  ? 'aspect-[4/5] max-w-[420px]'
                  : aspectRatio === 'story'
                  ? 'aspect-[9/16] max-w-[360px]'
                  : 'aspect-square max-w-[420px]'
              }`}
              style={{
                backgroundImage: `url(${article.coverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Soft Bottom-Right Gradient Shade (Leaving top/left illustration clear) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none z-0" />
              <div className="absolute inset-0 bg-radial from-transparent to-black/35 pointer-events-none z-0" />

              {/* 1. Top Bar: [20 / 26] (left), [Fikr Emblem Logo] (center), [Article #] (right) */}
              <div className="relative z-10 flex items-center justify-between px-6 pt-5" dir="ltr">
                {/* Top Left: 20 / 26 */}
                <div className="flex flex-col text-[11px] font-bold text-white/90 leading-tight select-none">
                  <span>{currentYear.slice(0, 2)}</span>
                  <span>{currentYear.slice(2, 4)}</span>
                </div>

                {/* Top Center: Stylized Geometric Logo Glyph */}
                <div className="flex items-center gap-1 text-white select-none">
                  <div className="w-2 h-6 bg-white rounded-xs" />
                  <div className="w-5 h-5 rounded-full border-[3px] border-white" />
                  <div className="w-2 h-6 bg-white rounded-xs" />
                </div>

                {/* Top Right: Note Number */}
                <div className="text-[11px] font-mono font-bold text-white/90 tracking-wider">
                  {articleNumber}
                </div>
              </div>

              {/* 2. Left Edge Vertical Domain Text */}
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-[9px] tracking-widest text-white/70 select-none z-10 font-sans" dir="ltr">
                {siteDomain}
              </div>

              {/* 3. Bottom Right Content & Typography Block (RTL, positioned in lower right corner) */}
              <div className="absolute bottom-6 right-6 max-w-[62%] text-right z-10 flex flex-col items-end">
                {/* Category: ✤ / Category Name */}
                <div className="flex items-center gap-1.5 text-white/90 text-xs sm:text-sm font-semibold mb-1" style={{ fontFamily: 'var(--font-arabic)' }}>
                  <span>/ {categoryName}</span>
                  {/* 4 dots clover glyph */}
                  <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
                    <div className="w-1 h-1 bg-white rounded-full" />
                    <div className="w-1 h-1 bg-white rounded-full" />
                    <div className="w-1 h-1 bg-white rounded-full" />
                    <div className="w-1 h-1 bg-white rounded-full" />
                  </div>
                </div>

                {/* Author Signature in Authentic Signature Font */}
                <div
                  className="text-white text-xl sm:text-2xl font-signature mb-1 leading-none drop-shadow-sm"
                  style={{ fontFamily: 'var(--font-signature)' }}
                >
                  {authorName}
                </div>

                {/* Big Bold Title / Quote Text */}
                <div className="relative">
                  <h3
                    className="text-white text-lg sm:text-xl lg:text-[23px] font-bold leading-snug tracking-tight drop-shadow-md"
                    style={{ fontFamily: 'var(--font-arabic)' }}
                  >
                    {displayText}
                  </h3>

                  {/* Yellow Doodle Highlight & Underline */}
                  {showDoodles && (
                    <div className="pointer-events-none mt-1">
                      {/* Playful Yellow Underline SVG */}
                      <svg
                        className="w-36 sm:w-44 h-3 mr-auto text-[#FDE047]"
                        viewBox="0 0 200 12"
                        fill="none"
                      >
                        <path
                          d="M 195 4 Q 130 9, 65 3 T 5 7"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hidden Canvas for High-Resolution Export */}
            <canvas ref={canvasRef} className="hidden" />

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
                className="w-full p-3 bg-[#0d1322] border border-neutral-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#FDE047] transition-colors resize-none leading-relaxed font-arabic"
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
                  رسم خط يدوي أصفر وحلقة دائرية كما في نمط 101 Note
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
                جاهز مباشرة للنشر على إنستجرام وتويتر وحالات الواتساب بدقة أصلية
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
