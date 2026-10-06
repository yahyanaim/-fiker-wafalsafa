'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  onDark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  onDark = true,
  size = 'md',
}) => {
  const textSizes = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl sm:text-3xl lg:text-4xl',
    lg: 'text-3xl sm:text-4xl lg:text-5xl',
  };

  const textColor = onDark ? 'text-white' : 'text-[#0a1226]';

  return (
    <Link
      href="/"
      className={`inline-flex items-center group cursor-pointer transition-opacity hover:opacity-90 ${className}`}
      title="فِكْر وفَلْسَفَة"
    >
      <span className={`${textSizes[size]} font-bold tracking-tight ${textColor} whitespace-nowrap`}>
        فِكْر وفَلْسَفَة
      </span>
    </Link>
  );
};
