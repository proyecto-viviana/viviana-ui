/**
 * Creates state for a search field component.
 * Based on @react-stately/searchfield useSearchFieldState.
 */
import { type Accessor } from 'solid-js';
import { type MaybeAccessor } from '../utils';
export interface SearchFieldStateProps {
    /** The current value (controlled). */
    value?: string;
    /** The default value (uncontrolled). */
    defaultValue?: string;
    /** Handler that is called when the value changes. */
    onChange?: (value: string) => void;
}
export interface SearchFieldState {
    /** The current value of the search field. */
    value: Accessor<string>;
    /** Sets the value of the search field. */
    setValue: (value: string) => void;
}
/**
 * Provides state management for a search field.
 */
export declare function createSearchFieldState(props: MaybeAccessor<SearchFieldStateProps>): SearchFieldState;
//# sourceMappingURL=createSearchFieldState.d.ts.map