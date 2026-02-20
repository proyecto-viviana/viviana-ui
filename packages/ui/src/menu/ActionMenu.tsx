/**
 * ActionMenu component for proyecto-viviana-ui
 *
 * A menu triggered by an action button (three-dot or icon button).
 */

import { type JSX, splitProps } from 'solid-js';
import {
  MenuTrigger as HeadlessMenuTrigger,
  MenuButton as HeadlessMenuButton,
  Menu as HeadlessMenu,
  MenuItem as HeadlessMenuItem,
  type MenuProps as HeadlessMenuProps,
  type MenuTriggerRenderProps,
  type MenuItemRenderProps,
} from '@proyecto-viviana/solidaria-components';

// ============================================
// TYPES
// ============================================

export interface ActionMenuProps<T> extends Omit<HeadlessMenuProps<T>, 'class'> {
  /** Additional CSS class name for the menu. */
  class?: string;
  /** Label for the trigger button. @default 'Actions' */
  label?: string;
  /** Whether the button is quiet (no visible background). @default true */
  isQuiet?: boolean;
  /** Whether the trigger is disabled. */
  isDisabled?: boolean;
  /** The alignment of the menu relative to the trigger. */
  align?: 'start' | 'end';
}

// ============================================
// COMPONENT
// ============================================

/**
 * A menu triggered by an action button, typically used for "more actions" menus.
 */
export function ActionMenu<T>(props: ActionMenuProps<T>): JSX.Element {
  const [local, menuProps] = splitProps(props, ['label', 'isQuiet', 'isDisabled', 'align', 'class']);

  return (
    <HeadlessMenuTrigger>
      <HeadlessMenuButton
        isDisabled={local.isDisabled}
        aria-label={local.label ?? 'Actions'}
        class={(renderProps: MenuTriggerRenderProps) => {
          const base = 'inline-flex items-center justify-center rounded-md transition-colors outline-none p-1.5';
          const quietClass = (local.isQuiet ?? true)
            ? 'bg-transparent'
            : 'bg-bg-400 border border-primary-600';

          let stateClass: string;
          if (renderProps.isDisabled) {
            stateClass = 'text-primary-500 cursor-not-allowed';
          } else if (renderProps.isPressed) {
            stateClass = 'bg-bg-200 text-primary-100';
          } else if (renderProps.isHovered) {
            stateClass = 'bg-bg-300 text-primary-200';
          } else {
            stateClass = 'text-primary-300';
          }

          const focusClass = renderProps.isFocusVisible ? 'ring-2 ring-accent' : '';
          return [base, quietClass, stateClass, focusClass].filter(Boolean).join(' ');
        }}
      >
        <MoreIcon />
      </HeadlessMenuButton>
      <HeadlessMenu
        {...menuProps}
        aria-label={local.label ?? 'Actions'}
        class={`absolute z-50 mt-1 min-w-[12rem] rounded-lg border-2 border-primary-600 bg-bg-400 shadow-lg overflow-hidden py-1 ${local.class ?? ''}`}
      >
        {(item: T) => {
          const menuItem = item as { id?: string | number; label?: string; textValue?: string };
          const label = menuItem.label ?? menuItem.textValue ?? String(menuItem.id ?? '');
          return (
            <HeadlessMenuItem
              id={menuItem.id}
              textValue={label}
              class={(renderProps: MenuItemRenderProps) => {
                const base = 'flex items-center cursor-pointer transition-colors duration-150 outline-none text-base py-2 px-4';
                let colorClass: string;
                if (renderProps.isDisabled) {
                  colorClass = 'text-primary-500 cursor-not-allowed';
                } else if (renderProps.isFocused || renderProps.isHovered) {
                  colorClass = 'bg-bg-300 text-primary-100';
                } else {
                  colorClass = 'text-primary-200';
                }
                const pressedClass = renderProps.isPressed ? 'bg-bg-200' : '';
                const focusClass = renderProps.isFocusVisible ? 'ring-2 ring-inset ring-accent-300' : '';
                return [base, colorClass, pressedClass, focusClass].filter(Boolean).join(' ');
              }}
            >
              {label}
            </HeadlessMenuItem>
          );
        }}
      </HeadlessMenu>
    </HeadlessMenuTrigger>
  );
}

function MoreIcon(): JSX.Element {
  return (
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}
