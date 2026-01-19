/**
 * createNumberFormatter hook for solidaria
 *
 * Provides localized number formatting with automatic locale updates.
 *
 * Port of @react-aria/i18n useNumberFormatter.
 */

import { createMemo } from 'solid-js';
import { useLocale } from './locale';
import { NumberFormatter, type NumberFormatOptions } from './NumberFormatter';

/**
 * Provides localized number formatting for the current locale.
 * Automatically updates when the locale changes.
 *
 * @example
 * ```tsx
 * function PriceDisplay(props: { value: number }) {
 *   const formatter = createNumberFormatter({
 *     style: 'currency',
 *     currency: 'USD',
 *   });
 *
 *   return <span>{formatter().format(props.value)}</span>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Percent formatting
 * const percentFormatter = createNumberFormatter({
 *   style: 'percent',
 *   minimumFractionDigits: 1,
 * });
 * percentFormatter().format(0.125); // '12.5%'
 *
 * // Unit formatting
 * const tempFormatter = createNumberFormatter({
 *   style: 'unit',
 *   unit: 'celsius',
 * });
 * tempFormatter().format(25); // '25°C'
 * ```
 */
export function createNumberFormatter(
  options: NumberFormatOptions = {}
): () => NumberFormatter {
  const locale = useLocale();

  return createMemo(() => new NumberFormatter(locale().locale, options));
}
