/**
 * ErrorBoundary component for proyecto-viviana-silapse
 *
 * A styled error boundary for use in stories and development.
 */

import { type JSX, ErrorBoundary as SolidErrorBoundary } from 'solid-js';

// ============================================
// TYPES
// ============================================

export interface StoryErrorBoundaryProps {
  /** The content to render. */
  children?: JSX.Element;
  /** Custom fallback component. */
  fallback?: (err: Error, reset: () => void) => JSX.Element;
}

// ============================================
// COMPONENT
// ============================================

/**
 * A styled error boundary that catches and displays errors in stories.
 */
export function StoryErrorBoundary(props: StoryErrorBoundaryProps): JSX.Element {
  return (
    <SolidErrorBoundary
      fallback={(err: Error, reset: () => void) =>
        props.fallback
          ? props.fallback(err, reset)
          : (
            <div class="rounded-lg border-2 border-red-400 bg-red-400/10 p-4">
              <h3 class="text-red-400 font-semibold mb-2">Error</h3>
              <pre class="text-sm text-red-300 whitespace-pre-wrap mb-3">{err.message}</pre>
              <button
                class="px-3 py-1 text-sm rounded bg-red-400 text-on-color hover:bg-red-500 transition-colors"
                onClick={reset}
              >
                Retry
              </button>
            </div>
          )
      }
    >
      {props.children}
    </SolidErrorBoundary>
  );
}
