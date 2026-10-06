import React from 'react';

export interface CategoryIconProps {
  name?: string;
  slug?: string;
  className?: string;
  size?: number;
  onDark?: boolean;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  name = '',
  slug = '',
  className = '',
  size = 20,
  onDark = true,
}) => {
  const key = `${slug} ${name}`.toLowerCase().trim();

  // If className already specifies text color, keep it; otherwise default based on onDark
  const colorClass = className.includes('text-')
    ? ''
    : onDark
    ? 'text-white'
    : 'text-[#0a1226]';

  // 1. Science (علوم) -> Atom with orbital rings & central nucleus
  if (
    key.includes('science') ||
    key.includes('علوم') ||
    key.includes('علم') ||
    key.includes('ideas') ||
    key.includes('1am') ||
    key.includes('1-am')
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`inline-block ${colorClass} ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        aria-label="علوم"
      >
        <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
      </svg>
    );
  }

  // 2. Philosophy (فلسفة) -> Classical Greek Ionic Column (رمز الحكمة والوجود)
  if (
    key.includes('philosophy') ||
    key.includes('فلسفة') ||
    key.includes('psychology') ||
    key.includes('8am') ||
    key.includes('8-am')
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        className={`inline-block ${colorClass} ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        aria-label="فلسفة"
      >
        <path d="M3 3h18v2H3z" />
        <path d="M4 6.5C4 5.7 4.7 5 5.5 5h13c.8 0 1.5.7 1.5 1.5 0 .8-.7 1.5-1.5 1.5-.6 0-1.1-.3-1.4-.7-.2-.2-.5-.3-.8-.3H7.7c-.3 0-.6.1-.8.3-.3.4-.8.7-1.4.7C4.7 8 4 7.3 4 6.5z" />
        <circle cx="5.5" cy="6.5" r="1" />
        <circle cx="18.5" cy="6.5" r="1" />
        <rect x="5.5" y="8.5" width="2.2" height="9.5" rx="0.4" />
        <rect x="9.3" y="8.5" width="2.2" height="9.5" rx="0.4" />
        <rect x="13.1" y="8.5" width="2.2" height="9.5" rx="0.4" />
        <rect x="16.9" y="8.5" width="2.2" height="9.5" rx="0.4" />
        <rect x="4" y="18.5" width="16" height="1.8" rx="0.4" />
        <rect x="2.5" y="20.5" width="19" height="2" rx="0.5" />
      </svg>
    );
  }

  // 3. Literature (أدب) -> Open classical book with pages
  if (
    key.includes('literature') ||
    key.includes('أدب') ||
    key.includes('self') ||
    key.includes('12pm') ||
    key.includes('12-pm')
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`inline-block ${colorClass} ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        aria-label="أدب"
      >
        <path d="M2 4.5C3.8 3.5 6.2 3 8.8 3c3.2 0 5.2.8 7.2 2.2V19c-2-1.4-4-2.2-7.2-2.2-2.6 0-5 .5-6.8 1.5V4.5z" />
        <path d="M22 4.5c-1.8-1-4.2-1.5-6.8-1.5-3.2 0-5.2.8-7.2 2.2V19c2-1.4 4-2.2 7.2-2.2 2.6 0 5 .5 6.8 1.5V4.5z" />
        <path d="M12 5.5V17" strokeWidth="2" />
      </svg>
    );
  }

  // 4. Thoughts & Cinema (خواطر وسينما / سينما) -> Movie Clapperboard & Visual Thought
  if (
    key.includes('cinema') ||
    key.includes('سينما') ||
    key.includes('thoughts') ||
    key.includes('خواطر') ||
    key.includes('أفكار') ||
    key.includes('فكر') ||
    key.includes('relationships') ||
    key.includes('10pm') ||
    key.includes('10-pm')
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`inline-block ${colorClass} ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        aria-label="خواطر وسينما"
      >
        <rect x="3" y="8" width="18" height="13" rx="2" />
        <path d="M3 8l3.5-5h14.5l-3.5 5H3z" />
        <path d="M8.5 3l-3 5" />
        <path d="M13 3l-3 5" />
        <path d="M17.5 3l-3 5" />
        <polygon points="10.5 11.5 15.5 14.5 10.5 17.5 10.5 11.5" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  // 5. Opinion (رأي) -> Speech bubble with quotation marks
  if (
    key.includes('opinion') ||
    key.includes('رأي') ||
    key.includes('finance') ||
    key.includes('4am') ||
    key.includes('4-am')
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`inline-block ${colorClass} ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        aria-label="رأي"
      >
        <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.6 0-3.1-.4-4.4-1.2L3 20l1.4-4.6A8.5 8.5 0 1 1 21 11.5z" />
        <path d="M9 10c0-1.1.7-1.8 1.6-1.8.8 0 1.4.6 1.4 1.4 0 .9-.6 1.7-1.4 2.2L9.5 13" strokeWidth="1.8" />
        <path d="M14 10c0-1.1.7-1.8 1.6-1.8.8 0 1.4.6 1.4 1.4 0 .9-.6 1.7-1.4 2.2L14.5 13" strokeWidth="1.8" />
      </svg>
    );
  }

  // 6. Religion (دين) -> Spiritual crescent moon with star
  if (
    key.includes('religion') ||
    key.includes('دين') ||
    key.includes('أديان') ||
    key.includes('health') ||
    key.includes('5pm') ||
    key.includes('5-pm')
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`inline-block ${colorClass} ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        aria-label="دين"
      >
        <path d="M15.5 3.5A9 9 0 1 0 20 16.2 7.5 7.5 0 0 1 15.5 3.5z" />
        <path d="M15 8.5l.8 1.6 1.7.3-1.3 1.2.3 1.8-1.5-.8-1.5.8.3-1.8-1.3-1.2 1.7-.3L15 8.5z" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  // Fallback: Default to Classical Philosophy Column
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={`inline-block ${colorClass} ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-label={name || 'محطة'}
    >
      <path d="M3 3h18v2H3z" />
      <path d="M4 6.5C4 5.7 4.7 5 5.5 5h13c.8 0 1.5.7 1.5 1.5 0 .8-.7 1.5-1.5 1.5-.6 0-1.1-.3-1.4-.7-.2-.2-.5-.3-.8-.3H7.7c-.3 0-.6.1-.8.3-.3.4-.8.7-1.4.7C4.7 8 4 7.3 4 6.5z" />
      <circle cx="5.5" cy="6.5" r="1" />
      <circle cx="18.5" cy="6.5" r="1" />
      <rect x="5.5" y="8.5" width="2.2" height="9.5" rx="0.4" />
      <rect x="9.3" y="8.5" width="2.2" height="9.5" rx="0.4" />
      <rect x="13.1" y="8.5" width="2.2" height="9.5" rx="0.4" />
      <rect x="16.9" y="8.5" width="2.2" height="9.5" rx="0.4" />
      <rect x="4" y="18.5" width="16" height="1.8" rx="0.4" />
      <rect x="2.5" y="20.5" width="19" height="2" rx="0.5" />
    </svg>
  );
};
