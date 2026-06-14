// ============================================
// Promoo Backend — General Utilities / Helpers
// ============================================

import { Request } from 'express';
import { env } from '../config/env';
import { Language } from '../types/enums';

/**
 * Extract the preferred language from the Accept-Language header.
 * Defaults to the configured DEFAULT_LANGUAGE.
 */
export function getLanguage(req: Request): Language {
  const acceptLanguage = req.headers['accept-language'] || '';
  if (acceptLanguage.includes('ar')) return Language.Arabic;
  if (acceptLanguage.includes('en')) return Language.English;
  return env.DEFAULT_LANGUAGE as Language;
}

/**
 * Pick the localized field based on language.
 * Example: pickLocalized({ name_ar: 'عرض', name_en: 'Offer' }, 'name', 'en') → 'Offer'
 */
export function pickLocalized<T extends Record<string, unknown>>(
  obj: T,
  fieldBase: string,
  lang: Language
): string {
  const key = `${fieldBase}_${lang}` as keyof T;
  const fallbackKey = `${fieldBase}_en` as keyof T;
  return (obj[key] as string) || (obj[fallbackKey] as string) || '';
}

/**
 * Parse pagination query params with defaults and limits.
 */
export function parsePagination(query: { page?: string; limit?: string }): {
  page: number;
  limit: number;
  offset: number;
} {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(
    env.MAX_PAGE_SIZE,
    Math.max(1, parseInt(query.limit || String(env.DEFAULT_PAGE_SIZE), 10))
  );
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

/**
 * Generate a URL-safe slug from a string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Remove undefined/null keys from an object (shallow).
 * Useful before passing update objects to Supabase.
 */
export function cleanObject<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)
  ) as Partial<T>;
}
