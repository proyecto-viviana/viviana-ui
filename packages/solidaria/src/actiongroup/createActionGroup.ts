import { onCleanup, type JSX, type Accessor } from 'solid-js';
import { createButton } from '../button';
import { filterDOMProps, getEventTarget, mergeProps, nodeContains, isFocusable, focusSafely } from '../utils';
import { useLocale } from '../i18n';
import type { Orientation } from '../toolbar';
import type { Key, ListState } from '@proyecto-viviana/solid-stately';

export interface AriaActionGroupProps<T = unknown> {
  /** List items (optional, parity with React Aria prop shape). */
  items?: T[];
  /** Whether the whole action group is disabled. */
  isDisabled?: boolean;
  /** Group orientation. */
  orientation?: Orientation;
  /** Accessible label. */
  'aria-label'?: string;
  /** Labelled-by id. */
  'aria-labelledby'?: string;
}

export interface ActionGroupAria {
  actionGroupProps: JSX.HTMLAttributes<HTMLElement>;
}

export interface AriaActionGroupItemProps {
  key: Key;
}

export interface ActionGroupItemAria {
  buttonProps: JSX.HTMLAttributes<HTMLElement>;
}

const GROUP_ROLE_BY_MODE = {
  none: 'toolbar',
  single: 'radiogroup',
  multiple: 'toolbar',
} as const;

const ITEM_ROLE_BY_MODE = {
  none: undefined,
  single: 'radio',
  multiple: 'checkbox',
} as const;

function isActionGroupDisabled<T>(props: AriaActionGroupProps<T>, state: ListState<T>): boolean {
  if (props.isDisabled) return true;
  const keys = [...state.collection().getKeys()];
  if (keys.length === 0) return true;
  return !keys.some((key) => !state.isDisabled(key));
}

export function createActionGroup<T>(
  props: AriaActionGroupProps<T>,
  state: ListState<T>,
  _ref?: Accessor<HTMLElement | null>
): ActionGroupAria {
  const locale = useLocale();
  let groupRef: HTMLElement | undefined;
  const applyRoleAttributes = (): void => {
    if (!groupRef) return;
    const selectionMode = state.selectionMode();
    const mappedRole = GROUP_ROLE_BY_MODE[selectionMode];
    const nestedToolbar = Boolean(groupRef.parentElement?.closest('[role="toolbar"]'));
    const role = mappedRole === 'toolbar' && nestedToolbar ? 'group' : mappedRole;
    groupRef.setAttribute('role', role);
    if (mappedRole === 'toolbar' && !nestedToolbar) {
      groupRef.setAttribute('aria-orientation', props.orientation ?? 'horizontal');
    } else {
      groupRef.removeAttribute('aria-orientation');
    }
  };

  const getFocusableItems = (root: HTMLElement): HTMLElement[] => {
    const out: HTMLElement[] = [];
    const pushIfFocusable = (el: Element | null | undefined): void => {
      if (!el || !(el instanceof HTMLElement)) return;
      if (isFocusable(el) && el.getAttribute('aria-disabled') !== 'true') {
        out.push(el);
      }
    };

    pushIfFocusable(root);
    for (const node of root.querySelectorAll('*')) {
      pushIfFocusable(node);
    }
    return out;
  };

  const focusRelative = (root: HTMLElement, direction: 'next' | 'previous'): void => {
    const focusables = getFocusableItems(root);
    if (focusables.length === 0) return;
    const active = document.activeElement as HTMLElement | null;
    const currentIndex = active ? focusables.indexOf(active) : -1;
    const delta = direction === 'next' ? 1 : -1;
    const nextIndex = currentIndex === -1
      ? (direction === 'next' ? 0 : focusables.length - 1)
      : (currentIndex + delta + focusables.length) % focusables.length;
    focusSafely(focusables[nextIndex]);
  };

  const onKeyDown: JSX.EventHandler<HTMLElement, KeyboardEvent> = (e) => {
    const root = groupRef;
    if (!root || isActionGroupDisabled(props, state)) return;
    if (!nodeContains(e.currentTarget, getEventTarget(e))) return;

    const orientation = props.orientation ?? 'horizontal';
    const isHorizontal = orientation === 'horizontal';
    const isRTL = locale().direction === 'rtl' && isHorizontal;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown': {
        if (e.key === 'ArrowRight' && isHorizontal && isRTL) {
          e.preventDefault();
          e.stopPropagation();
          focusRelative(root, 'previous');
          return;
        }
        if ((e.key === 'ArrowRight' && isHorizontal) || (e.key === 'ArrowDown' && !isHorizontal)) {
          e.preventDefault();
          e.stopPropagation();
          focusRelative(root, 'next');
        }
        return;
      }
      case 'ArrowLeft':
      case 'ArrowUp': {
        if (e.key === 'ArrowLeft' && isHorizontal && isRTL) {
          e.preventDefault();
          e.stopPropagation();
          focusRelative(root, 'next');
          return;
        }
        if ((e.key === 'ArrowLeft' && isHorizontal) || (e.key === 'ArrowUp' && !isHorizontal)) {
          e.preventDefault();
          e.stopPropagation();
          focusRelative(root, 'previous');
        }
      }
    }
  };

  const actionGroupProps: JSX.HTMLAttributes<HTMLElement> = mergeProps(
    filterDOMProps(props as Record<string, unknown>, { labelable: true }),
    {
      ref: (el: HTMLElement) => {
        groupRef = el;
        applyRoleAttributes();
        queueMicrotask(() => {
          if (!groupRef) return;
          applyRoleAttributes();
        });
      },
      onKeyDown,
      get 'aria-label'() {
        return props['aria-label'];
      },
      get 'aria-labelledby'() {
        return props['aria-label'] ? undefined : props['aria-labelledby'];
      },
      get 'aria-disabled'() {
        return isActionGroupDisabled(props, state) || undefined;
      },
    }
  );

  return { actionGroupProps };
}

export function createActionGroupItem<T>(
  props: AriaActionGroupItemProps,
  state: ListState<T>
): ActionGroupItemAria {
  const button = createButton({
    elementType: 'button',
    isDisabled: state.isDisabled(props.key),
    onPress: () => state.select(props.key),
  });

  const isFocused = () => props.key === state.focusedKey();
  onCleanup(() => {
    if (isFocused()) {
      state.setFocusedKey(null);
    }
  });

  const buttonProps: JSX.HTMLAttributes<HTMLElement> = mergeProps(
    button.buttonProps,
    {
      get role() {
        return ITEM_ROLE_BY_MODE[state.selectionMode()];
      },
      get 'aria-checked'() {
        const mode = state.selectionMode();
        if (mode === 'none') return undefined;
        return state.isSelected(props.key);
      },
      get tabIndex() {
        return isFocused() || state.focusedKey() == null ? 0 : -1;
      },
      onFocus: () => {
        state.setFocusedKey(props.key);
      },
    }
  );

  return { buttonProps };
}
