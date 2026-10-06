'use client';

import React, { useState } from 'react';
import { Mail, X, CheckCircle, Sparkles } from 'lucide-react';
import { useArticles } from '@/context/ArticlesContext';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ message: string; success: boolean } | null>(null);
  const { subscribeNewsletter } = useArticles();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = subscribeNewsletter(email);
    setStatus(res);
    if (res.success) {
      setTimeout(() => {
        setEmail('');
        setStatus(null);
        onClose();
      }, 2200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg p-6 sm:p-8 bg-black border border-neutral-800 rounded-2xl shadow-2xl text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-neutral-500 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors"
          aria-label="إغلاق"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4 text-white">
          <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
            <Mail size={24} />
          </div>
          <span className="text-sm font-semibold tracking-wide flex items-center gap-1.5">
            <Sparkles size={15} />
            النشرة البريدية الفلسفية
          </span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 font-serif">
          رسائل فكر وفلسفة الأسبوعية
        </h3>
        
        <p className="text-neutral-400 text-sm leading-relaxed mb-6">
          انضم إلى مجتمع قرائنا وتلقَّ كل صباح سبت مقالاً تأملياً مختاراً بعناية، يطرح أسئلة المعنى والوجود بعيداً عن صخب الأخبار السريعة.
        </p>

        {status && (
          <div
            className={`p-3.5 mb-5 rounded-xl text-sm flex items-center gap-2.5 ${
              status.success
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            {status.success && <CheckCircle size={18} className="shrink-0" />}
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newsletter-email" className="block text-xs font-medium text-neutral-400 mb-1.5">
              عنوان بريدك الإلكتروني
            </label>
            <input
              id="newsletter-email"
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-left transition-all"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-neutral-500">
              لا رسائل ترويجية أو إزعاج. يمكنك الإلغاء في أي وقت.
            </p>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gray-900 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md text-sm whitespace-nowrap cursor-pointer"
            >
              اشتراك الآن
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
