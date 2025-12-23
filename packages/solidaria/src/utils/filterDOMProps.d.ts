/**
 * filterDOMProps for Solidaria
 *
 * Filters out all props that aren't valid DOM props.
 * This is a 1:1 port of @react-aria/utils filterDOMProps.
 */
export interface FilterDOMPropsOptions {
    /**
     * If labelling associated aria properties should be included in the filter.
     */
    labelable?: boolean;
    /** Whether the element is a link and should include DOM props for <a> elements. */
    isLink?: boolean;
    /** Whether to include global DOM attributes. */
    global?: boolean;
    /** Whether to include DOM events. */
    events?: boolean;
    /**
     * A Set of other property names that should be included in the filter.
     */
    propNames?: Set<string>;
}
/**
 * Filters out all props that aren't valid DOM props or defined via override prop obj.
 * @param props - The component props to be filtered.
 * @param opts - Props to override.
 */
export declare function filterDOMProps(props: Record<string, unknown>, opts?: FilterDOMPropsOptions): Record<string, unknown>;
//# sourceMappingURL=filterDOMProps.d.ts.map