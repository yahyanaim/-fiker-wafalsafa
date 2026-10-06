import { Author } from '@/types';

export const authors: Author[] = [
  {
    id: 'author-yahia-naim',
    slug: 'yahia-naim',
    name: 'يحيى نعيم',
    title: 'الكاتب والمدير العام - فكر وفلسفة',
    bio: 'مؤسس ورئيس تحرير منصة فكر وفلسفة. باحث ومفكر متفرغ في تقاطعات الفلسفة، وتاريخ الأفكار، والعلوم الإنسانية، والأدب المعاصر.',
    avatar: '/authors/yahia-naim.jpg',
    location: 'فكر وفلسفة',
    articlesCount: 61,
    twitter: 'https://x.com/yahia_naim',
    instagram: 'https://instagram.com/yahia_naim',
    facebook: 'https://facebook.com/yahia.naim',
    linkedin: 'https://linkedin.com/in/yahyanaim',
    github: 'https://github.com/yahyanaim',
    email: 'mailto:yahyanaim2001@gmail.com',
  },
];

export const getAuthorById = (id: string): Author | undefined => {
  return authors[0];
};

export const getAuthorBySlug = (slug: string): Author | undefined => {
  return authors[0];
};
