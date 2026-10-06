'use client';

import React from 'react';

interface ArticleBodyRendererProps {
  content: string;
}

export const ArticleBodyRenderer: React.FC<ArticleBodyRendererProps> = ({ content }) => {
  if (!content) return null;

  // Split by double newlines or if single block, split by double spaces after periods
  let blocks = content.split(/\n\s*\n/);
  if (blocks.length === 1 && content.includes('.  ')) {
    blocks = content.split(/\.\s{2,}/).map((b, i, arr) => (i < arr.length - 1 ? `${b}.` : b));
  }

  return (
    <div className="article-body-content text-black">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Image Block: ![alt](url)
        const imageMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (imageMatch) {
          const alt = imageMatch[1];
          const src = imageMatch[2];
          return (
            <figure key={idx} className="my-8 overflow-hidden border border-neutral-200 bg-neutral-50 rounded-sm">
              <img
                src={src}
                alt={alt || 'صورة المقال'}
                className="w-full h-auto max-h-[560px] object-cover mx-auto"
                loading="lazy"
              />
              {alt && (
                <figcaption className="p-3 text-center text-xs text-neutral-500 border-t border-neutral-100 bg-white">
                  {alt}
                </figcaption>
              )}
            </figure>
          );
        }

        // Blockquote
        if (trimmed.startsWith('>')) {
          const quoteText = trimmed.replace(/^>\s*/gm, '');
          return (
            <blockquote key={idx}>
              {formatInlineText(quoteText)}
            </blockquote>
          );
        }

        // H1 Heading
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx}>
              {formatInlineText(trimmed.replace(/^#\s+/, ''))}
            </h1>
          );
        }

        // H2 Heading
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx}>
              {formatInlineText(trimmed.replace(/^##\s+/, ''))}
            </h2>
          );
        }

        // H3 Heading
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx}>
              {formatInlineText(trimmed.replace(/^###\s+/, ''))}
            </h3>
          );
        }

        // Unordered List
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').filter((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '));
          return (
            <ul key={idx} className="list-disc list-inside space-y-2 pr-4 text-black text-[18px] mb-6 leading-[30px]">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="text-black">
                  {formatInlineText(item.replace(/^[-*]\s+/, ''))}
                </li>
              ))}
            </ul>
          );
        }

        // Numbered List
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split('\n').filter((l) => /^\d+\.\s/.test(l.trim()));
          return (
            <ol key={idx} className="list-decimal list-inside space-y-2 pr-4 text-black text-[18px] mb-6 leading-[30px]">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="text-black">
                  {formatInlineText(item.replace(/^\d+\.\s+/, ''))}
                </li>
              ))}
            </ol>
          );
        }

        // Normal paragraph with 101note exact typography
        return (
          <p key={idx} dir="rtl">
            {formatInlineText(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

/**
 * Handles inline formatting: **bold**, *italic*, and [link](url)
 * Note: Never use font-serif on Arabic strong tags to preserve typographic harmony!
 */
function formatInlineText(text: string): React.ReactNode {
  // Regex to split tokens for **bold** and *italic*
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-black">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={index} className="italic text-neutral-800">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}
