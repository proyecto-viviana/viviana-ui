/**
 * Labels utility for Solidaria
 *
 * Merges aria-label and aria-labelledby into aria-labelledby when both exist.
 *
 * This is a 1:1 port of @react-aria/utils's useLabels hook.
 */

import { createId } from '../ssr';
import type { AriaLabelingProps, DOMProps } from './createLabel';

/**
 * Merges aria-label and aria-labelledby into aria-labelledby when both exist.
 *
 * @param props - Aria label props.
 * @param defaultLabel - Default value for aria-label when not present.
 */
export function createLabels(
  props: DOMProps & AriaLabelingProps,
  defaultLabel?: string
): DOMProps & AriaLabelingProps {
  let {
    id,
    'aria-label': label,
    'aria-labelledby': labelledBy,
  } = props;

  // Generate an ID if not provided
  id = createId(id);

  // If there is both an aria-label and aria-labelledby,
  // combine them by pointing to the element itself.
  if (labelledBy && label) {
    const ids = new Set([id, ...labelledBy.trim().split(/\s+/)]);
    labelledBy = [...ids].join(' ');
  } else if (labelledBy) {
    labelledBy = labelledBy.trim().split(/\s+/).join(' ');
  }

  // If no labels are provided, use the default
  if (!label && !labelledBy && defaultLabel) {
    label = defaultLabel;
  }

  return {
    id,
    'aria-label': label,
    'aria-labelledby': labelledBy,
  };
}
