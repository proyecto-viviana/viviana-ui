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
  /** Handler called when an item action is triggered. */
  onAction?: (key: Key) => void;
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

interface ActionGroupData {
  onAction?: (key: Key) => void;
}

const actionGroupData = new WeakMap<object, ActionGroupData>();

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

  const focusRelative = (root: HTMLElement, direction: 'next' | 'previous' | 'first' | 'last'): HTMLElement | null => {
    const focusables = getFocusableItems(root);
    if (focusables.length === 0) return null;

    if (direction === 'first') {
      const first = focusables[0];
      focusSafely(first);
      return first;
    }

    if (direction === 'last') {
      const last = focusables[focusables.length - 1];
      focusSafely(last);
      return last;
    }

    const active = root.ownerDocument.activeElement as HTMLElement | null;
    const currentIndex = active ? focusables.indexOf(active) : -1;
    const delta = direction === 'next' ? 1 : -1;
    const nextIndex = currentIndex === -1
      ? (direction === 'next' ? 0 : focusables.length - 1)
      : (currentIndex + delta + focusables.length) % focusables.length;
    const next = focusables[nextIndex];
    focusSafely(next);
    return next;
  };

  const resolveKeyFromElement = (element: HTMLElement | null): Key | null => {
    if (!element) return null;
    const keyedElement = element.closest('[data-key]');
    if (!(keyedElement instanceof HTMLElement)) return null;
    const rawKey = keyedElement.getAttribute('data-key');
    if (!rawKey) return null;
    for (const item of state.collection()) {
      if (String(item.key) === rawKey) {
        return item.key;
      }
    }
    return null;
  };

  const handleFocusMove = (movedTo: HTMLElement | null): void => {
    const key = resolveKeyFromElement(movedTo);
    if (key == null) return;
    state.setFocusedKey(key);
    if (state.selectionMode() === 'single') {
      state.replaceSelection(key);
    }
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
          handleFocusMove(focusRelative(root, 'previous'));
          return;
        }
        if ((e.key === 'ArrowRight' && isHorizontal) || (e.key === 'ArrowDown' && !isHorizontal)) {
          e.preventDefault();
          e.stopPropagation();
          handleFocusMove(focusRelative(root, 'next'));
        }
        return;
      }
      case 'ArrowLeft':
      case 'ArrowUp': {
        if (e.key === 'ArrowLeft' && isHorizontal && isRTL) {
          e.preventDefault();
          e.stopPropagation();
          handleFocusMove(focusRelative(root, 'next'));
          return;
        }
        if ((e.key === 'ArrowLeft' && isHorizontal) || (e.key === 'ArrowUp' && !isHorizontal)) {
          e.preventDefault();
          e.stopPropagation();
          handleFocusMove(focusRelative(root, 'previous'));
        }
        return;
      }
      case 'Home': {
        e.preventDefault();
        e.stopPropagation();
        handleFocusMove(focusRelative(root, 'first'));
        return;
      }
      case 'End': {
        e.preventDefault();
        e.stopPropagation();
        handleFocusMove(focusRelative(root, 'last'));
        return;
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

  actionGroupData.set(state, {
    get onAction() {
      return props.onAction;
    },
  });

  onCleanup(() => {
    actionGroupData.delete(state);
  });

  return { actionGroupProps };
}

export function createActionGroupItem<T>(
  props: AriaActionGroupItemProps,
  state: ListState<T>
): ActionGroupItemAria {
  const button = createButton({
    elementType: 'button',
    isDisabled: state.isDisabled(props.key),
    onPress: () => {
      state.setFocusedKey(props.key);
      actionGroupData.get(state)?.onAction?.(props.key);
      if (state.selectionMode() !== 'none') {
        state.select(props.key);
      }
    },
  });

  const isFocused = () => props.key === state.focusedKey();
  const getFirstEnabledKey = (): Key | null => {
    const collection = state.collection();
    let key = collection.getFirstKey();
    while (key != null && state.isDisabled(key)) {
      key = collection.getKeyAfter(key);
    }
    return key;
  };

  const getDefaultTabStopKey = (): Key | null => {
    const selectionMode = state.selectionMode();
    if (selectionMode !== 'none') {
      const selectedKeys = state.selectedKeys();
      if (selectedKeys === 'all') {
        return getFirstEnabledKey();
      }

      for (const item of state.collection()) {
        if (!state.isDisabled(item.key) && selectedKeys.has(item.key)) {
          return item.key;
        }
      }
    }

    return getFirstEnabledKey();
  };

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
        if (state.isDisabled(props.key)) {
          return -1;
        }

        if (isFocused()) {
          return 0;
        }

        if (state.focusedKey() != null) {
          return -1;
        }

        const defaultTabStopKey = getDefaultTabStopKey();
        return defaultTabStopKey === props.key ? 0 : -1;
      },
      'data-key': String(props.key),
      onFocus: () => {
        state.setFocusedKey(props.key);
      },
    }
  );

  return { buttonProps };
}
