/**
 * Canvas input validation and security utilities
 */

const MAX_TEXT_LENGTH = 10000;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** Strip all HTML/script tags from text */
export function sanitizeText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .slice(0, MAX_TEXT_LENGTH);
}

/** Validate an image file for type and size */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: `صيغة الصورة غير مدعومة. الصيغ المقبولة: JPG, PNG, WebP` };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, error: `حجم الصورة يتجاوز الحد الأقصى (5MB)` };
  }
  return { valid: true };
}

/** Clamp a number within a range */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Format seconds to MM:SS */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
