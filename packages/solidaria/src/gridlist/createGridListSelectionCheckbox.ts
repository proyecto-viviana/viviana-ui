/**
 * createGridListSelectionCheckbox - Provides accessibility for a grid list item selection checkbox.
 * Based on @react-aria/gridlist.
 */

import { createMemo, type Accessor } from 'solid-js';
import type { JSX } from 'solid-js';
import { createId } from '@proyecto-viviana/solid-stately';
import type { GridState, GridCollection } from '@proyecto-viviana/solid-stately';
import type { AriaGridListSelectionCheckboxProps, GridListSelectionCheckboxAria } from './types';

/**
 * Creates accessibility props for a grid list item selection checkbox.
 */
export function createGridListSelectionCheckbox<T extends object, C extends GridCollection<T> = GridCollection<T>>(
  props: Accessor<AriaGridListSelectionCheckboxProps>,
  state: Accessor<GridState<T, C>>
): GridListSelectionCheckboxAria {
  const checkboxId = createId();

  const isSelected = createMemo(() => {
    const s = state();
    const p = props();
    return s.isSelected(p.key);
  });

  const isDisabled = createMemo(() => {
    const s = state();
    const p = props();
    return s.isDisabled(p.key);
  });

  const onChange = () => {
    const s = state();
    const p = props();
    if (!isDisabled()) {
      s.toggleSelection(p.key);
    }
  };

  const checkboxProps = createMemo(() => {
    const baseProps: Record<string, unknown> = {
      id: checkboxId,
      type: 'checkbox',
      checked: isSelected(),
      disabled: isDisabled(),
      onChange,
      'aria-label': 'Select',
    };

    return baseProps as JSX.InputHTMLAttributes<HTMLInputElement>;
  });

  return {
    get checkboxProps() {
      return checkboxProps();
    },
  };
}
