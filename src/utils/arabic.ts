/**
 * Converts a standard integer to Eastern Arabic numerals (١، ٢، ٣...)
 */
export function toArabicNumerals(num: number | string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num
    .toString()
    .replace(/[0-9]/g, (digit) => arabicDigits[parseInt(digit, 10)]);
}

/**
 * Counts words in an Arabic text accurately by stripping HTML/Markdown tags and extra spaces
 */
export function countArabicWords(text: string): number {
  if (!text) return 0;
  // Strip HTML tags
  const clean = text
    .replace(/<[^>]*>/g, ' ')
    // Strip markdown formatting symbols
    .replace(/[#*`_~>[\]()]/g, ' ')
    .trim();

  const words = clean.split(/\s+/).filter((w) => w.length > 0);
  return words.length;
}

/**
 * Formats word count in 101n style: e.g. "٣٠٩ كلمة"
 */
export function formatWordCountBadge(wordCount: number): string {
  return `${toArabicNumerals(wordCount)} كلمة`;
}

/**
 * Calculates estimated reading time in minutes
 */
export function calculateReadingTime(wordCount: number): number {
  // Average Arabic reading speed ~150 words per minute for essay-style contemplation
  return Math.max(1, Math.ceil(wordCount / 150));
}

/**
 * Formats reading time in Arabic: e.g. "٣ دقائق قراءة"
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) return 'دقيقة واحدة قراءة';
  if (minutes === 2) return 'دقيقتان قراءة';
  if (minutes >= 3 && minutes <= 10) return `${toArabicNumerals(minutes)} دقائق قراءة`;
  return `${toArabicNumerals(minutes)} دقيقة قراءة`;
}
