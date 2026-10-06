'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Compass, ArrowRight } from 'lucide-react';

export const NotFoundView: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />

      <main className="flex-1 margin-below-nav flex items-center justify-center p-6 py-24">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#0a1226]/5 border border-[#0a1226]/20 text-[#0a1226]">
            <Compass size={40} className="stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              خطأ 404
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#0a1226]">
              الصفحة غير موجودة
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-sm mx-auto">
              عذراً، الصفحة التي تحاول الوصول إليها غير متوفرة أو ربما تم تغيير مسارها أو حذفها.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0a1226] text-white hover:bg-[#152347] text-xs font-bold transition-colors"
            >
              <span>العودة للرئيسية</span>
              <ArrowRight size={14} className="rotate-180" />
            </Link>

            <Link
              href="/#categories-section"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-neutral-300 hover:border-black text-black text-xs font-bold transition-colors"
            >
              استكشف محطات اليوم
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
