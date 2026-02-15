/**
 * Shared SelectionIndicator primitive for selected collection items.
 */

import {
  type JSX,
  createContext,
  createMemo,
  splitProps,
  useContext,
  Show,
} from 'solid-js';
import {
  type RenderChildren,
  type ClassNameOrFunction,
  type StyleOrFunction,
  type SlotProps,
  useRenderProps,
} from './utils';

export interface SelectionIndicatorContextValue {
  isSelected: () => boolean;
}

export const SelectionIndicatorContext = createContext<SelectionIndicatorContextValue | null>(null);

export interface SelectionIndicatorRenderProps {
  /** Whether the parent item is selected. */
  isSelected: boolean;
}

export interface SelectionIndicatorProps extends SlotProps {
  /** Optional controlled selected state override. */
  isSelected?: boolean;
  /** Whether to keep mounted when not selected. */
  shouldForceMount?: boolean;
  /** The children content. */
  children?: RenderChildren<SelectionIndicatorRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<SelectionIndicatorRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<SelectionIndicatorRenderProps>;
}

/**
 * SelectionIndicator renders when its parent item is selected.
 */
export function SelectionIndicator(props: SelectionIndicatorProps): JSX.Element {
  const [local] = splitProps(props, ['isSelected', 'shouldForceMount', 'children', 'class', 'style', 'slot']);

  const context = useContext(SelectionIndicatorContext);
  const isSelected = () => local.isSelected ?? context?.isSelected() ?? false;

  const renderValues = createMemo<SelectionIndicatorRenderProps>(() => ({
    isSelected: isSelected(),
  }));

  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-SelectionIndicator',
    },
    renderValues
  );

  return (
    <Show when={local.shouldForceMount || isSelected()}>
      <span
        aria-hidden="true"
        class={renderProps.class()}
        style={renderProps.style()}
        data-selected={isSelected() || undefined}
      >
        {renderProps.renderChildren()}
      </span>
    </Show>
  );
}
