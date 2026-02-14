/**
 * DropZone primitive for solidaria-components.
 *
 * A drop target area for drag and drop operations.
 * Parity target: react-aria-components/src/DropZone.tsx
 */

import { type JSX, createContext, createMemo, splitProps } from 'solid-js';
import {
  createDrop,
  createFocusRing,
  createHover,
  type AriaDropOptions,
} from '@proyecto-viviana/solidaria';
import {
  type ClassNameOrFunction,
  type StyleOrFunction,
  type RenderChildren,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
} from './utils';

export interface DropZoneRenderProps {
  isHovered: boolean;
  isFocused: boolean;
  isFocusVisible: boolean;
  isDropTarget: boolean;
  isDisabled: boolean;
}

export interface DropZoneProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children' | 'class' | 'style' | 'onDrop'>,
    Omit<AriaDropOptions, 'hasDropButton'>,
    SlotProps {
  children?: RenderChildren<DropZoneRenderProps>;
  class?: ClassNameOrFunction<DropZoneRenderProps>;
  style?: StyleOrFunction<DropZoneRenderProps>;
}

export const DropZoneContext = createContext<DropZoneProps | null>(null);

/**
 * A drop zone is an area into which one or multiple objects can be dropped.
 */
export function DropZone(props: DropZoneProps): JSX.Element {
  const [local, dropProps, domProps] = splitProps(
    props,
    ['children', 'class', 'style', 'slot'],
    ['getDropOperation', 'getDropOperationForPoint', 'onDropEnter', 'onDropMove', 'onDropActivate', 'onDropExit', 'onDrop', 'isDisabled']
  );

  const dropAria = createDrop(() => ({
    getDropOperation: dropProps.getDropOperation,
    getDropOperationForPoint: dropProps.getDropOperationForPoint,
    onDropEnter: dropProps.onDropEnter,
    onDropMove: dropProps.onDropMove,
    onDropActivate: dropProps.onDropActivate,
    onDropExit: dropProps.onDropExit,
    onDrop: dropProps.onDrop,
    isDisabled: dropProps.isDisabled,
  }));

  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return dropProps.isDisabled;
    },
  });
  const { isFocused, isFocusVisible, focusProps } = createFocusRing();

  const renderValues = createMemo<DropZoneRenderProps>(() => ({
    isHovered: isHovered(),
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible(),
    isDropTarget: dropAria.isDropTarget,
    isDisabled: !!dropProps.isDisabled,
  }));

  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-DropZone',
    },
    renderValues
  );

  const filteredDomProps = createMemo(() => filterDOMProps(domProps, { global: true }));

  const cleanDropProps = () => {
    const { ref: _ref, ...rest } = dropAria.dropProps as Record<string, unknown>;
    return rest;
  };
  const cleanHoverProps = () => {
    const { ref: _ref, ...rest } = hoverProps as Record<string, unknown>;
    return rest;
  };
  const cleanFocusProps = () => {
    const { ref: _ref, ...rest } = focusProps as Record<string, unknown>;
    return rest;
  };

  return (
    <div
      {...filteredDomProps()}
      {...cleanDropProps()}
      {...cleanHoverProps()}
      {...cleanFocusProps()}
      role="group"
      tabIndex={dropProps.isDisabled ? -1 : 0}
      class={renderProps.class()}
      style={renderProps.style()}
      slot={local.slot}
      data-hovered={isHovered() || undefined}
      data-focused={isFocused() || undefined}
      data-focus-visible={isFocusVisible() || undefined}
      data-drop-target={dropAria.isDropTarget || undefined}
      data-disabled={dropProps.isDisabled || undefined}
    >
      {renderProps.renderChildren()}
    </div>
  );
}
