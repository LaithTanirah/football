import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Arabic text normalization utility
export function normalizeArabic(text: string): string {
  if (!text) return '';
  
  // Normalize common Arabic characters
  return text
    .replace(/[أإآ]/g, 'ا') // Normalize Alef variations
    .replace(/[ى]/g, 'ي') // Normalize Yeh variations
    .replace(/[ة]/g, 'ه') // Normalize Teh Marbuta
    .replace(/[ؤ]/g, 'و') // Normalize Waw with Hamza
    .replace(/[ئ]/g, 'ي') // Normalize Yeh with Hamza
    .trim();
}

// Safe translation helper - ensures translation keys never appear in UI
export function safeTranslate(
  t: (key: string) => string,
  key: string,
  fallback?: string
): string {
  const value = t(key);
  // If translation returns the key itself (missing translation), use fallback or key
  if (value === key) {
    if (fallback) return fallback;
    // In development, log missing translations
    if (import.meta.env.DEV) {
      console.warn(`Missing translation for key: ${key}`);
    }
    return key;
  }
  return value;
}

