'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NewsletterModal } from './NewsletterModal';
import { SearchModal } from './SearchModal';
import { Logo } from './Logo';
import { X, Compass, Clock, Users, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'الرئيسية', icon: Compass },
    { href: '/#categories-section', label: 'محطات اليوم', icon: Clock },
    { href: '/authors', label: 'الكُتّاب', icon: Users },
    { href: '/admin', label: 'لوحة الإدارة', icon: ShieldCheck },
  ];

  return (
    <>
      {/* Fikr Wafalsafa Fixed Top Navigation Bar - Blurry Glassmorphism so photo under it appears */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1226]/45 backdrop-blur-md text-white border-b border-white/10 shadow-xs transition-colors duration-300">
        <div className="full-width-limited px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-[65px] md:h-[80px] lg:h-[90px]">
            {/* Right Side (RTL Start): Nav Menu Hamburger + Search */}
            <div className="flex items-center gap-4 sm:gap-6 flex-1">
              {/* Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-white hover:text-[#FACC15] transition-colors cursor-pointer p-1"
                title="قائمة التنقل"
                aria-label="قائمة التنقل"
              >
                <svg width="28" height="28" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M 20,28 H 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 20,50 H 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 20,72 H 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                </svg>
              </button>

              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-white hover:text-[#FACC15] transition-colors cursor-pointer p-1"
                title="بحث"
                aria-label="بحث"
              >
                <svg width="22" height="22" viewBox="0 0 30.34 30.34" fill="currentColor">
                  <path d="M29.15,30.34c-.23-.16-.49-.29-.69-.49-2.49-2.44-4.97-4.89-7.46-7.33-.06-.06-.13-.12-.2-.19-.09.06-.17.11-.24.17-1.65,1.26-3.49,2.07-5.53,2.42-3.04.52-5.94.06-8.63-1.48-2.8-1.61-4.74-3.94-5.78-7.01-.31-.91-.5-1.85-.57-2.81C.05,13.55.02,13.48,0,13.4c0-.55,0-1.11,0-1.66.08-.51.14-1.01.23-1.51.34-1.82,1.06-3.48,2.17-4.97C4.23,2.8,6.61,1.14,9.59.42c4.16-1.01,7.96-.19,11.3,2.49,2.67,2.15,4.22,4.98,4.57,8.4.3,2.98-.41,5.74-2.1,8.22-.34.5-.73.97-1.15,1.53.08.05.18.1.25.17,2.49,2.45,4.98,4.9,7.47,7.35.44.43.55.89.25,1.29-.15.2-.41.32-.61.48h-.41ZM1.96,12.19c0,1.71.31,3.36.87,4.54,1.74,3.71,4.64,5.86,8.7,6.37,2.84.36,5.47-.34,7.74-2.09,3.23-2.49,4.68-5.8,4.16-9.85-.45-3.57-2.38-6.26-5.55-7.92-3.59-1.88-7.26-1.81-10.75.29C3.76,5.55,2.1,8.64,1.96,12.19Z" />
                </svg>
              </button>
            </div>

            {/* Center: Brand Logo - Typography identical to footer */}
            <div className="flex justify-center items-center flex-1">
              <Logo onDark={true} size="md" />
            </div>

            {/* Left Side (RTL End): Links separated by "/" */}
            <div className="flex items-center justify-end flex-1 font-bold text-xs sm:text-sm">
              <div className="hidden sm:flex items-center gap-2.5 text-white">
                <button
                  onClick={() => setIsNewsletterOpen(true)}
                  className="hover:text-[#FACC15] transition-colors cursor-pointer"
                >
                  النشرة البريدية
                </button>
                <span className="opacity-40 font-light text-neutral-400">/</span>
                <span className="opacity-75 cursor-default">
                  محفوظاتك
                </span>
              </div>

              {/* Mobile icon */}
              <div className="sm:hidden flex items-center gap-2">
                <button
                  onClick={() => setIsNewsletterOpen(true)}
                  className="p-1 hover:text-[#FACC15] transition-colors"
                  title="النشرة البريدية"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Navigation Drawer when Hamburger is clicked (Clean style as before) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-[#0a1226] text-white h-full p-6 sm:p-8 flex flex-col justify-between z-10 shadow-2xl border-l border-[#1e293b]">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#1e293b]">
                <span className="text-xl font-bold">القائمة</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex flex-col gap-4 mt-6">
                {navLinks.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3.5 py-2.5 text-base font-bold transition-colors ${
                        isActive ? 'text-[#FACC15]' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-[#1e293b] flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsNewsletterOpen(true);
                }}
                className="w-full py-3 bg-[#FACC15] text-[#0a1226] font-bold text-center text-sm cursor-pointer hover:bg-yellow-400 transition-colors rounded-lg shadow-sm"
              >
                اشتراك في النشرة البريدية
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <NewsletterModal
        isOpen={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
      />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};
