import { JSX, Accessor } from 'solid-js';

export interface CreateFocusableProps {
  isDisabled?: Accessor<boolean> | boolean;
  autoFocus?: boolean;
  excludeFromTabOrder?: boolean;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onFocusChange?: (isFocused: boolean) => void;
}

export interface FocusableResult {
  focusableProps: JSX.HTMLAttributes<HTMLElement>;
}

function isDisabledValue(isDisabled: Accessor<boolean> | boolean | undefined): boolean {
  if (typeof isDisabled === 'function') {
    return isDisabled();
  }
  return isDisabled ?? false;
}

/**
 * Makes an element focusable, handling disabled state and tab order.
 *
 * Based on react-aria's useFocusable but adapted for SolidJS.
 */
export function createFocusable(props: CreateFocusableProps = {}): FocusableResult {
  const onFocus: JSX.EventHandler<HTMLElement, FocusEvent> = (e) => {
    if (isDisabledValue(props.isDisabled)) return;
    props.onFocus?.(e);
    props.onFocusChange?.(true);
  };

  const onBlur: JSX.EventHandler<HTMLElement, FocusEvent> = (e) => {
    props.onBlur?.(e);
    props.onFocusChange?.(false);
  };

  const focusableProps: JSX.HTMLAttributes<HTMLElement> = {
    onFocus,
    onBlur,
  };

  if (!isDisabledValue(props.isDisabled)) {
    if (props.excludeFromTabOrder) {
      focusableProps.tabIndex = -1;
    }
  }

  return { focusableProps };
}
