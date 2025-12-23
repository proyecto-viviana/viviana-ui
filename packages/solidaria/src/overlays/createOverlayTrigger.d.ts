/**
 * Handles the behavior and accessibility for an overlay trigger.
 * Based on @react-aria/overlays useOverlayTrigger.
 */
import type { OverlayTriggerState } from '@proyecto-viviana/solid-stately';
import { type MaybeAccessor } from '../utils';
export interface OverlayTriggerProps {
    /** Type of overlay that is opened by the trigger. */
    type: 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid';
}
export interface OverlayTriggerAria {
    /** Props for the trigger element. */
    triggerProps: {
        'aria-haspopup'?: boolean | 'listbox';
        'aria-expanded': boolean;
        'aria-controls'?: string;
        onPress: () => void;
    };
    /** Props for the overlay container element. */
    overlayProps: {
        id: string;
    };
}
export declare const onCloseMap: WeakMap<Element, () => void>;
/**
 * Handles the behavior and accessibility for an overlay trigger, e.g. a button
 * that opens a popover, menu, or other overlay that is positioned relative to the trigger.
 */
export declare function createOverlayTrigger(props: MaybeAccessor<OverlayTriggerProps>, state: OverlayTriggerState, ref?: () => Element | null): OverlayTriggerAria;
//# sourceMappingURL=createOverlayTrigger.d.ts.map