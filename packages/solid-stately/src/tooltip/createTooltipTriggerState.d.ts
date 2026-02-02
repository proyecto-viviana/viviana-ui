/**
 * Manages state for a tooltip trigger.
 * Based on @react-stately/tooltip useTooltipTriggerState.
 *
 * Tracks whether the tooltip is open, and provides methods to toggle this state.
 * Ensures only one tooltip is open at a time and controls the delay for showing a tooltip.
 */
import { type Accessor } from 'solid-js';
import { type OverlayTriggerProps } from '../overlays';
export interface TooltipTriggerProps extends OverlayTriggerProps {
    /** The delay time in milliseconds for the tooltip to show up. */
    delay?: number;
    /** The delay time in milliseconds for the tooltip to close. */
    closeDelay?: number;
}
export interface TooltipTriggerState {
    /** Whether the tooltip is currently showing. */
    readonly isOpen: Accessor<boolean>;
    /**
     * Shows the tooltip. By default, the tooltip becomes visible after a delay
     * depending on a global warmup timer. The `immediate` option shows the
     * tooltip immediately instead.
     */
    open(immediate?: boolean): void;
    /** Hides the tooltip. */
    close(immediate?: boolean): void;
}
/**
 * Resets the global tooltip state. Useful for testing.
 * @internal
 */
export declare function resetTooltipState(): void;
/**
 * Manages state for a tooltip trigger. Tracks whether the tooltip is open, and provides
 * methods to toggle this state. Ensures only one tooltip is open at a time and controls
 * the delay for showing a tooltip.
 */
export declare function createTooltipTriggerState(props?: TooltipTriggerProps): TooltipTriggerState;
//# sourceMappingURL=createTooltipTriggerState.d.ts.map