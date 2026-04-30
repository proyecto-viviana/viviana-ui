/**
 * ARIA hooks for StepList components.
 * Provides accessible step list and step item props.
 */

import type { JSX } from "solid-js";
import type { StepListState } from "@proyecto-viviana/solid-stately";
import type { Key } from "@proyecto-viviana/solid-stately";

export interface AriaStepListProps {
  /** Accessible label for the step list. */
  "aria-label"?: string;
  /** ID of element that labels the step list. */
  "aria-labelledby"?: string;
}

export interface StepListAria {
  /** Props for the step list container element. */
  stepListProps: JSX.HTMLAttributes<HTMLOListElement>;
}

/**
 * Creates ARIA props for a step list container.
 */
export function createStepList(props: AriaStepListProps, _state: StepListState): StepListAria {
  return {
    stepListProps: {
      get "aria-label"() {
        return props["aria-label"] ?? "Step List";
      },
      get "aria-labelledby"() {
        return props["aria-labelledby"];
      },
    },
  };
}

export interface AriaStepProps {
  /** The key of this step. */
  key: Key;
}

export interface StepAria {
  /** Props for the step element (anchor/link). */
  stepProps: JSX.HTMLAttributes<HTMLAnchorElement>;
  /** Accessible text describing the step state. */
  stepStateText: string;
}

/**
 * Creates ARIA props for an individual step within a step list.
 */
export function createStep(props: AriaStepProps, state: StepListState): StepAria {
  const isSelected = () => state.selectedKey() === props.key;
  const isCompleted = () => state.isCompleted(props.key);
  const selectable = () => state.isSelectable(props.key);

  const getStepStateText = (): string => {
    if (isSelected()) return "Current";
    if (isCompleted()) return "Completed";
    return "Not completed";
  };

  const handleClick: JSX.EventHandler<HTMLAnchorElement, MouseEvent> = (e) => {
    e.preventDefault();
    if (selectable()) {
      state.setSelectedKey(props.key);
    }
  };

  const handleKeyDown: JSX.EventHandler<HTMLAnchorElement, KeyboardEvent> = (e) => {
    // Prevent arrow key scrolling — tab order handles navigation
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (selectable()) {
        state.setSelectedKey(props.key);
      }
    }
  };

  return {
    get stepProps() {
      return {
        role: "link" as const,
        get "aria-current"() {
          return isSelected() ? ("step" as const) : undefined;
        },
        get "aria-disabled"() {
          return !selectable() ? true : undefined;
        },
        get tabIndex() {
          return selectable() ? 0 : undefined;
        },
        onClick: handleClick,
        onKeyDown: handleKeyDown,
      };
    },
    get stepStateText() {
      return getStepStateText();
    },
  };
}
