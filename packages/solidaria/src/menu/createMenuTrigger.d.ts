/**
 * Provides the behavior and accessibility implementation for a menu trigger.
 * Based on @react-aria/menu useMenuTrigger.
 */
import { type JSX } from 'solid-js';
import { type MaybeAccessor } from '../utils/reactivity';
import type { OverlayTriggerState } from '@proyecto-viviana/solid-stately';
export interface AriaMenuTriggerProps {
    /** The type of menu that the menu trigger opens. */
    type?: 'menu' | 'listbox';
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
export declare function createMenuTrigger(props: MaybeAccessor<AriaMenuTriggerProps>, state: OverlayTriggerState): MenuTriggerAria;
//# sourceMappingURL=createMenuTrigger.d.ts.map