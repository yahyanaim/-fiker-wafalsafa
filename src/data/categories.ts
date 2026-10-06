import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'cat-science',
    slug: 'science',
    name: 'علوم',
    timeSlot: 'فلسفة العلم والاكتشاف',
    slotHour: 'علوم',
    iconName: 'science',
    color: '#38BDF8', // Cyan / Sky Blue
    accentBg: 'rgba(56, 189, 248, 0.12)',
    borderAccent: 'rgba(56, 189, 248, 0.4)',
    description: 'استكشاف آفاق المعرفة الطبيعية والكونية، والمنهج العلمي، وثورة العقل.',
  },
  {
    id: 'cat-philosophy',
    slug: 'philosophy',
    name: 'فلسفة',
    timeSlot: 'الفلسفة والوجود',
    slotHour: 'فلسفة',
    iconName: 'philosophy',
    color: '#FACC15', // Yellow / Gold
    accentBg: 'rgba(250, 204, 21, 0.12)',
    borderAccent: 'rgba(250, 204, 21, 0.4)',
    description: 'تأملات في الوجود والمعرفة والأخلاق، ومساءلة البديهيات الفكرية العميقة.',
  },
  {
    id: 'cat-literature',
    slug: 'literature',
    name: 'أدب',
    timeSlot: 'الأدب والجماليات',
    slotHour: 'أدب',
    iconName: 'literature',
    color: '#FB923C', // Amber
    accentBg: 'rgba(251, 146, 60, 0.12)',
    borderAccent: 'rgba(251, 146, 60, 0.4)',
    description: 'قراءات نقدية، نصوص روائية، وشعرية تلامس الوجدان وتخلد التجربة الإنسانية.',
  },
  {
    id: 'cat-thoughts',
    slug: 'thoughts',
    name: 'خواطر وسينما',
    timeSlot: 'خواطر وسينما',
    slotHour: 'خواطر وسينما',
    iconName: 'cinema',
    color: '#A855F7', // Purple
    accentBg: 'rgba(168, 85, 247, 0.12)',
    borderAccent: 'rgba(168, 85, 247, 0.4)',
    description: 'شذرات فكرية وشخصية، نقد وتأملات سينمائية بصرية، ويقظة الوعي اليومي.',
  },
  {
    id: 'cat-opinion',
    slug: 'opinion',
    name: 'رأي',
    timeSlot: 'مقالات الرأي والموقف',
    slotHour: 'رأي',
    iconName: 'opinion',
    color: '#F43F5E', // Rose
    accentBg: 'rgba(244, 63, 94, 0.12)',
    borderAccent: 'rgba(244, 63, 94, 0.4)',
    description: 'قراءات تحليلية في قضايا العصر، ونقد ثقافي، ومواقف حرة في مهب التساؤل.',
  },
  {
    id: 'cat-religion',
    slug: 'religion',
    name: 'دين',
    timeSlot: 'فلسفة الدين والإيمان',
    slotHour: 'دين',
    iconName: 'religion',
    color: '#10B981', // Emerald
    accentBg: 'rgba(168, 85, 247, 0.12)',
    borderAccent: 'rgba(16, 185, 129, 0.4)',
    description: 'فلسفة الأديان، والتجربة الروحية، والأسئلة الكبرى حول المعنى والتسامي.',
  },
];

export const getCategoryBySlug = (slug: string): Category | undefined => {
  if (!slug) return undefined;
  const clean = slug.trim().toLowerCase().replace(/-/g, '');
  return categories.find(
    (c) =>
      c.slug === slug ||
      c.id === slug ||
      c.slug.replace(/-/g, '') === clean ||
      c.name === slug ||
      ((clean.includes('cinema') || clean.includes('سينما')) && c.slug === 'thoughts') ||
      ((clean.includes('thought') || clean.includes('خواطر')) && c.slug === 'thoughts')
  );
};
