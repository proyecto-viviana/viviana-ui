/**
 * i18n utilities for solidaria
 *
 * RTL detection and locale utilities.
 *
 * Port of @react-aria/i18n utils.
 */

// https://en.wikipedia.org/wiki/Right-to-left
const RTL_SCRIPTS = new Set([
  "Arab",
  "Syrc",
  "Samr",
  "Mand",
  "Thaa",
  "Mend",
  "Nkoo",
  "Adlm",
  "Rohg",
  "Hebr",
]);

const RTL_LANGS = new Set([
  "ae",
  "ar",
  "arc",
  "bcc",
  "bqi",
  "ckb",
  "dv",
  "fa",
  "glk",
  "he",
  "ku",
  "mzn",
  "nqo",
  "pnb",
  "ps",
  "sd",
  "ug",
  "ur",
  "yi",
]);

/**
 * Determines if a locale is read right to left.
 * Uses Intl.Locale API when available for accurate detection.
 */
export function isRTL(localeString: string): boolean {
  // If the Intl.Locale API is available, use it to get the locale's text direction.
  if (typeof Intl !== "undefined" && Intl.Locale) {
    try {
      const locale = new Intl.Locale(localeString).maximize();

      // Use the text info object to get the direction if possible.
      // getTextInfo() was implemented as a property by some browsers before it was standardized as a function.
      const localeAny = locale as unknown as {
        getTextInfo?: () => { direction: string };
        textInfo?: { direction: string };
      };
      const textInfo =
        typeof localeAny.getTextInfo === "function" ? localeAny.getTextInfo() : localeAny.textInfo;

      if (textInfo) {
        return textInfo.direction === "rtl";
      }

      // Fallback: guess using the script.
      if (locale.script) {
        return RTL_SCRIPTS.has(locale.script);
      }
    } catch {
      // Fall through to language-based detection
    }
  }

  // If not, just guess by the language (first part of the locale)
  const lang = localeString.split("-")[0];
  return RTL_LANGS.has(lang);
}

/**
 * Creates a cache key for formatter options.
 */
export function createCacheKey(locale: string, options?: Record<string, unknown>): string {
  if (!options) {
    return locale;
  }
  return (
    locale +
    Object.entries(options)
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .join()
  );
}
