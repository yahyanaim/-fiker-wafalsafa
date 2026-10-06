'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Article } from '@/types';
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Smartphone,
  Square,
  Image as ImageIcon,
  Loader2
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

  const [quoteText, setQuoteText] = useState(article.excerpt || '');
  const [aspectRatio, setAspectRatio] = useState<'square' | 'story'>('square');
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (article.excerpt) {
      setQuoteText(article.excerpt);
    }
  }, [article.excerpt]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const formattedShareMessage = `«${quoteText}»\n\n— من مقال: ${article.title}\nبقلم: يحيى نعيم\n${currentUrl}`;

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedShareMessage);
      setCopied(true);
      showToast('تم نسخ الاقتباس ورابط المقال بنجاح!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('فشل في نسخ النص');
    }
  };

  // Direct Social Share URLs
  const handleShareTwitter = () => {
    const text = `«${quoteText.slice(0, 200)}${quoteText.length > 200 ? '...' : ''}»\n\n— من مقال: ${article.title}\nبقلم يحيى نعيم`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = () => {
    const text = `«${quoteText}»\n\n— من مقال: *${article.title}*\nبقلم: يحيى نعيم\n\n${currentUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(`«${quoteText}» — ${article.title}`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Canvas Image Generator & Downloader
  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1200;
      const height = aspectRatio === 'square' ? 1200 : 1600;

      canvas.width = width;
      canvas.height = height;

      // 1. Draw Background Image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = article.coverImage;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // fallback gracefully
      });

      if (img.complete && img.naturalWidth > 0) {
        // Draw image covering canvas
        const scale = Math.max(width / img.width, height / img.height);
        const x = (width - img.width * scale) / 2;
        const y = (height - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      } else {
        // Fallback dark gradient
        ctx.fillStyle = '#0a1226';
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Dark Luxury Gradient Overlays
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, 'rgba(10, 18, 38, 0.75)');
      grad.addColorStop(0.35, 'rgba(10, 18, 38, 0.88)');
      grad.addColorStop(0.7, 'rgba(10, 18, 38, 0.94)');
      grad.addColorStop(1, 'rgba(10, 18, 38, 0.98)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Gold border accent
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
      ctx.lineWidth = 14;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // Inner subtle border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      ctx.strokeRect(52, 52, width - 104, height - 104);

      // 3. Top Header: Platform Logo & Branding
      ctx.direction = 'rtl';
      ctx.textAlign = 'center';

      // Platform Name
      ctx.font = 'bold 36px "Greta Arabic AR LT", "Noto Naskh Arabic", sans-serif';
      ctx.fillStyle = '#FACC15';
      ctx.fillText('فكر وفلسفة', width / 2, 130);

      ctx.font = '22px "Greta Arabic AR LT", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('منصة التأملات الفكرية والمقالات', width / 2, 175);

      // 4. Large Gold Quotation Mark
      ctx.font = 'bold 120px serif';
      ctx.fillStyle = '#FACC15';
      ctx.fillText('«', width / 2, 280);

      // 5. Quote Text Wrapping
      ctx.font = '500 38px "Greta Arabic AR LT", "SF Pro Display", sans-serif';
      ctx.fillStyle = '#FFFFFF';

      const maxLineWidth = width - 240;
      const lineHeight = 64;
      const words = quoteText.split(' ');
      let currentLine = '';
      const lines: string[] = [];

      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxLineWidth && i > 0) {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      // Vertically center the quote block
      const totalQuoteHeight = lines.length * lineHeight;
      const startY =
        aspectRatio === 'square'
          ? Math.max(370, (height - totalQuoteHeight) / 2 - 20)
          : Math.max(460, (height - totalQuoteHeight) / 2 - 60);

      lines.forEach((line, index) => {
        ctx.fillText(line, width / 2, startY + index * lineHeight);
      });

      // Closing Quote Mark
      ctx.font = 'bold 80px serif';
      ctx.fillStyle = '#FACC15';
      ctx.fillText('»', width / 2, startY + lines.length * lineHeight + 40);

      // 6. Bottom Section: Article Title & Author Signature
      const bottomY = height - 160;

      // Divider line
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 200, bottomY - 60);
      ctx.lineTo(width / 2 + 200, bottomY - 60);
      ctx.stroke();

      // Article Title
      ctx.font = 'bold 30px "Greta Arabic AR LT", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      const truncatedTitle =
        article.title.length > 50
          ? `${article.title.slice(0, 50)}...`
          : article.title;
      ctx.fillText(`مقال: ${truncatedTitle}`, width / 2, bottomY - 15);

      // Author Signature in Gold
      ctx.font = 'bold 36px "Greta Arabic AR LT", cursive, sans-serif';
      ctx.fillStyle = '#FACC15';
      ctx.fillText('يحيى نعيم', width / 2, bottomY + 35);

      ctx.font = '20px "Greta Arabic AR LT", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText('الكاتب والمشرف العام | فكر وفلسفة', width / 2, bottomY + 70);

      // 7. Trigger Download
      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `fiker-${article.slug || 'quote'}-card.png`;
      downloadLink.href = dataUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      showToast('تم تحميل بطاقة الاقتباس بنجاح بصيغة PNG عالية الدقة!');
    } catch (err: any) {
      showToast(err?.message || 'حدث خطأ أثناء إنشاء الصورة');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#0a1226] text-white rounded-2xl border border-neutral-700 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#070d1e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FACC15]/20 text-[#FACC15] flex items-center justify-center border border-[#FACC15]/40">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-serif">
                معاينة ومشاركة بطاقة الاقتباس والصورة
              </h2>
              <p className="text-[11px] text-neutral-400">
                شارك اقتباس المقال مع صورته الفلسفية على وسائل التواصل أو حملها كصورة عالية الدقة
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

        {/* Modal Body: Left Preview, Right Controls */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Card Preview Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <span className="text-xs font-bold text-neutral-400 mb-3 self-start flex items-center gap-1.5">
              <ImageIcon size={14} className="text-[#FACC15]" />
              <span>معاينة البطاقة كما ستظهر للمتابعين:</span>
            </span>

            {/* The Live Visual Card */}
            <div
              ref={cardRef}
              className={`relative w-full rounded-2xl overflow-hidden border-2 border-[#FACC15]/40 shadow-2xl transition-all duration-300 flex flex-col justify-between text-center select-none ${
                aspectRatio === 'square'
                  ? 'aspect-square max-w-[420px]'
                  : 'aspect-[9/14] max-w-[360px]'
              }`}
              style={{
                backgroundImage: `url(${article.coverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Deep Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1226] via-[#0a1226]/85 to-[#0a1226]/75 z-0" />

              {/* Inner Decorative Golden Border */}
              <div className="absolute inset-3 border border-[#FACC15]/20 rounded-xl pointer-events-none z-10" />

              {/* Card Top: Branding */}
              <div className="relative z-10 pt-6 px-6">
                <span className="text-xs font-bold text-[#FACC15] tracking-wide block">
                  فكر وفلسفة
                </span>
                <span className="text-[10px] text-white/60 block mt-0.5">
                  منصة التأملات الفكرية
                </span>
              </div>

              {/* Card Center: Quotation & Text */}
              <div className="relative z-10 px-8 py-4 my-auto">
                <span className="text-4xl text-[#FACC15] font-serif leading-none block mb-1">
                  «
                </span>
                <blockquote className="text-sm sm:text-base font-medium text-white leading-relaxed text-center font-serif">
                  {quoteText}
                </blockquote>
                <span className="text-3xl text-[#FACC15] font-serif leading-none block mt-1">
                  »
                </span>
              </div>

              {/* Card Bottom: Title & Author Signature */}
              <div className="relative z-10 pb-6 px-6">
                <div className="w-16 h-0.5 bg-[#FACC15]/40 mx-auto mb-2" />
                <h4 className="text-xs sm:text-sm font-bold text-white/95 line-clamp-1 mb-1 font-serif">
                  {article.title}
                </h4>
                <div className="text-base sm:text-lg font-signature text-[#FACC15]">
                  يحيى نعيم
                </div>
                <span className="text-[10px] text-white/50 block mt-0.5">
                  الكاتب والمشرف العام
                </span>
              </div>
            </div>

            {/* Hidden Canvas for High-Resolution Export */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Aspect Ratio Toggle */}
            <div className="flex items-center gap-2 mt-4 bg-[#070d1e] p-1 rounded-xl border border-neutral-800">
              <button
                type="button"
                onClick={() => setAspectRatio('square')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  aspectRatio === 'square'
                    ? 'bg-[#FACC15] text-[#0a1226]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Square size={13} />
                <span>مربع (1:1 للبوست)</span>
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio('story')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  aspectRatio === 'story'
                    ? 'bg-[#FACC15] text-[#0a1226]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Smartphone size={13} />
                <span>طولي (للقصص والستوري)</span>
              </button>
            </div>
          </div>

          {/* Right Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1. Custom Quote Textarea */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                تعديل أو كتابة الاقتباس المفضل من المقال:
              </label>
              <textarea
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                rows={4}
                className="w-full p-3 bg-[#070d1e] border border-neutral-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#FACC15] transition-colors resize-none leading-relaxed"
                placeholder="اكتب الاقتباس هنا..."
              />
              <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-1">
                <span>{quoteText.length} حرفاً</span>
                <button
                  type="button"
                  onClick={() => setQuoteText(article.excerpt || '')}
                  className="hover:text-[#FACC15] underline cursor-pointer"
                >
                  استعادة الاقتباس الأصلي
                </button>
              </div>
            </div>

            {/* 2. Download Image Button */}
            <div>
              <button
                type="button"
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="w-full py-3 px-4 rounded-xl bg-[#FACC15] hover:bg-yellow-400 text-[#0a1226] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                {isDownloading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>جارٍ إنشاء وتحميل الصورة...</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>تحميل كصورة عالية الدقة (PNG)</span>
                  </>
                )}
              </button>
              <span className="text-[10px] text-neutral-400 block text-center mt-1">
                تحميل فوري لصورة فخمة جاهزة للنشر على إنستجرام وتويتر وحالات واتساب
              </span>
            </div>

            {/* 3. Direct Share Buttons */}
            <div className="pt-3 border-t border-neutral-800">
              <span className="text-xs font-bold text-neutral-300 block mb-2.5">
                مشاركة مباشرة مع النص والرابط:
              </span>

              <div className="grid grid-cols-2 gap-2">
                {/* Twitter / X */}
                <button
                  type="button"
                  onClick={handleShareTwitter}
                  className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>نشر على إكس (X)</span>
                </button>

                {/* WhatsApp */}
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="py-2.5 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-[#25D366] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Share2 size={14} />
                  <span>واتساب (WhatsApp)</span>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={handleShareFacebook}
                  className="py-2.5 px-3 rounded-xl bg-[#1877F2]/20 hover:bg-[#1877F2]/30 border border-[#1877F2]/50 text-blue-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>فيسبوك</span>
                </button>

                {/* LinkedIn */}
                <button
                  type="button"
                  onClick={handleShareLinkedIn}
                  className="py-2.5 px-3 rounded-xl bg-sky-950 hover:bg-sky-900 border border-sky-700 text-sky-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ExternalLink size={14} />
                  <span>لينكد إن</span>
                </button>
              </div>

              {/* Copy Full Quote & URL */}
              <button
                type="button"
                onClick={handleCopy}
                className="w-full mt-2 py-2.5 px-3 rounded-xl bg-[#070d1e] hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                <span>{copied ? 'تم النسخ بنجاح!' : 'نسخ الاقتباس المنسق مع الرابط'}</span>
              </button>
            </div>

            {/* 4. Yahia Naim Social Media Accounts */}
            <div className="pt-3 border-t border-neutral-800">
              <span className="text-[11px] font-bold text-neutral-400 block mb-2">
                حسابات الكاتب يحيى نعيم الرسمية:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="https://x.com/yahia_naim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-[11px] text-white hover:text-[#FACC15] hover:border-[#FACC15] transition-colors"
                >
                  <span>إكس</span>
                </a>
                <a
                  href="https://instagram.com/yahia_naim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-[11px] text-white hover:text-[#FACC15] hover:border-[#FACC15] transition-colors"
                >
                  <span>إنستجرام</span>
                </a>
                <a
                  href="https://facebook.com/yahia.naim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-[11px] text-white hover:text-[#FACC15] hover:border-[#FACC15] transition-colors"
                >
                  <span>فيسبوك</span>
                </a>
                <a
                  href="https://linkedin.com/in/yahyanaim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-[11px] text-white hover:text-[#FACC15] hover:border-[#FACC15] transition-colors"
                >
                  <span>لينكد إن</span>
                </a>
                <a
                  href="https://github.com/yahyanaim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-[11px] text-white hover:text-[#FACC15] hover:border-[#FACC15] transition-colors"
                >
                  <span>جيت هب</span>
                </a>
                <a
                  href="mailto:yahyanaim2001@gmail.com"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-[11px] text-white hover:text-[#FACC15] hover:border-[#FACC15] transition-colors"
                >
                  <span>البريد</span>
                </a>
              </div>
            </div>

            {/* Toast Notification */}
            {toastMsg && (
              <div className="p-2.5 rounded-lg bg-[#FACC15] text-[#0a1226] text-xs font-bold text-center animate-fade-in">
                {toastMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
