'use client';

import React, { useState } from 'react';
import { useArticles } from '@/context/ArticlesContext';
import { CategoryIcon } from './CategoryIcon';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { categories } = useArticles();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const activeCategory = categories.find((c) => c.slug === selectedCategory);
  const activeLabel = hoveredCategory
    ? categories.find((c) => c.slug === hoveredCategory)?.name
    : (selectedCategory !== 'all' ? activeCategory?.name : null);

  return (
    <div className="w-full bg-transparent py-2 select-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Six Category Icons: Science, Philosophy, Literature, Thoughts, Opinion, Religion */}
        <ul className="flex items-center gap-3 sm:gap-4 py-1">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.slug;

            return (
              <li key={category.id} className="relative flex flex-col items-center">
                <button
                  onClick={() =>
                    onSelectCategory(isSelected ? 'all' : category.slug)
                  }
                  onMouseEnter={() => setHoveredCategory(category.slug)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`flex flex-col items-center justify-center p-1.5 transition-all cursor-pointer group ${
                    isSelected
                      ? 'opacity-100 scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  title={`${category.name} - ${category.description}`}
                >
                  <CategoryIcon
                    name={category.name}
                    slug={category.slug}
                    size={36}
                    onDark={true}
                    className="transition-transform duration-200"
                  />
                  {/* Subtle Yellow Active Indicator */}
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] mt-1 shadow-[0_0_6px_#FACC15]" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Dynamic Category Label in Golden Yellow */}
        <div className="min-h-[28px] flex items-center gap-2">
          {activeLabel && (
            <div className="text-[#FACC15] text-sm sm:text-base font-bold tracking-wide transition-all duration-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FACC15] animate-pulse" />
              <span>{activeLabel}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
