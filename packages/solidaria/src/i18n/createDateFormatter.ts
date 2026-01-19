/**
 * createDateFormatter hook for solidaria
 *
 * Provides localized date formatting with caching.
 *
 * Port of @react-aria/i18n useDateFormatter.
 */

import { createMemo } from 'solid-js';
import { useLocale } from './locale';
import { createCacheKey } from './utils';

// ============================================
// CACHE
// ============================================

const dateFormatterCache = new Map<string, Intl.DateTimeFormat>();

/**
 * Gets or creates a cached date formatter.
 */
function getCachedDateFormatter(
  locale: string,
  options?: Intl.DateTimeFormatOptions
): Intl.DateTimeFormat {
  const cacheKey = createCacheKey(locale, options as Record<string, unknown>);

  if (dateFormatterCache.has(cacheKey)) {
    return dateFormatterCache.get(cacheKey)!;
  }

  const formatter = new Intl.DateTimeFormat(locale, options);
  dateFormatterCache.set(cacheKey, formatter);
  return formatter;
}

// ============================================
// HOOK
// ============================================

/**
 * Provides localized date and time formatting for the current locale.
 * Automatically updates when the locale changes.
 *
 * @example
 * ```tsx
 * function DateDisplay(props: { date: Date }) {
 *   const formatter = createDateFormatter({
 *     year: 'numeric',
 *     month: 'long',
 *     day: 'numeric',
 *   });
 *
 *   return <span>{formatter().format(props.date)}</span>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Short date
 * const shortDate = createDateFormatter({ dateStyle: 'short' });
 * shortDate().format(new Date()); // '1/19/26' (US) or '19/01/26' (UK)
 *
 * // Full date with time
 * const fullDateTime = createDateFormatter({
 *   dateStyle: 'full',
 *   timeStyle: 'short',
 * });
 *
 * // Time only
 * const timeFormatter = createDateFormatter({
 *   hour: 'numeric',
 *   minute: '2-digit',
 * });
 * ```
 */
export function createDateFormatter(
  options?: Intl.DateTimeFormatOptions
): () => Intl.DateTimeFormat {
  const locale = useLocale();

  return createMemo(() => getCachedDateFormatter(locale().locale, options));
}
