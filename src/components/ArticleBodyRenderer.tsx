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

        // Blockquote
        if (trimmed.startsWith('>')) {
          const quoteText = trimmed.replace(/^>\s*/gm, '');
          return (
            <blockquote
              key={idx}
              className="my-8 p-5 sm:p-6 bg-neutral-50 border-r-4 border-black text-black text-lg sm:text-xl font-medium leading-relaxed"
            >
              {formatInlineText(quoteText)}
            </blockquote>
          );
        }

        // H1 Heading
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="text-3xl sm:text-4xl font-bold text-black my-6">
              {formatInlineText(trimmed.replace(/^#\s+/, ''))}
            </h1>
          );
        }

        // H2 Heading
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-2xl sm:text-3xl font-bold text-black mt-8 mb-4 border-r-3 border-black pr-3">
              {formatInlineText(trimmed.replace(/^##\s+/, ''))}
            </h2>
          );
        }

        // H3 Heading
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-xl sm:text-2xl font-bold text-black mt-6 mb-3">
              {formatInlineText(trimmed.replace(/^###\s+/, ''))}
            </h3>
          );
        }

        // Unordered List
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').filter((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '));
          return (
            <ul key={idx} className="list-disc list-inside space-y-2 pr-4 text-black text-base sm:text-lg mb-6 leading-relaxed">
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
            <ol key={idx} className="list-decimal list-inside space-y-2 pr-4 text-black text-base sm:text-lg mb-6 leading-relaxed">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="text-black">
                  {formatInlineText(item.replace(/^\d+\.\s+/, ''))}
                </li>
              ))}
            </ol>
          );
        }

        // Normal paragraph with formatted inline bold/italic (101n style: p dir="rtl")
        return (
          <p
            key={idx}
            dir="rtl"
            className="text-black text-[18px] sm:text-[20px] lg:text-[21px] font-normal leading-[2] sm:leading-[2.2] mb-7 text-justify"
          >
            {formatInlineText(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

/**
 * Handles inline formatting: **bold**, *italic*, and [link](url)
 */
function formatInlineText(text: string): React.ReactNode {
  // Regex to split tokens for **bold** and *italic*
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-black font-serif">
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
