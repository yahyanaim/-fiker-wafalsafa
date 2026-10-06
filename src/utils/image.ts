/**
 * Helper to compress and convert image files to optimized Base64 data URLs.
 * Keeps aspect ratio, constrains max dimensions, and optimizes quality to ensure
 * lightweight storage without perceptible loss of sharpness.
 */
export async function optimizeImageFile(
  file: File,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If not an image file, reject
    if (!file.type.startsWith('image/')) {
      reject(new Error('الملف المختار ليس صورة صالحة'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result !== 'string') {
        reject(new Error('فشل في قراءة بيانات الصورة'));
        return;
      }

      // If SVG, return as is
      if (file.type === 'image/svg+xml') {
        resolve(result);
        return;
      }

      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Resize proportionally if exceeding max dimensions
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Export as webp or jpeg
        try {
          const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const optimizedDataUrl = canvas.toDataURL(mimeType, quality);
          resolve(optimizedDataUrl);
        } catch {
          resolve(result);
        }
      };

      img.onerror = () => {
        // Fallback to original data URL if image parsing fails
        resolve(result);
      };

      img.src = result;
    };

    reader.onerror = () => {
      reject(new Error('حدث خطأ أثناء قراءة الملف من الجهاز'));
    };

    reader.readAsDataURL(file);
  });
}
