/**
 * Lightweight style-macro compatibility helpers.
 */

export function s1(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
