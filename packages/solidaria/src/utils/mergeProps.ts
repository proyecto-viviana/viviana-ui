type Props = Record<string, unknown>;

/**
 * Merges multiple props objects together, handling event handlers specially
 * by chaining them rather than replacing.
 *
 * Based on react-aria's mergeProps but adapted for SolidJS.
 */
export function mergeProps<T extends Props>(...args: T[]): Record<string, unknown> {
  const result: Props = {};

  for (const props of args) {
    for (const key in props) {
      const value = props[key];
      const existingValue = result[key];

      if (
        typeof existingValue === 'function' &&
        typeof value === 'function' &&
        key.startsWith('on') &&
        key[2] === key[2]?.toUpperCase()
      ) {
        // Chain event handlers
        result[key] = chainHandlers(existingValue as Function, value as Function);
      } else if (key === 'class' || key === 'className') {
        // Merge class names
        result[key] = mergeClassNames(existingValue, value);
      } else if (key === 'style' && typeof existingValue === 'object' && typeof value === 'object') {
        // Merge style objects
        result[key] = { ...(existingValue as object), ...(value as object) };
      } else if (value !== undefined) {
        result[key] = value;
      }
    }
  }

  return result;
}

function chainHandlers(existingHandler: Function, newHandler: Function) {
  return (...args: unknown[]) => {
    existingHandler(...args);
    newHandler(...args);
  };
}

function mergeClassNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ');
}
