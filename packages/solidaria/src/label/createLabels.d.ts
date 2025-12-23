/**
 * Labels utility for Solidaria
 *
 * Merges aria-label and aria-labelledby into aria-labelledby when both exist.
 *
 * This is a 1:1 port of @react-aria/utils's useLabels hook.
 */
import type { AriaLabelingProps, DOMProps } from './createLabel';
/**
 * Merges aria-label and aria-labelledby into aria-labelledby when both exist.
 *
 * @param props - Aria label props.
 * @param defaultLabel - Default value for aria-label when not present.
 */
export declare function createLabels(props: DOMProps & AriaLabelingProps, defaultLabel?: string): DOMProps & AriaLabelingProps;
//# sourceMappingURL=createLabels.d.ts.map