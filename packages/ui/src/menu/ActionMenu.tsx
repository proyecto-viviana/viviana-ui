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
  type MenuProps as HeadlessMenuProps,
  type MenuTriggerRenderProps,
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
        class={`absolute z-50 mt-1 min-w-[12rem] rounded-lg border-2 border-primary-600 bg-bg-400 shadow-lg overflow-hidden py-1 ${local.class ?? ''}`}
      />
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
