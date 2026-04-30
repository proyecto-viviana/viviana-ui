/**
 * ContextualHelpTrigger headless component
 *
 * A button trigger that opens contextual help in a popover or dialog.
 * Uses existing overlay infrastructure.
 */

import {
  type JSX,
  createSignal,
  splitProps,
  Show,
  onCleanup,
  createEffect,
  createUniqueId,
} from "solid-js";

// ============================================
// TYPES
// ============================================

export interface ContextualHelpTriggerProps extends Omit<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>,
  "class" | "children"
> {
  /** Whether the trigger is currently unavailable (shows different styling). */
  isUnavailable?: boolean;
  /**
   * Two children: [trigger element, help content].
   * The trigger renders as a button, the content opens in a popover.
   */
  children?: [JSX.Element, JSX.Element];
  /** CSS class name. */
  class?: string;
  /** Whether the trigger is disabled. */
  isDisabled?: boolean;
}

export interface ContextualHelpTriggerRenderProps {
  isOpen: boolean;
  isUnavailable: boolean;
  isDisabled: boolean;
}

// ============================================
// COMPONENT
// ============================================

/**
 * A trigger that opens contextual help content.
 *
 * @example
 * ```tsx
 * <ContextualHelpTrigger>
 *   {[
 *     <span>What is this?</span>,
 *     <div>Help content goes here...</div>
 *   ]}
 * </ContextualHelpTrigger>
 * ```
 */
export function ContextualHelpTrigger(props: ContextualHelpTriggerProps): JSX.Element {
  const [local, triggerProps] = splitProps(props, [
    "isUnavailable",
    "children",
    "class",
    "isDisabled",
  ]);
  const [isOpen, setIsOpen] = createSignal(false);
  const triggerId = createUniqueId();
  const contentId = createUniqueId();
  let triggerRef: HTMLButtonElement | undefined;
  let contentRef: HTMLDivElement | undefined;

  const isUnavailable = () => local.isUnavailable ?? false;
  const isDisabled = () => local.isDisabled ?? false;

  const toggle = () => {
    if (!isDisabled()) {
      setIsOpen(!isOpen());
    }
  };

  const close = () => setIsOpen(false);

  const callHandler = <E extends Event>(
    handler: JSX.EventHandlerUnion<HTMLButtonElement, E> | undefined,
    event: E,
  ) => {
    if (!handler) return;
    if (Array.isArray(handler)) {
      handler[1].call(handler[0], event);
      return;
    }
    if (typeof handler === "function") {
      (handler as (evt: E) => void)(event);
      return;
    }
    if (
      typeof handler === "object" &&
      "handleEvent" in handler &&
      typeof handler.handleEvent === "function"
    ) {
      (handler.handleEvent as (evt: E) => void)(event);
    }
  };

  const handleTriggerClick = (e: MouseEvent) => {
    callHandler(triggerProps.onClick, e);
    if (e.defaultPrevented) return;
    toggle();
  };

  const handleTriggerKeyDown = (e: KeyboardEvent) => {
    callHandler(triggerProps.onKeyDown, e);
    if (e.defaultPrevented) return;
    if (e.key === "Escape" && isOpen()) {
      e.preventDefault();
      e.stopPropagation();
      close();
      triggerRef?.focus();
    }
  };

  // Close on outside click
  const handleDocumentClick = (e: MouseEvent) => {
    if (
      isOpen() &&
      triggerRef &&
      contentRef &&
      !triggerRef.contains(e.target as Node) &&
      !contentRef.contains(e.target as Node)
    ) {
      close();
    }
  };

  createEffect(() => {
    if (!isOpen()) return;
    document.addEventListener("mousedown", handleDocumentClick);
    onCleanup(() => {
      document.removeEventListener("mousedown", handleDocumentClick);
    });
  });

  // Focus trap: return focus to trigger on close
  createEffect(() => {
    if (!isOpen()) return;
    // Focus the content on open
    contentRef?.focus();
  });

  const children = () => local.children ?? ([null, null] as [JSX.Element, JSX.Element]);
  const trigger = () => children()[0];
  const content = () => children()[1];

  return (
    <div
      class={`solidaria-ContextualHelpTrigger ${local.class ?? ""}`}
      style={{ position: "relative", display: "inline-block" }}
    >
      <button
        {...triggerProps}
        type="button"
        id={triggerId}
        ref={triggerRef}
        aria-haspopup="dialog"
        aria-expanded={isOpen()}
        aria-controls={isOpen() ? contentId : undefined}
        data-unavailable={isUnavailable() || undefined}
        data-disabled={isDisabled() || undefined}
        disabled={isDisabled()}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        class="solidaria-ContextualHelpTrigger-trigger"
      >
        {trigger()}
      </button>

      <Show when={isOpen()}>
        <div
          id={contentId}
          ref={contentRef}
          role="dialog"
          aria-labelledby={triggerId}
          tabIndex={-1}
          class="solidaria-ContextualHelpTrigger-content"
          style={{ position: "absolute", "z-index": "50" }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              e.stopPropagation();
              close();
              triggerRef?.focus();
            }
          }}
        >
          {content()}
        </div>
      </Show>
    </div>
  );
}
