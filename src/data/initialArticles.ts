import { Article } from '@/types';
import { countArabicWords, calculateReadingTime } from '@/utils/arabic';
import homeData from './homeData101n.json';

const rawArticles = [
  {
    id: 'art-solitude-in-hyperconnected-world',
    slug: 'solitude-in-hyperconnected-world',
    title: 'في مديح العزلة',
    excerpt: 'العزلة ليست انقطاعاً عن العالم، بل هي الشرط الأول لكي لا نذوب في قطيع الآراء الجاهزة. حين نسكت الضجيج الخارجي، نكتشف هول ما كنا نهرب منه: أنفسنا.',
    categorySlug: 'philosophy',
    authorId: 'author-yahia-naim',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&auto=format&fit=crop&q=80',
    publishDate: '٢٤ سبتمبر ٢٠٢٦',
    isoDate: '2026-09-24',
    isFeatured: true,
    isPublished: true,
    tags: ['عزلة', 'وجودية', 'فلسفة_الذات', 'فلسفة'],
    views: 1420,
    likes: 218,
    body: `
في كل يوم، نُلقى في نهرٍ جارف من الإشعارات والكلمات والآراء التي لا تخصنا. يبدو العالم الحديث كأنه تواطأ على مصادرة اللحظة الوحيدة التي يمكن للإنسان فيها أن ينفرد بوعيه دون وصاية.

كتب **نيتشه** ذات مرة: *"في العزلة يلتهم المرء نفسه، وفي الحشد يلتهمه الجمع. فاختر الآن ما يناسبك!"*. تبدو هذه العبارة اليوم أكثر إلحاحاً من أي وقت مضى؛ فنحن نعيش في حضارة تعتبر الصمت عطلاً فنياً، والجلوس بلا هاتف شكلاً من أشكال الفراغ المريب.

### الخوف من الفراغ الداخلي
لماذا نخاف العزلة إلى هذا الحد؟ لعل الجواب الأكثر صدقاً هو أن العزلة مرآة لا ترحم. في حضور الآخرين، نرتدي الأقنعة الاجتماعية المريحة؛ نبتسم عند الطلب، ونتحدث بالعبارات المتفق عليها، وننسى مؤقتاً الأسئلة المؤجلة. ولكن ما إن يُغلق الباب ويهدأ صخب النهار، حتى تنبعث الأسئلة العتيقة:
- *من أنا حين لا يراني أحد؟*
- *هل ما أسعى إليه هو رغبتي الحقيقية أم انعكاس لتوقعات من حولي؟*
- *ما الذي يتبقى من أفكاري إذا استثنيت ما قرأته قبل قليل في وسائل التواصل؟*

> "العزلة ليست فراغاً، بل هي امتلاء بالذات؛ هي المحراب الذي يتطهر فيه الوعي من غبار الاستهلاك الفكري اليومي."

### استعادة المسافة الجمالية
إن الفلسفة في جوهرها ليست حفظاً لأقوال القدماء، بل هي **تمرين يومي على اتخاذ مسافة**. المسافة تتيح لك أن ترى المشهد كاملاً، لا أن تكون غارقاً في تفاصيله الضيقة. حين تختلي بنفسك لنصف ساعة مع فنجان شاي ودفتر أبيض، أنت لا تهرب من الحياة، بل تحمي نسغها الأصيل من التبخر.

العزلة الواعية تمنحنا مناعة ضد الخوف من فوات الأشياء (FOMO)، وتعلّمنا أن القيمة الحقيقية لا تُقاس بعدد المشاهدات أو سرعة التفاعل، بل بعمق الفكرة ورسوخ السكينة في القلب.

فلنحتفِ إذن بتلك الساعات الهادئة، حين ينام الجميع، وتبدأ الحكاية الأهم: حوارك الصادق مع روحك.
    `.trim(),
  },
  {
    id: 'art-productivity-trap',
    slug: 'productivity-trap',
    title: 'فخ الإنتاجية المستمرة',
    excerpt: 'تحول الإنسان المعاصر إلى آلة تقيس قيمتها بمعدل الإنجاز اليومي. متى نكف عن تحويل كل دقيقة من حياتنا إلى مشروع استثماري ينتظر عائداً؟',
    categorySlug: 'thoughts',
    authorId: 'author-yahia-naim',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600&auto=format&fit=crop&q=80',
    publishDate: '٢٢ سبتمبر ٢٠٢٦',
    isoDate: '2026-09-22',
    isFeatured: true,
    isPublished: true,
    tags: ['إنتاجية', 'سيكولوجيا', 'خواطر', 'الحداثة'],
    views: 980,
    likes: 165,
    body: `
نستيقظ في الصباح الباكر ونحن محملون بقوائم مهام لا تنتهي. حتى هواياتنا البسيطة كالقراءة أو المشي أو إعداد القهوة، صرنا نحاول تحسينها وقياس فعاليتها بتطبيقات رقمية تراقب نبضات قلوبنا وتعد خطواتنا.

لقد زرع النظام المعاصر في أذهاننا إحساساً دفيناً بالذنب إذا ما جلسنا شاردين لعشر دقائق دون "إنتاج شيء ملموس".

### أسطورة الكفاءة المطلقة
يخبرنا الفيلسوف الكوري-الألماني **بيونغ-تشول هان** في كتابه *"مجتمع الإرهاق"* أن مجتمع الانضباط القديم الذي كان يحكمه المنع قد استُبدل بمجتمع الإنجاز الذي يحكمه شعار: "نعم، نحن نستطيع!".

في هذا المجتمع الجديد، لا يحتاج المرء إلى جلاد خارجي؛ فالإنسان المعاصر يستغل نفسه طواعية تحت وهم الحرية وتحقيق الذات.

> "حين تتحول الراحة إلى وسيلة لاستعادة النشاط من أجل مزيد من العمل، فإن الراحة تفقد معناها وتصبح جزءاً من خط الإنتاج."

الحل ليس في التكاسل، بل في استعادة **الحق في اللا-فعل**. أن تجلس في شرفتك وتراقب حركة السحاب دون أن تكتب تغريدة أو تسجل ملاحظة أو تلتقط صورة، ذلك هو التمرد الوجودي الحقيقي في عصر الرأسمالية الرقمية.
    `.trim(),
  },
  {
    id: 'art-limits-of-language',
    slug: 'limits-of-language',
    title: 'ما لا يمكن قوله: حدود اللغة وأفق المعنى',
    excerpt: 'هل تعبر الكلمات عما نشعر به حقاً أم أنها تسجن مشاعرنا في قوالب ضيقة؟ رحلة مع فتغنشتاين والمتصوفة حول الصمت حين يعجز التعبير.',
    categorySlug: 'literature',
    authorId: 'author-yahia-naim',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1600&auto=format&fit=crop&q=80',
    publishDate: '١٨ سبتمبر ٢٠٢٦',
    isoDate: '2026-09-18',
    isFeatured: false,
    isPublished: true,
    tags: ['لغة', 'فلسفة_اللغة', 'أدب', 'تأمل'],
    views: 1120,
    likes: 190,
    body: `
كم مرة شعرت بامتلاء داخلي عاصف، وحين فتحت فمك لتتكلم خرجت كلمات شاحبة باردة لا تشبه ما كان يغلي في صدرك؟

هذا العجز ليس نقصاً في معجمك اللغوي، بل هو قانون الوجود الإنساني: **المعنى أوسع من المبنى دائماً**.

قال **لودفيغ فتغنشتاين** خاتماً رسالته المنطقية الفلسفية: *"ما لا يمكن للمرء أن يتحدث عنه بوضوح، ينبغي عليه أن يصمت عنه"*. لكن هذا الصمت عند فتغنشتاين ليس عدماً، بل هو اعتراف بوجود ما هو صوفي ومتعالٍ على التراكيب النحوية.
    `.trim(),
  },
];

const homeArticlesList: Article[] = [];
const seenSlugs = new Set<string>();

const addHomeItem = (item: any, defaultCat: string) => {
  if (!item || !item.title) return;
  const slug = item.slug || String(item.id);
  if (seenSlugs.has(slug)) return;
  seenSlugs.add(slug);

  const wordCount = item.words || countArabicWords(item.brief || '');
  const readingTimeMinutes = calculateReadingTime(wordCount);

  homeArticlesList.push({
    id: String(item.id),
    slug: slug,
    title: item.title,
    excerpt: item.brief || '',
    body: item.brief || '',
    coverImage: item.cover || '',
    authorId: 'author-yahia-naim',
    categorySlug: item.categorySlug || defaultCat,
    wordCount,
    publishDate: '٢٨ سبتمبر ٢٠٢٦',
    isoDate: '2026-09-28',
    readingTimeMinutes,
    isPublished: true,
    isFeatured: true,
    tags: [item.categoryName || 'فكر وفلسفة'],
    views: 520,
    likes: 95,
  });
};

if (homeData.topTeaser) {
  addHomeItem(homeData.topTeaser, 'philosophy');
}

homeData.sections.forEach((s: any) => {
  if (s.banner) addHomeItem(s.banner, s.categorySlug);
  if (Array.isArray(s.posts)) {
    s.posts.forEach((p: any) => addHomeItem(p, s.categorySlug));
  }
});

export const initialArticles: Article[] = [
  ...homeArticlesList,
  ...rawArticles.map((art) => {
    const wordCount = countArabicWords(art.body + ' ' + art.excerpt);
    const readingTimeMinutes = calculateReadingTime(wordCount);
    return {
      ...art,
      wordCount,
      readingTimeMinutes,
    };
  }),
];
