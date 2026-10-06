'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, Calendar, BookOpen } from 'lucide-react';
import { useArticles } from '@/context/ArticlesContext';
import { CategoryIcon } from './CategoryIcon';
import { formatWordCountBadge } from '@/utils/arabic';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { articles, categories, authors } = useArticles();

  const filteredArticles = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return articles.filter((art) => {
      const matchTitle = art.title.toLowerCase().includes(q);
      const matchExcerpt = art.excerpt.toLowerCase().includes(q);
      const matchBody = art.body.toLowerCase().includes(q);
      const author = authors.find((a) => a.id === art.authorId);
      const matchAuthor = author?.name.toLowerCase().includes(q);
      const category = categories.find((c) => c.slug === art.categorySlug);
      const matchCategory = category?.name.toLowerCase().includes(q);

      return matchTitle || matchExcerpt || matchBody || matchAuthor || matchCategory;
    });
  }, [query, articles, authors, categories]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-2xl bg-black border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center gap-3">
          <Search size={22} className="text-white shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في المقالات، الأفكار، الكُتّاب، أو محطات اليوم..."
            autoFocus
            className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-base sm:text-lg"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-500 hover:text-white rounded-md"
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs bg-neutral-900 hover:bg-neutral-800 text-neutral-400 rounded-lg border border-neutral-800 shadow-sm transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>

        {/* Results / Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-neutral-400">
              <p className="text-sm mb-3">جرّب البحث عن كلمات مثل:</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {['العزلة', 'الإنتاجية', 'سؤال المعنى', 'الهشاشة', 'منتصف الليل', 'الحرية'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1 bg-neutral-900 hover:bg-neutral-900 text-neutral-400 text-xs rounded-full border border-neutral-800 shadow-sm transition-all cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="py-12 text-center text-neutral-400">
              <BookOpen size={36} className="mx-auto mb-3 opacity-40 text-neutral-500" />
              <p className="text-base text-neutral-400">لم نجد مقالات تطابق "{query}"</p>
              <p className="text-xs text-neutral-500 mt-1">جرّب البحث بكلمات أبسط أو تصفح المحطات الزمنية</p>
            </div>
          ) : (
            <div>
              <div className="text-xs text-neutral-400 mb-2 px-1">
                عثرنا على {filteredArticles.length} مقال:
              </div>
              <div className="space-y-2.5">
                {filteredArticles.map((article) => {
                  const category = categories.find((c) => c.slug === article.categorySlug);
                  const author = authors.find((a) => a.id === article.authorId);

                  return (
                    <Link
                      key={article.id}
                      href={`/articles/${article.slug || article.id}`}
                      onClick={onClose}
                      className="block p-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 shadow-sm transition-all group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        {category && (
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md"
                            style={{
                              backgroundColor: category.accentBg,
                              color: category.color,
                            }}
                          >
                            <CategoryIcon name={category.iconName} size={12} />
                            {category.name}
                          </span>
                        )}
                        <span className="text-[11px] text-neutral-500">
                          {formatWordCountBadge(article.wordCount)}
                        </span>
                      </div>
                      
                      <h4 className="text-white group-hover:text-blue-600 font-semibold text-base transition-colors line-clamp-1 mb-1">
                        {article.title}
                      </h4>
                      
                      <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-800">
                        <span>{author?.name || 'كاتب في فكر وفلسفة'}</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {article.publishDate}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
