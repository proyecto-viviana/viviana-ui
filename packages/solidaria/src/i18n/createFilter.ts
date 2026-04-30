/**
 * createFilter hook for solidaria
 *
 * Provides localized string filtering with collation support.
 *
 * Port of @react-aria/i18n useFilter.
 */

import { createMemo } from "solid-js";
import { createCollator } from "./createCollator";

export interface Filter {
  /** Returns whether a string starts with a given substring. */
  startsWith(string: string, substring: string): boolean;
  /** Returns whether a string ends with a given substring. */
  endsWith(string: string, substring: string): boolean;
  /** Returns whether a string contains a given substring. */
  contains(string: string, substring: string): boolean;
}

/**
 * Provides localized string search functionality for filtering or matching items.
 * Respects locale-specific collation rules for case and diacritic sensitivity.
 *
 * @example
 * ```tsx
 * function SearchableList(props: { items: { name: string }[] }) {
 *   const [query, setQuery] = createSignal('');
 *   const filter = createFilter({ sensitivity: 'base' });
 *
 *   const filteredItems = () =>
 *     props.items.filter((item) =>
 *       filter().contains(item.name, query())
 *     );
 *
 *   return (
 *     <>
 *       <input
 *         value={query()}
 *         onInput={(e) => setQuery(e.target.value)}
 *         placeholder="Search..."
 *       />
 *       <ul>
 *         <For each={filteredItems()}>
 *           {(item) => <li>{item.name}</li>}
 *         </For>
 *       </ul>
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Case-insensitive, diacritic-insensitive filtering
 * const filter = createFilter({ sensitivity: 'base' });
 * filter().contains('Café', 'cafe'); // true
 * filter().startsWith('Hello', 'hello'); // true
 * ```
 */
export function createFilter(options?: Intl.CollatorOptions): () => Filter {
  const collator = createCollator({
    usage: "search",
    ...options,
  });

  return createMemo(() => {
    const coll = collator();

    const startsWith = (str: string, substring: string): boolean => {
      if (substring.length === 0) {
        return true;
      }

      // Normalize both strings for safe slicing
      const normalizedStr = str.normalize("NFC");
      const normalizedSub = substring.normalize("NFC");

      return coll.compare(normalizedStr.slice(0, normalizedSub.length), normalizedSub) === 0;
    };

    const endsWith = (str: string, substring: string): boolean => {
      if (substring.length === 0) {
        return true;
      }

      const normalizedStr = str.normalize("NFC");
      const normalizedSub = substring.normalize("NFC");

      return coll.compare(normalizedStr.slice(-normalizedSub.length), normalizedSub) === 0;
    };

    const contains = (str: string, substring: string): boolean => {
      if (substring.length === 0) {
        return true;
      }

      const normalizedStr = str.normalize("NFC");
      const normalizedSub = substring.normalize("NFC");
      const sliceLen = normalizedSub.length;

      for (let scan = 0; scan + sliceLen <= normalizedStr.length; scan++) {
        const slice = normalizedStr.slice(scan, scan + sliceLen);
        if (coll.compare(normalizedSub, slice) === 0) {
          return true;
        }
      }

      return false;
    };

    return {
      startsWith,
      endsWith,
      contains,
    };
  });
}
