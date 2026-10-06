'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="footer bg-[#070e1e] text-white w-full py-8 sm:py-12 mt-16 sm:mt-24 border-t border-[#1e293b]">
      <div className="footer-content full-width-limited px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Purpose */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-right">
          <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
            فِكْر وفَلْسَفَة
          </Link>
          <div className="hidden sm:block w-px h-5 bg-neutral-800" />
          <p className="text-xs sm:text-sm text-neutral-400 font-normal">
            منصة عربية للمقالات الشخصية والتأملات الفكرية عبر محطات اليوم.
          </p>
        </div>

        {/* Social Media Buttons (Yahia Naim) */}
        <div className="social-media-buttons flex items-center gap-3">
          <a
            href="https://x.com/yahia_naim"
            target="_blank"
            rel="noopener noreferrer"
            title="حساب يحيى نعيم على إكس"
            className="w-9 h-9 rounded-full border border-neutral-700 flex items-center justify-center text-white hover:bg-[#FACC15] hover:text-[#0a1226] hover:border-[#FACC15] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://instagram.com/yahia_naim"
            target="_blank"
            rel="noopener noreferrer"
            title="حساب يحيى نعيم على إنستجرام"
            className="w-9 h-9 rounded-full border border-neutral-700 flex items-center justify-center text-white hover:bg-[#FACC15] hover:text-[#0a1226] hover:border-[#FACC15] transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>
          <a
            href="https://facebook.com/yahia.naim"
            target="_blank"
            rel="noopener noreferrer"
            title="حساب يحيى نعيم على فيسبوك"
            className="w-9 h-9 rounded-full border border-neutral-700 flex items-center justify-center text-white hover:bg-[#FACC15] hover:text-[#0a1226] hover:border-[#FACC15] transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a
            href="https://github.com/yahyanaim"
            target="_blank"
            rel="noopener noreferrer"
            title="حساب يحيى نعيم على جيت هب"
            className="w-9 h-9 rounded-full border border-neutral-700 flex items-center justify-center text-white hover:bg-[#FACC15] hover:text-[#0a1226] hover:border-[#FACC15] transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <a
            href="mailto:yahyanaim2001@gmail.com"
            title="مراسلة يحيى نعيم بالبريد الإلكتروني"
            className="w-9 h-9 rounded-full border border-neutral-700 flex items-center justify-center text-white hover:bg-[#FACC15] hover:text-[#0a1226] hover:border-[#FACC15] transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};
