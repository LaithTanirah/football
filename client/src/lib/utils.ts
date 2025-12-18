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

