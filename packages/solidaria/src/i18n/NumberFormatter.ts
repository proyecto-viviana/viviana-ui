/**
 * NumberFormatter for solidaria
 *
 * A wrapper around Intl.NumberFormat with caching and polyfills.
 *
 * Port of @internationalized/number NumberFormatter.
 */

// ============================================
// FEATURE DETECTION
// ============================================

let supportsSignDisplay = false;
try {
  supportsSignDisplay =
    new Intl.NumberFormat('de-DE', { signDisplay: 'exceptZero' }).resolvedOptions()
      .signDisplay === 'exceptZero';
} catch {
  // Not supported
}

let supportsUnit = false;
try {
  supportsUnit =
    new Intl.NumberFormat('de-DE', { style: 'unit', unit: 'degree' }).resolvedOptions()
      .style === 'unit';
} catch {
  // Not supported
}

// ============================================
// POLYFILLS
// ============================================

// Polyfill for units since Safari doesn't support them yet.
// Currently only polyfilling the unit degree in narrow format.
const UNITS: Record<string, Record<string, Record<string, string>>> = {
  degree: {
    narrow: {
      default: '°',
      'ja-JP': ' 度',
      'zh-TW': '度',
      'sl-SI': ' °',
    },
  },
};

// ============================================
// TYPES
// ============================================

export interface NumberFormatOptions extends Intl.NumberFormatOptions {
  /** Overrides default numbering system for the current locale. */
  numberingSystem?: string;
}

interface NumberRangeFormatPart extends Intl.NumberFormatPart {
  source: 'startRange' | 'endRange' | 'shared';
}

// ============================================
// CACHE
// ============================================

const formatterCache = new Map<string, Intl.NumberFormat>();

function getCachedNumberFormatter(
  locale: string,
  options: NumberFormatOptions = {}
): Intl.NumberFormat {
  let processedLocale = locale;
  const { numberingSystem } = options;

  if (numberingSystem && !processedLocale.includes('-nu-')) {
    if (!processedLocale.includes('-u-')) {
      processedLocale += '-u-';
    }
    processedLocale += `-nu-${numberingSystem}`;
  }

  let processedOptions = options;
  if (options.style === 'unit' && !supportsUnit) {
    const { unit, unitDisplay = 'short' } = options;
    if (!unit) {
      throw new Error('unit option must be provided with style: "unit"');
    }
    if (!UNITS[unit]?.[unitDisplay]) {
      throw new Error(`Unsupported unit ${unit} with unitDisplay = ${unitDisplay}`);
    }
    processedOptions = { ...options, style: 'decimal' };
  }

  const cacheKey =
    processedLocale +
    (processedOptions
      ? Object.entries(processedOptions)
          .sort((a, b) => (a[0] < b[0] ? -1 : 1))
          .join()
      : '');

  if (formatterCache.has(cacheKey)) {
    return formatterCache.get(cacheKey)!;
  }

  const numberFormatter = new Intl.NumberFormat(processedLocale, processedOptions);
  formatterCache.set(cacheKey, numberFormatter);
  return numberFormatter;
}

// ============================================
// SIGN DISPLAY POLYFILL
// ============================================

function numberFormatSignDisplayPolyfill(
  numberFormat: Intl.NumberFormat,
  signDisplay: string,
  num: number
): string {
  if (signDisplay === 'auto') {
    return numberFormat.format(num);
  } else if (signDisplay === 'never') {
    return numberFormat.format(Math.abs(num));
  } else {
    let needsPositiveSign = false;
    let processedNum = num;

    if (signDisplay === 'always') {
      needsPositiveSign = num > 0 || Object.is(num, 0);
    } else if (signDisplay === 'exceptZero') {
      if (Object.is(num, -0) || Object.is(num, 0)) {
        processedNum = Math.abs(num);
      } else {
        needsPositiveSign = num > 0;
      }
    }

    if (needsPositiveSign) {
      const negative = numberFormat.format(-processedNum);
      const noSign = numberFormat.format(processedNum);
      // Ignore RTL/LTR marker characters
      const minus = negative.replace(noSign, '').replace(/\u200e|\u061C/, '');
      if ([...minus].length !== 1) {
        console.warn(
          'solidaria i18n polyfill for NumberFormat signDisplay: Unsupported case'
        );
      }
      const positive = negative
        .replace(noSign, '!!!')
        .replace(minus, '+')
        .replace('!!!', noSign);
      return positive;
    } else {
      return numberFormat.format(processedNum);
    }
  }
}

// ============================================
// NUMBER FORMATTER CLASS
// ============================================

/**
 * A wrapper around Intl.NumberFormat providing additional options, polyfills, and caching.
 *
 * @example
 * ```ts
 * const formatter = new NumberFormatter('en-US', {
 *   style: 'currency',
 *   currency: 'USD',
 * });
 * formatter.format(1234.56); // '$1,234.56'
 * ```
 */
export class NumberFormatter implements Intl.NumberFormat {
  private numberFormatter: Intl.NumberFormat;
  private options: NumberFormatOptions;

  constructor(locale: string, options: NumberFormatOptions = {}) {
    this.numberFormatter = getCachedNumberFormatter(locale, options);
    this.options = options;
  }

  /** Formats a number value as a string, according to the locale and options. */
  format(value: number): string {
    let res = '';

    if (!supportsSignDisplay && this.options.signDisplay != null) {
      res = numberFormatSignDisplayPolyfill(
        this.numberFormatter,
        this.options.signDisplay,
        value
      );
    } else {
      res = this.numberFormatter.format(value);
    }

    if (this.options.style === 'unit' && !supportsUnit) {
      const { unit, unitDisplay = 'short', locale } = this.resolvedOptions();
      if (!unit) {
        return res;
      }
      const values = UNITS[unit]?.[unitDisplay];
      res += values[locale] || values.default;
    }

    return res;
  }

  /** Formats a number to an array of parts. */
  formatToParts(value: number): Intl.NumberFormatPart[] {
    return this.numberFormatter.formatToParts(value);
  }

  /** Formats a number range as a string. */
  formatRange(start: number, end: number): string {
    if (typeof this.numberFormatter.formatRange === 'function') {
      return this.numberFormatter.formatRange(start, end);
    }

    if (end < start) {
      throw new RangeError('End date must be >= start date');
    }

    // Fallback for old browsers
    return `${this.format(start)} – ${this.format(end)}`;
  }

  /** Formats a number range as an array of parts. */
  formatRangeToParts(start: number, end: number): NumberRangeFormatPart[] {
    if (typeof this.numberFormatter.formatRangeToParts === 'function') {
      return this.numberFormatter.formatRangeToParts(start, end);
    }

    if (end < start) {
      throw new RangeError('End date must be >= start date');
    }

    const startParts = this.numberFormatter.formatToParts(start);
    const endParts = this.numberFormatter.formatToParts(end);
    return [
      ...startParts.map((p) => ({ ...p, source: 'startRange' as const })),
      { type: 'literal' as const, value: ' – ', source: 'shared' as const },
      ...endParts.map((p) => ({ ...p, source: 'endRange' as const })),
    ];
  }

  /** Returns the resolved formatting options. */
  resolvedOptions(): Intl.ResolvedNumberFormatOptions {
    let options = this.numberFormatter.resolvedOptions();

    if (!supportsSignDisplay && this.options.signDisplay != null) {
      options = { ...options, signDisplay: this.options.signDisplay };
    }

    if (!supportsUnit && this.options.style === 'unit') {
      options = {
        ...options,
        style: 'unit',
        unit: this.options.unit,
        unitDisplay: this.options.unitDisplay,
      };
    }

    return options;
  }
}
