import type { Metadata } from 'next';
import './globals.css';
import { ArticlesProvider } from '@/context/ArticlesContext';

export const metadata: Metadata = {
  title: 'فكر وفلسفة | منصة المقالات والتأملات الفكرية',
  description: 'منصة عربية للمقالات الشخصية والتأملات الفلسفية المستوحاة من أوقات اليوم وأسئلة الوجود والوعي.',
  keywords: ['فلسفة', 'مقالات', 'تأملات', 'فكر', 'عزلة', 'وجودية', 'فكر وفلسفة'],
  authors: [{ name: 'يحيى نعيم' }],
  openGraph: {
    title: 'فكر وفلسفة | يحيى نعيم',
    description: 'منصة عربية للمقالات الفلسفية، والعلوم، والأدب، والتأملات الفكرية بقلم يحيى نعيم.',
    type: 'website',
    locale: 'ar_SA',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-white text-black selection:bg-[#FACC15] selection:text-[#0a1226] antialiased" suppressHydrationWarning>
        <ArticlesProvider>
          {children}
        </ArticlesProvider>
      </body>
    </html>
  );
}
