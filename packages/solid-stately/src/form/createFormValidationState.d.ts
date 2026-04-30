/**
 * createFormValidationState for solid-stately
 *
 * Manages form validation state including realtime and displayed validation results.
 * Supports both ARIA (live) and native (on submit) validation behaviors.
 *
 * Port of react-stately's useFormValidationState.
 */
import { type Accessor } from "solid-js";
/** Standard HTML ValidityState interface. */
export interface ValidityState {
  badInput: boolean;
  customError: boolean;
  patternMismatch: boolean;
  rangeOverflow: boolean;
  rangeUnderflow: boolean;
  stepMismatch: boolean;
  tooLong: boolean;
  tooShort: boolean;
  typeMismatch: boolean;
  valueMissing: boolean;
  valid: boolean;
}
/** Result of validation. */
export interface ValidationResult {
  /** Whether the value is invalid. */
  isInvalid: boolean;
  /** Details about which validation constraints failed. */
  validationDetails: ValidityState;
  /** Error messages to display. */
  validationErrors: string[];
}
/** Map of field names to their validation errors. */
export type ValidationErrors = Record<string, string | string[]>;
/** Validation function that returns error messages or true/false. */
export type ValidationFunction<T> = (value: T) => boolean | string | string[] | null | undefined;
/** Validation behavior mode. */
export type ValidationBehavior = "aria" | "native";
export interface FormValidationProps<T> {
  /** Whether the value is invalid (controlled). */
  isInvalid?: boolean;
  /** @deprecated Use isInvalid instead. */
  validationState?: "valid" | "invalid";
  /** Custom validation function. */
  validate?: ValidationFunction<T>;
  /** Validation behavior: 'aria' for realtime, 'native' for on submit. */
  validationBehavior?: ValidationBehavior;
  /** Built-in validation result from native input. */
  builtinValidation?: ValidationResult;
  /** Field name(s) for server error lookup. */
  name?: string | string[];
  /** Current field value. */
  value: T | null;
}
export interface FormValidationState {
  /** Realtime validation results, updated as the user edits the value. */
  realtimeValidation: Accessor<ValidationResult>;
  /** Currently displayed validation results, updated when the user commits their changes. */
  displayValidation: Accessor<ValidationResult>;
  /** Updates the current validation result. Not displayed to the user until `commitValidation` is called. */
  updateValidation(result: ValidationResult): void;
  /** Resets the displayed validation state to valid when the user resets the form. */
  resetValidation(): void;
  /** Commits the realtime validation so it is displayed to the user. */
  commitValidation(): void;
}
/** A valid validity state. */
export declare const VALID_VALIDITY_STATE: ValidityState;
/** Default validation result (valid). */
export declare const DEFAULT_VALIDATION_RESULT: ValidationResult;
/** Context for server-side validation errors. */
export declare const FormValidationContext: import("solid-js").Context<ValidationErrors>;
/** Private prop key for passing validation state to children. */
export declare const privateValidationStateProp: string;
/**
 * Creates form validation state for a field.
 *
 * @example
 * ```tsx
 * const validationState = createFormValidationState({
 *   value: inputValue(),
 *   validate: (value) => {
 *     if (!value) return 'This field is required';
 *     if (value.length < 3) return 'Must be at least 3 characters';
 *     return null;
 *   },
 *   validationBehavior: 'aria',
 * });
 *
 * // Access validation state
 * const isInvalid = () => validationState.displayValidation().isInvalid;
 * const errors = () => validationState.displayValidation().validationErrors;
 * ```
 */
export declare function createFormValidationState<T>(
  props: FormValidationProps<T>,
): FormValidationState;
/**
 * Merges multiple validation results into one.
 */
export declare function mergeValidation(...results: ValidationResult[]): ValidationResult;
//# sourceMappingURL=createFormValidationState.d.ts.map
