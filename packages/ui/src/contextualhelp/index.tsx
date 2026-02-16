/**
 * ContextualHelp component for proyecto-viviana-ui.
 *
 * Styling-only composition around tooltip primitives.
 */

import { type JSX, Show, splitProps } from 'solid-js';
import { TooltipTrigger, Tooltip } from '../tooltip';

export interface ContextualHelpProps {
  /** Help trigger content. */
  children?: JSX.Element;
  /** Help text/content rendered in overlay. */
  content: JSX.Element;
  /** Accessible label for the default trigger button. */
  triggerLabel?: string;
  /** Additional CSS class for trigger wrapper. */
  class?: string;
}

export function ContextualHelp(props: ContextualHelpProps): JSX.Element {
  const [local] = splitProps(props, ['children', 'content', 'triggerLabel', 'class']);
  return (
    <TooltipTrigger>
      <span class={`inline-flex items-center justify-center ${local.class ?? ''}`}>
        <Show
          when={local.children}
          fallback={(
            <button
              type="button"
              aria-label={local.triggerLabel ?? 'More information'}
              class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-primary-500 text-xs text-primary-200 hover:bg-bg-300"
            >
              ?
            </button>
          )}
        >
          {local.children}
        </Show>
      </span>
      <Tooltip>{local.content}</Tooltip>
    </TooltipTrigger>
  );
}
