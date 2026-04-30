/**
 * String formatter for localized strings with ICU MessageFormat support.
 * Port of @react-aria/i18n useLocalizedStringFormatter.
 */

import {
  LocalizedString,
  LocalizedStringDictionary,
  LocalizedStringFormatter,
  type LocalizedStrings,
} from "@internationalized/string";
import { createMemo, type Accessor } from "solid-js";
import { useLocale } from "./locale";

// Cache for dictionaries to avoid recreating them
const cache = new WeakMap<
  LocalizedStrings<string, LocalizedString>,
  LocalizedStringDictionary<string, LocalizedString>
>();

function getCachedDictionary<K extends string, T extends LocalizedString>(
  strings: LocalizedStrings<K, T>,
): LocalizedStringDictionary<K, T> {
  let dictionary = cache.get(strings as LocalizedStrings<string, LocalizedString>);
  if (!dictionary) {
    dictionary = new LocalizedStringDictionary(
      strings as LocalizedStrings<string, LocalizedString>,
    );
    cache.set(strings as LocalizedStrings<string, LocalizedString>, dictionary);
  }
  return dictionary as LocalizedStringDictionary<K, T>;
}

/**
 * Returns a cached LocalizedStringDictionary for the given strings.
 */
export function createStringDictionary<
  K extends string = string,
  T extends LocalizedString = string,
>(strings: LocalizedStrings<K, T>, packageName?: string): LocalizedStringDictionary<K, T> {
  return (
    (packageName && LocalizedStringDictionary.getGlobalDictionaryForPackage(packageName)) ||
    getCachedDictionary(strings)
  );
}

/**
 * Provides localized string formatting for the current locale.
 * Supports interpolating variables, selecting the correct pluralization,
 * and formatting numbers. Automatically updates when the locale changes.
 *
 * @param strings - A mapping of languages to localized strings by key.
 * @param packageName - Optional package name for global dictionary lookup.
 *
 * @example
 * ```tsx
 * const strings = {
 *   'en-US': {
 *     greeting: 'Hello, {name}!',
 *     count: '{count, plural, one {# item} other {# items}}'
 *   }
 * };
 *
 * function MyComponent() {
 *   const stringFormatter = createStringFormatter(strings);
 *
 *   return (
 *     <div>
 *       {stringFormatter().format('greeting', { name: 'World' })}
 *       {stringFormatter().format('count', { count: 5 })}
 *     </div>
 *   );
 * }
 * ```
 */
export function createStringFormatter<
  K extends string = string,
  T extends LocalizedString = string,
>(strings: LocalizedStrings<K, T>, packageName?: string): Accessor<LocalizedStringFormatter<K, T>> {
  const localeAccessor = useLocale();
  const dictionary = createStringDictionary(strings, packageName);

  return createMemo(() => new LocalizedStringFormatter(localeAccessor().locale, dictionary));
}

export type {
  LocalizedString,
  LocalizedStringDictionary,
  LocalizedStringFormatter,
  LocalizedStrings,
};
