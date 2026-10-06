'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useArticles } from '@/context/ArticlesContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CategoryIcon } from '@/components/CategoryIcon';
import { ArticleBodyRenderer } from '@/components/ArticleBodyRenderer';
import { countArabicWords, toArabicNumerals } from '@/utils/arabic';
import { optimizeImageFile } from '@/utils/image';
import { Article } from '@/types';
import {
  PenTool,
  List,
  Mail,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  Bold,
  Italic,
  Quote,
  Heading2,
  Sparkles,
  ArrowRight,
  Save,
  Lock,
  LogOut,
  ShieldCheck,
  Check,
  Upload,
  ImageIcon,
  Link2,
  X,
  Loader2
} from 'lucide-react';

const COVER_PRESETS = [
  {
    name: 'سكون الليل والنجوم',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&auto=format&fit=crop&q=80',
  },
  {
    name: 'مكتبة فلسفية وكتب قديمة',
    url: 'https://images.unsplash.com/photo-1507842229451-7f01be837453?w=1600&auto=format&fit=crop&q=80',
  },
  {
    name: 'شمس الصباح وفنجان قهوة',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600&auto=format&fit=crop&q=80',
  },
  {
    name: 'انعكاسات المدينة والزجاج',
    url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1600&auto=format&fit=crop&q=80',
  },
  {
    name: 'أفق الفجر والغيوم الباكرة',
    url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=1600&auto=format&fit=crop&q=80',
  },
  {
    name: 'فضاء رقمي وشبكات المعرفة',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80',
  },
];

export default function AdminPage() {
  const {
    articles,
    categories,
    authors,
    newsletterSubscribers,
    createArticle,
    updateArticle,
    deleteArticle,
    toggleArticlePublish,
  } = useArticles();

  // Authentication State (Admin Only Gate)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    // Check session
    const authStatus = localStorage.getItem('fiker_admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin passcode: admin101 or admin
    if (passcode.trim() === 'admin101' || passcode.trim() === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('fiker_admin_authenticated', 'true');
      setAuthError(false);
      setPasscode('');
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('fiker_admin_authenticated');
  };

  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'newsletter'>('manage');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // Form State - Sole Admin Editor (Yahia Naim)
  const adminAuthor = {
    id: 'author-yahia-naim',
    name: 'يحيى نعيم (الكاتب والمدير العام)',
    avatar: '/profile.jpg',
  };
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug || 'science');
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showInsertImageModal, setShowInsertImageModal] = useState(false);
  const [inTextImageAlt, setInTextImageAlt] = useState('');
  const [inTextImageSrc, setInTextImageSrc] = useState('');
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);
  const inTextFileInputRef = useRef<HTMLInputElement | null>(null);

  // Load user's uploaded photos history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fiker_uploaded_photos');
      if (saved) {
        setUploadedPhotos(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [tagsInput, setTagsInput] = useState('فلسفة, علوم, أدب, تأملات');

  const [showPreview, setShowPreview] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Upload handler for article cover photo
  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const optimized = await optimizeImageFile(file);
      setCoverImage(optimized);
      setUploadedPhotos((prev) => {
        const next = [optimized, ...prev.filter((p) => p !== optimized)].slice(0, 18);
        try {
          localStorage.setItem('fiker_uploaded_photos', JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
      showToast('تم رفع الصورة بنجاح وتعيينها كغلاف');
    } catch (err: any) {
      showToast(err?.message || 'فشل في رفع الصورة');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  // Apply custom URL for article cover photo
  const handleApplyCustomImageUrl = () => {
    if (!customImageUrl.trim()) {
      showToast('يرجى إدخال رابط صورة صحيح');
      return;
    }
    const trimmed = customImageUrl.trim();
    setCoverImage(trimmed);
    setUploadedPhotos((prev) => {
      const next = [trimmed, ...prev.filter((p) => p !== trimmed)].slice(0, 18);
      try {
        localStorage.setItem('fiker_uploaded_photos', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    setCustomImageUrl('');
    showToast('تم تعيين رابط الصورة كغلاف');
  };

  // Delete an uploaded photo from custom library
  const handleDeleteUploadedPhoto = (photoToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedPhotos((prev) => {
      const next = prev.filter((p) => p !== photoToDelete);
      try {
        localStorage.setItem('fiker_uploaded_photos', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    if (coverImage === photoToDelete) {
      setCoverImage(COVER_PRESETS[0].url);
    }
    showToast('تم حذف الصورة من مكتبة صورك المرفوعة');
  };

  // Upload handler for in-text image
  const handleInTextFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const optimized = await optimizeImageFile(file);
      setInTextImageSrc(optimized);
      showToast('تم تجهيز الصورة للإدراج');
    } catch (err: any) {
      showToast(err?.message || 'فشل في قراءة الصورة');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  // Insert image markdown into article body
  const handleInsertImageIntoBody = () => {
    if (!inTextImageSrc.trim()) {
      showToast('يرجى اختيار صورة أو إدخال رابطها أولاً');
      return;
    }
    const altText = inTextImageAlt.trim() || 'صورة المقال';
    const imageMarkdown = `\n\n![${altText}](${inTextImageSrc.trim()})\n\n`;

    const textarea = document.getElementById('article-body-textarea') as HTMLTextAreaElement | null;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newBody = body.substring(0, start) + imageMarkdown + body.substring(end);
      setBody(newBody);
    } else {
      setBody((prev) => prev + imageMarkdown);
    }

    setShowInsertImageModal(false);
    setInTextImageSrc('');
    setInTextImageAlt('');
    showToast('تم إدراج الصورة في نص المقال بنجاح');
  };

  const wordCount = countArabicWords(body);

  const handleInsertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('article-body-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = body.substring(start, end);
    const replacement = `${prefix}${selectedText || 'نص التنسيق'}${suffix}`;

    const newBody = body.substring(0, start) + replacement + body.substring(end);
    setBody(newBody);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText.length || 10));
    }, 50);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      showToast('يرجى ملء العنوان ونص المقال');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingArticleId) {
      updateArticle(editingArticleId, {
        title,
        slug: slug.trim() || undefined,
        excerpt,
        body,
        categorySlug,
        authorId: adminAuthor.id, // Only the single admin editor
        coverImage,
        isPublished,
        isFeatured,
        tags,
      });
      showToast('تم حفظ التعديلات بنجاح');
      setEditingArticleId(null);
      setActiveTab('manage');
    } else {
      createArticle({
        title,
        slug: slug.trim() || undefined,
        excerpt,
        body,
        categorySlug,
        authorId: adminAuthor.id, // Only the single admin editor
        coverImage,
        isPublished,
        isFeatured,
        tags,
      });
      showToast('تم نشر المقال بنجاح عبر حساب المدير');
      setActiveTab('manage');
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setExcerpt('');
    setBody('');
    setEditingArticleId(null);
    setShowPreview(false);
  };

  const startEdit = (article: Article) => {
    setEditingArticleId(article.id);
    setTitle(article.title);
    setSlug(article.slug || '');
    setExcerpt(article.excerpt);
    setBody(article.body);
    setCategorySlug(article.categorySlug);
    setCoverImage(article.coverImage);
    setIsPublished(article.isPublished);
    setIsFeatured(Boolean(article.isFeatured));
    setTagsInput(article.tags?.join(', ') || '');
    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If not authenticated, show the Admin Gate (Not open to public)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-black">
        <Header />
        <main className="flex-1 margin-below-nav flex items-center justify-center p-4">
          <div className="w-full max-w-md border-2 border-[#0a1226] p-8 bg-white shadow-2xl rounded-2xl">
            <div className="flex items-center justify-center w-14 h-14 bg-[#0a1226] text-[#FACC15] mx-auto mb-6 rounded-full border-2 border-[#FACC15]/40 shadow-inner">
              <Lock size={24} />
            </div>

            <h1 className="text-2xl font-bold text-center text-[#0a1226] font-serif mb-2">
              لوحة التحرير والإدارة
            </h1>
            <p className="text-center text-xs text-neutral-600 mb-6">
              هذه اللوحة خاصة بالمشرف العام والمحرر الوحيد للمنصة (يحيى نعيم).
            </p>

            {authError && (
              <div className="p-3 mb-4 bg-red-50 border border-red-500 text-red-700 text-xs font-bold text-center rounded">
                كلمة المرور غير صحيحة، يرجى المحاولة مجدداً.
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0a1226] mb-1.5">
                  كلمة مرور المشرف (Admin Passcode)
                </label>
                <input
                  type="password"
                  dir="ltr"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="أدخل كلمة المرور (الافتراضية: admin101)"
                  required
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 text-black text-center text-sm focus:outline-none focus:border-[#0a1226] font-mono rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0a1226] text-[#FACC15] font-bold text-sm hover:bg-[#111f3f] transition-colors cursor-pointer rounded-lg shadow-sm"
              >
                تسجيل الدخول كمدير
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-neutral-200 text-center">
              <Link href="/" className="text-xs text-neutral-500 hover:text-[#0a1226] font-bold">
                العودة إلى الصفحة الرئيسية للموقع
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />

      <main className="flex-1 margin-below-nav bg-neutral-50 py-10">
        <div className="full-width-limited px-4 sm:px-8 lg:px-12">
          {/* Admin Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b-2 border-[#0a1226]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0a1226] text-[#FACC15] text-[11px] font-bold mb-2 rounded-full border border-[#FACC15]/30">
                <ShieldCheck size={14} />
                <span>حساب الكاتب والمشرف العام (يحيى نعيم)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0a1226] font-serif">
                لوحة تحرير وإدارة منصة فكر وفلسفة
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#0a1226] bg-white hover:bg-neutral-100 text-[#0a1226] text-xs font-bold transition-colors cursor-pointer rounded-lg"
              >
                <LogOut size={14} />
                <span>تسجيل الخروج</span>
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0a1226] text-[#FACC15] text-xs font-bold hover:bg-[#111f3f] transition-colors rounded-lg"
              >
                <span>معاينة الموقع</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mb-8 border-b border-neutral-200">
            <button
              onClick={() => setActiveTab('manage')}
              className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
                activeTab === 'manage'
                  ? 'border-[#0a1226] text-[#0a1226]'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              إدارة المقالات ({articles.length})
            </button>

            <button
              onClick={() => {
                setActiveTab('create');
                if (!editingArticleId) resetForm();
              }}
              className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
                activeTab === 'create'
                  ? 'border-[#0a1226] text-[#0a1226]'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              {editingArticleId ? 'تعديل المقال' : 'كتابة مقال جديد'}
            </button>

            <button
              onClick={() => setActiveTab('newsletter')}
              className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
                activeTab === 'newsletter'
                  ? 'border-[#0a1226] text-[#0a1226]'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              المشتركون ({newsletterSubscribers.length})
            </button>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-6 left-6 z-50 p-4 bg-[#0a1226] text-[#FACC15] text-xs font-bold shadow-2xl flex items-center gap-2 border border-[#FACC15]/40 rounded-lg">
              <CheckCircle size={16} />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* TAB 1: Manage Articles */}
          {activeTab === 'manage' && (
            <div className="bg-white border border-neutral-300">
              <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-black font-serif">
                  جميع المقالات المنشورة والمسودات
                </h2>
                <button
                  onClick={() => {
                    resetForm();
                    setActiveTab('create');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
                >
                  <Plus size={14} />
                  <span>إضافة مقال جديد</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-neutral-100 border-b border-neutral-200 text-xs font-bold text-black">
                    <tr>
                      <th className="p-4">عنوان المقال</th>
                      <th className="p-4">المحطة</th>
                      <th className="p-4">الكلمات</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4">مميز</th>
                      <th className="p-4 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {articles.map((art) => {
                      const cat = categories.find((c) => c.slug === art.categorySlug);
                      return (
                        <tr key={art.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="p-4 font-bold text-black max-w-xs truncate">
                            <Link href={`/articles/${art.slug || art.id}`} className="hover:underline">
                              {art.title}
                            </Link>
                          </td>
                          <td className="p-4 text-xs text-neutral-600">
                            {cat ? `${cat.name} (${cat.timeSlot})` : art.categorySlug}
                          </td>
                          <td className="p-4 text-xs font-mono text-neutral-600">
                            {toArabicNumerals(art.wordCount)} كلمة
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => toggleArticlePublish(art.id)}
                              className={`text-[11px] font-bold px-2.5 py-1 cursor-pointer ${
                                art.isPublished
                                  ? 'bg-neutral-200 text-black'
                                  : 'bg-neutral-100 text-neutral-500'
                              }`}
                            >
                              {art.isPublished ? 'منشور' : 'مسودة'}
                            </button>
                          </td>
                          <td className="p-4">
                            {art.isFeatured ? (
                              <span className="text-[11px] font-bold text-black bg-neutral-200 px-2 py-0.5">
                                مميز
                              </span>
                            ) : (
                              <span className="text-neutral-400 text-xs">-</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => startEdit(art)}
                                className="p-1.5 hover:bg-neutral-200 text-black transition-colors"
                                title="تعديل المقال"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('هل أنت متأكد من رغبتك في حذف هذا المقال نهائياً؟')) {
                                    deleteArticle(art.id);
                                    showToast('تم حذف المقال');
                                  }
                                }}
                                className="p-1.5 hover:bg-red-100 text-red-600 transition-colors"
                                title="حذف المقال"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Create / Edit Article */}
          {activeTab === 'create' && (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Editor Section */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white border border-neutral-300 p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-black mb-1.5">
                      عنوان المقال الفلسفي *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="اكتب عنوان المقال..."
                      required
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 text-black font-bold text-base sm:text-lg focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black mb-1.5">
                      الموجز / التوطئة (Excerpt) *
                    </label>
                    <textarea
                      rows={3}
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="فقرة تمهيدية مكثفة تلخص الفكرة الجوهرية وتظهر في كرت المقال..."
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 text-black text-sm leading-relaxed focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                {/* Body Editor with RTL Markdown Toolbar */}
                <div className="bg-white border border-neutral-300 p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-200">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleInsertMarkdown('**', '**')}
                        className="p-2 border border-neutral-200 hover:bg-neutral-100 text-black"
                        title="عريض (Bold)"
                      >
                        <Bold size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertMarkdown('*', '*')}
                        className="p-2 border border-neutral-200 hover:bg-neutral-100 text-black"
                        title="مائل (Italic)"
                      >
                        <Italic size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertMarkdown('## ')}
                        className="p-2 border border-neutral-200 hover:bg-neutral-100 text-black"
                        title="عنوان فرعي (H2)"
                      >
                        <Heading2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertMarkdown('> ')}
                        className="p-2 border border-neutral-200 hover:bg-neutral-100 text-black"
                        title="اقتباس (Blockquote)"
                      >
                        <Quote size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowInsertImageModal(!showInsertImageModal)}
                        className={`p-2 border text-black flex items-center gap-1 ${
                          showInsertImageModal
                            ? 'bg-black text-white border-black'
                            : 'border-neutral-200 hover:bg-neutral-100'
                        }`}
                        title="إدراج صورة داخل المقال"
                      >
                        <ImageIcon size={14} />
                        <span className="text-[11px] font-bold">صورة</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-neutral-600">
                        {toArabicNumerals(wordCount)} كلمة
                      </span>

                      <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className={`px-3 py-1.5 text-xs font-bold border ${
                          showPreview ? 'bg-black text-white border-black' : 'bg-neutral-100 text-black border-neutral-300'
                        }`}
                      >
                        {showPreview ? 'العودة للمحرر' : 'معاينة القراءة'}
                      </button>
                    </div>
                  </div>

                  {/* Inline Image Inserter Modal/Panel */}
                  {showInsertImageModal && (
                    <div className="p-4 bg-neutral-100 border border-neutral-300 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-black flex items-center gap-1.5">
                          <ImageIcon size={14} />
                          إدراج صورة داخل نص المقال
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowInsertImageModal(false)}
                          className="text-neutral-500 hover:text-black p-1"
                        >
                          <X size={15} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Option 1: File from device */}
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                            رفع صورة من الجهاز:
                          </label>
                          <button
                            type="button"
                            onClick={() => inTextFileInputRef.current?.click()}
                            disabled={isUploading}
                            className="w-full py-2 px-3 border border-dashed border-neutral-400 hover:border-black bg-white flex items-center justify-center gap-1.5 text-xs text-black font-medium transition-colors"
                          >
                            <Upload size={13} />
                            <span>{isUploading ? 'جارٍ المعالجة...' : 'اختر ملف صورة من جهازك'}</span>
                          </button>
                          <input
                            type="file"
                            ref={inTextFileInputRef}
                            accept="image/*"
                            onChange={handleInTextFileUpload}
                            className="hidden"
                          />
                        </div>

                        {/* Option 2: Image URL */}
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                            أو رابط صورة مباشر:
                          </label>
                          <input
                            type="url"
                            placeholder="https://... رابط الصورة"
                            value={inTextImageSrc}
                            onChange={(e) => setInTextImageSrc(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-neutral-300 bg-white text-black focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>

                      {/* Preview & Caption */}
                      {inTextImageSrc && (
                        <div className="flex items-center gap-3 p-2 bg-white border border-neutral-200">
                          <img
                            src={inTextImageSrc}
                            alt="معاينة"
                            className="w-16 h-12 object-cover border border-neutral-200"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="تعليق أو وصف توضيحي أسفل الصورة (اختياري)..."
                              value={inTextImageAlt}
                              onChange={(e) => setInTextImageAlt(e.target.value)}
                              className="w-full px-2.5 py-1 text-xs border border-neutral-200 text-black focus:outline-none focus:border-black"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowInsertImageModal(false);
                            setInTextImageSrc('');
                            setInTextImageAlt('');
                          }}
                          className="px-3 py-1.5 text-xs text-neutral-600 hover:text-black"
                        >
                          إلغاء
                        </button>
                        <button
                          type="button"
                          onClick={handleInsertImageIntoBody}
                          disabled={!inTextImageSrc}
                          className="px-4 py-1.5 bg-black hover:bg-neutral-800 disabled:opacity-40 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          إدراج الصورة في النص الآن
                        </button>
                      </div>
                    </div>
                  )}

                  {showPreview ? (
                    <div className="p-6 bg-neutral-50 border border-neutral-200 min-h-[350px]">
                      <ArticleBodyRenderer content={body || 'لا يوجد نص للمعاينة بعد...'} />
                    </div>
                  ) : (
                    <textarea
                      id="article-body-textarea"
                      rows={16}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="اكتب المقال كاملاً هنا باللغة العربية..."
                      required
                      className="w-full px-5 py-4 bg-neutral-50 border border-neutral-300 text-black text-base leading-loose focus:outline-none focus:border-black font-normal"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-black text-xs font-bold"
                  >
                    إعادة ضبط الحقول
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-3 bg-black hover:bg-neutral-800 text-white font-bold text-sm cursor-pointer"
                  >
                    <Save size={16} />
                    <span>{editingArticleId ? 'حفظ التعديلات' : 'نشر المقال كمدير'}</span>
                  </button>
                </div>
              </div>

              {/* Sidebar Column */}
              <div className="lg:col-span-4 space-y-6">
                {/* Fixed Single Editor Badge */}
                <div className="bg-white border border-neutral-300 p-5 space-y-3">
                  <span className="text-xs font-bold text-black uppercase tracking-wider block">
                    المحرر المسؤول
                  </span>
                  <div className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-200">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                      مدير
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-black">{adminAuthor.name}</span>
                      <span className="block text-[11px] text-neutral-500">حساب المشرف والمحرر الوحيد</span>
                    </div>
                  </div>
                </div>

                {/* Category Selection */}
                <div className="bg-white border border-neutral-300 p-5 space-y-3">
                  <span className="text-xs font-bold text-black uppercase tracking-wider block">
                    محطة توقيت المقال
                  </span>
                  <div className="space-y-1.5">
                    {categories.map((cat) => {
                      const isSelected = categorySlug === cat.slug;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategorySlug(cat.slug)}
                          className={`w-full flex items-center justify-between p-2.5 border text-right transition-all cursor-pointer ${
                            isSelected
                              ? 'border-black bg-black text-white font-bold'
                              : 'border-neutral-200 bg-white text-black hover:bg-neutral-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <CategoryIcon name={cat.iconName} size={14} />
                            <span className="text-xs">{cat.name}</span>
                          </div>
                          <span className="text-[11px] opacity-75">{cat.timeSlot}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Publish and Feature Toggles */}
                <div className="bg-white border border-neutral-300 p-5 space-y-3">
                  <span className="text-xs font-bold text-black uppercase tracking-wider block">
                    حالة النشر والظهور
                  </span>
                  <label className="flex items-center justify-between p-2.5 bg-neutral-50 border border-neutral-200 cursor-pointer">
                    <span className="text-xs font-bold text-black">نشر للعامة</span>
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-4 h-4 accent-black"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2.5 bg-neutral-50 border border-neutral-200 cursor-pointer">
                    <span className="text-xs font-bold text-black">مقال مميز في الواجهة</span>
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 accent-black"
                    />
                  </label>
                </div>

                {/* Comprehensive Cover Image Manager */}
                <div className="bg-white border border-neutral-300 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-black uppercase tracking-wider block">
                      صورة غلاف المقال
                    </span>
                    {isUploading && (
                      <span className="text-[11px] text-neutral-600 flex items-center gap-1 font-medium">
                        <Loader2 size={12} className="animate-spin" />
                        جارٍ المعالجة...
                      </span>
                    )}
                  </div>

                  {/* Active Cover Preview */}
                  <div className="space-y-2">
                    <div className="relative w-full aspect-[16/9] border border-neutral-300 bg-neutral-900 overflow-hidden group">
                      <Image
                        src={coverImage}
                        alt="غلاف المقال الحالي"
                        fill
                        className="object-cover"
                        unoptimized={coverImage.startsWith('data:')}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                        <span className="text-[11px] font-bold text-white bg-black/80 px-2.5 py-1">
                          الصورة المعتمدة حالياً للغلاف
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-500">
                      <span>
                        {coverImage.startsWith('data:') ? 'صورة مخصصة مرفوعة من الجهاز' : 'رابط أو نموذج مختار'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCoverImage(COVER_PRESETS[0].url)}
                        className="text-neutral-500 hover:text-black underline cursor-pointer"
                      >
                        الافتراضي
                      </button>
                    </div>
                  </div>

                  {/* Option 1: Upload from Device */}
                  <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                    <span className="text-[11px] font-bold text-black block">
                      1. إضافة صورة جديدة من جهازك:
                    </span>
                    <button
                      type="button"
                      onClick={() => coverFileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full py-2.5 px-3 border-2 border-dashed border-neutral-400 hover:border-black bg-neutral-50 hover:bg-neutral-100 flex items-center justify-center gap-2 text-xs font-bold text-black transition-all cursor-pointer"
                    >
                      <Upload size={14} />
                      <span>{isUploading ? 'جارٍ المعالجة والرفع...' : 'رفع صورة من الكمبيوتر أو الهاتف'}</span>
                    </button>
                    <input
                      type="file"
                      ref={coverFileInputRef}
                      accept="image/*"
                      onChange={handleCoverFileUpload}
                      className="hidden"
                    />
                    <span className="text-[10px] text-neutral-400 block text-right">
                      يدعم PNG, JPG, WebP - يتم ضغطها وتحسين دقتها تلقائياً
                    </span>
                  </div>

                  {/* Option 2: Custom URL */}
                  <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                    <span className="text-[11px] font-bold text-black block">
                      2. أو إدخال رابط صورة خارجي:
                    </span>
                    <div className="flex gap-1.5">
                      <input
                        type="url"
                        placeholder="https://... رابط الصورة"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 text-xs border border-neutral-300 bg-neutral-50 text-black focus:outline-none focus:border-black"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCustomImageUrl}
                        className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        تطبيق
                      </button>
                    </div>
                  </div>

                  {/* Uploaded Photos Library (if any) */}
                  {uploadedPhotos.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                      <span className="text-[11px] font-bold text-black block">
                        صورك المرفوعة ({uploadedPhotos.length}):
                      </span>
                      <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-1 bg-neutral-50 border border-neutral-200">
                        {uploadedPhotos.map((photo, idx) => {
                          const isSelected = coverImage === photo;
                          return (
                            <div
                              key={idx}
                              onClick={() => setCoverImage(photo)}
                              className={`group relative aspect-square border overflow-hidden cursor-pointer ${
                                isSelected ? 'ring-2 ring-black' : 'border-neutral-200 hover:opacity-90'
                              }`}
                            >
                              <img src={photo} alt={`مرفوعة ${idx + 1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={(e) => handleDeleteUploadedPhoto(photo, e)}
                                title="حذف من مكتبتي"
                                className="absolute top-0.5 right-0.5 p-0.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Option 3: Presets Gallery */}
                  <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                    <span className="text-[11px] font-bold text-neutral-600 block">
                      3. أو اختيار نموذج جاهز:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {COVER_PRESETS.map((preset, idx) => {
                        const isSelected = coverImage === preset.url;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCoverImage(preset.url)}
                            title={preset.name}
                            className={`relative aspect-square border overflow-hidden transition-all cursor-pointer ${
                              isSelected ? 'ring-2 ring-black' : 'border-neutral-200 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <Image src={preset.url} alt={preset.name} fill className="object-cover" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: Subscribers */}
          {activeTab === 'newsletter' && (
            <div className="bg-white border border-neutral-300 p-6">
              <h2 className="text-lg font-bold text-black font-serif mb-4">
                المشتركون في النشرة البريدية ({newsletterSubscribers.length})
              </h2>
              {newsletterSubscribers.length === 0 ? (
                <p className="text-xs text-neutral-500">لا يوجد مشتركون حالياً.</p>
              ) : (
                <div className="divide-y divide-neutral-200 border border-neutral-200">
                  {newsletterSubscribers.map((sub) => (
                    <div key={sub.id} className="p-3 flex items-center justify-between text-xs">
                      <span className="font-mono text-black font-bold">{sub.email}</span>
                      <span className="text-neutral-500">{sub.subscribedAt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
