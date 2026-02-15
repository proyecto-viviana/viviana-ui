/**
 * ToggleButtonGroup component for solidaria-components.
 *
 * Groups toggle buttons with single/multiple selection state.
 * Parity target: react-aria-components/src/ToggleButtonGroup.tsx
 */

import { type JSX, createContext, createMemo, createSignal, splitProps, useContext } from 'solid-js';
import type { Key } from '@proyecto-viviana/solid-stately';
import {
  type ClassNameOrFunction,
  type StyleOrFunction,
  type RenderChildren,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
} from './utils';

export interface ToggleButtonGroupRenderProps {
  orientation: 'horizontal' | 'vertical';
  isDisabled: boolean;
}

export interface ToggleButtonGroupProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children' | 'class' | 'style' | 'onSelectionChange'>,
    SlotProps {
  selectionMode?: 'single' | 'multiple';
  selectedKeys?: Iterable<Key>;
  defaultSelectedKeys?: Iterable<Key>;
  onSelectionChange?: (keys: Set<Key>) => void;
  orientation?: 'horizontal' | 'vertical';
  isDisabled?: boolean;
  children?: RenderChildren<ToggleButtonGroupRenderProps>;
  class?: ClassNameOrFunction<ToggleButtonGroupRenderProps>;
  style?: StyleOrFunction<ToggleButtonGroupRenderProps>;
}

export interface ToggleButtonGroupStateContextValue {
  isDisabled: () => boolean;
  selectionMode: () => 'single' | 'multiple';
  isSelected: (key: Key) => boolean;
  toggleKey: (key: Key) => void;
}

export const ToggleButtonGroupContext = createContext<ToggleButtonGroupProps | null>(null);
export const ToggleButtonGroupStateContext = createContext<ToggleButtonGroupStateContextValue | null>(null);
export const ToggleGroupStateContext = ToggleButtonGroupStateContext;

function toKeySet(keys?: Iterable<Key>): Set<Key> {
  return new Set(keys ? Array.from(keys) : []);
}

export function ToggleButtonGroup(props: ToggleButtonGroupProps): JSX.Element {
  const [local, domProps] = splitProps(props, [
    'selectionMode',
    'selectedKeys',
    'defaultSelectedKeys',
    'onSelectionChange',
    'orientation',
    'isDisabled',
    'children',
    'class',
    'style',
    'slot',
  ]);

  const [uncontrolledSelectedKeys, setUncontrolledSelectedKeys] = createSignal<Set<Key>>(
    toKeySet(local.defaultSelectedKeys)
  );

  const isControlled = createMemo(() => local.selectedKeys != null);
  const selectionMode = () => local.selectionMode ?? 'single';
  const selectedKeys = createMemo(() =>
    isControlled() ? toKeySet(local.selectedKeys) : uncontrolledSelectedKeys()
  );

  const setSelectedKeys = (keys: Set<Key>) => {
    if (!isControlled()) {
      setUncontrolledSelectedKeys(keys);
    }
    local.onSelectionChange?.(keys);
  };

  const toggleKey = (key: Key) => {
    const next = new Set(selectedKeys());
    if (selectionMode() === 'single') {
      if (next.has(key)) next.delete(key);
      else {
        next.clear();
        next.add(key);
      }
    } else if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setSelectedKeys(next);
  };

  const stateContext = createMemo<ToggleButtonGroupStateContextValue>(() => ({
    isDisabled: () => !!local.isDisabled,
    selectionMode,
    isSelected: (key) => selectedKeys().has(key),
    toggleKey,
  }));

  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-ToggleButtonGroup',
    },
    () => ({
      orientation: local.orientation ?? 'horizontal',
      isDisabled: !!local.isDisabled,
    })
  );

  const filteredDomProps = filterDOMProps(domProps, { global: true });

  return (
    <div
      {...filteredDomProps}
      role="group"
      class={renderProps.class()}
      style={renderProps.style()}
      slot={local.slot}
      data-orientation={local.orientation ?? 'horizontal'}
      data-disabled={local.isDisabled || undefined}
    >
      <ToggleButtonGroupContext.Provider value={props}>
        <ToggleButtonGroupStateContext.Provider value={stateContext()}>
          {renderProps.renderChildren()}
        </ToggleButtonGroupStateContext.Provider>
      </ToggleButtonGroupContext.Provider>
    </div>
  );
}

export function useToggleButtonGroupStateContext(): ToggleButtonGroupStateContextValue | null {
  return useContext(ToggleButtonGroupStateContext);
}
