/**
 * Manages state for an overlay trigger.
 * Based on @react-stately/overlays useOverlayTriggerState.
 */
import { type Accessor } from "solid-js";
import { type MaybeAccessor } from "../utils";
export interface OverlayTriggerProps {
  /** Whether the overlay is open by default (uncontrolled). */
  defaultOpen?: boolean;
  /** Whether the overlay is open (controlled). */
  isOpen?: boolean;
  /** Handler that is called when the overlay's open state changes. */
  onOpenChange?: (isOpen: boolean) => void;
}
export interface OverlayTriggerState {
  /** Whether the overlay is currently open. */
  readonly isOpen: Accessor<boolean>;
  /** Sets whether the overlay is open. */
  setOpen(isOpen: boolean): void;
  /** Opens the overlay. */
  open(): void;
  /** Closes the overlay. */
  close(): void;
  /** Toggles the overlay's visibility. */
  toggle(): void;
}
/**
 * Manages state for an overlay trigger. Tracks whether the overlay is open, and provides
 * methods to toggle this state.
 */
export declare function createOverlayTriggerState(
  props?: MaybeAccessor<OverlayTriggerProps>,
): OverlayTriggerState;
//# sourceMappingURL=createOverlayTriggerState.d.ts.map
