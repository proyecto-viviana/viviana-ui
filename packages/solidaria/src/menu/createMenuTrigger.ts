/**
 * Provides the behavior and accessibility implementation for a menu trigger.
 * Based on @react-aria/menu useMenuTrigger.
 */

import { type JSX } from "solid-js";
import { createId } from "../ssr";
import { access, type MaybeAccessor } from "../utils/reactivity";
import type { OverlayTriggerState } from "@proyecto-viviana/solid-stately";

export interface AriaMenuTriggerProps {
  /** The type of menu that the menu trigger opens. */
  type?: "menu" | "listbox";
  /** Whether the menu trigger is disabled. */
  isDisabled?: boolean;
  /** An ID for the menu. */
  id?: string;
}

export interface MenuTriggerAria {
  /** Props for the menu trigger button. */
  menuTriggerProps: JSX.HTMLAttributes<HTMLElement> & {
    onPress: () => void;
    onKeyDown: (e: KeyboardEvent) => void;
  };
  /** Props for the menu element. */
  menuProps: JSX.HTMLAttributes<HTMLElement>;
}

/**
 * Provides the behavior and accessibility implementation for a menu trigger.
 */
export function createMenuTrigger(
  props: MaybeAccessor<AriaMenuTriggerProps>,
  state: OverlayTriggerState,
): MenuTriggerAria {
  const getProps = () => access(props);
  const menuId = createId(getProps().id);

  const onPress = () => {
    if (!getProps().isDisabled) {
      state.toggle();
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (getProps().isDisabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
      case "ArrowDown": {
        e.preventDefault();
        if (!state.isOpen()) {
          state.open();
        }
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        if (!state.isOpen()) {
          state.open();
        }
        break;
      }
    }
  };

  return {
    get menuTriggerProps() {
      const p = getProps();
      const type = p.type ?? "menu";
      const isOpen = state.isOpen();

      return {
        "aria-haspopup": type,
        "aria-expanded": isOpen,
        "aria-controls": isOpen ? menuId : undefined,
        "aria-disabled": p.isDisabled || undefined,
        onPress,
        onKeyDown,
      };
    },
    menuProps: {
      id: menuId,
    },
  };
}
