'use client';

import React, { useState } from 'react';
import { Mail, Check, Link2, MessageCircle } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  excerpt: string;
  url?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ title, excerpt, url }) => {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (url) return url;
    if (typeof window !== 'undefined') return window.location.href;
    return 'https://fiker-wafalsafa.com';
  };

  const currentUrl = getShareUrl();
  const shareText = `${title}\n\n"${excerpt}"\n`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareLinks = [
    {
      name: 'X (تويتر)',
      icon: '𝕏',
      isTextIcon: true,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(currentUrl)}&hashtags=فكر_وفلسفة,مقالات`,
      bgColor: 'hover:bg-gray-900 hover:text-white',
    },
    {
      name: 'واتساب',
      icon: MessageCircle,
      isTextIcon: false,
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${shareText} ${currentUrl}`
      )}`,
      bgColor: 'hover:bg-emerald-600 hover:text-white',
    },
    {
      name: 'فيسبوك',
      icon: 'f',
      isTextIcon: true,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl
      )}&quote=${encodeURIComponent(shareText)}`,
      bgColor: 'hover:bg-blue-600 hover:text-white',
    },
    {
      name: 'بريد إلكتروني',
      icon: Mail,
      isTextIcon: false,
      href: `mailto:?subject=${encodeURIComponent(
        `مقال فلسفي مميز: ${title}`
      )}&body=${encodeURIComponent(`${shareText}\n\nاقرأ المقال كاملاً:\n${currentUrl}`)}`,
      bgColor: 'hover:bg-blue-600 hover:text-white',
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-neutral-500 font-semibold ml-2">مشاركة المقال:</span>

      {shareLinks.map((item) => {
        const IconComponent = !item.isTextIcon ? (item.icon as React.ElementType) : null;
        return (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`مشاركة عبر ${item.name}`}
            className={`flex items-center justify-center w-9 h-9 rounded-none bg-neutral-900 text-neutral-400 border border-neutral-800 transition-all text-xs font-bold ${item.bgColor}`}
          >
            {item.isTextIcon ? (
              <span>{item.icon as string}</span>
            ) : (
              IconComponent && <IconComponent size={15} />
            )}
          </a>
        );
      })}

      {/* Copy Link Button */}
      <button
        onClick={handleCopyLink}
        title="نسخ رابط المقال"
        className={`flex items-center gap-1.5 px-3 h-9 rounded-none text-xs font-medium border transition-all cursor-pointer ${
          copied
            ? 'bg-neutral-900 border-neutral-700 text-white'
            : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
        }`}
      >
        {copied ? (
          <>
            <Check size={14} className="text-white" />
            <span>تم النسخ!</span>
          </>
        ) : (
          <>
            <Link2 size={14} />
            <span>نسخ الرابط</span>
          </>
        )}
      </button>
    </div>
  );
};
