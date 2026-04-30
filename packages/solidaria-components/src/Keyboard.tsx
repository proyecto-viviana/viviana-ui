/**
 * Keyboard primitive for solidaria-components.
 *
 * Displays keyboard key hints with semantic <kbd> markup.
 * Port direction: react-aria-components/src/Keyboard.tsx
 */

import { type JSX, createContext, splitProps, useContext } from "solid-js";

export interface KeyboardProps extends JSX.HTMLAttributes<HTMLElement> {
  children?: JSX.Element;
}

export const KeyboardContext = createContext<KeyboardProps | null>(null);

export function Keyboard(props: KeyboardProps): JSX.Element {
  const context = useContext(KeyboardContext);
  const merged = () => ({ ...context, ...props });
  const [local, domProps] = splitProps(merged(), ["children"]);

  return (
    <kbd dir="ltr" {...domProps}>
      {local.children}
    </kbd>
  );
}
