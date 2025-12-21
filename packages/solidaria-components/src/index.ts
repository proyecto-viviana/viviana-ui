/**
 * solidaria-components
 *
 * Pre-wired headless components for SolidJS.
 * Port of react-aria-components.
 *
 * These components combine state management + accessibility hooks into
 * ready-to-style components using the render props pattern and data attributes.
 */

// Utilities
export {
  type RenderChildren,
  type ClassNameOrFunction,
  type StyleOrFunction,
  type RenderPropsBase,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
  removeDataAttributes,
  createDataAttributes,
  dataAttr,
} from './utils';

// VisuallyHidden
export {
  VisuallyHidden,
  type VisuallyHiddenProps,
} from './VisuallyHidden';

// Button
export {
  Button,
  ButtonContext,
  type ButtonProps,
  type ButtonRenderProps,
} from './Button';

// Switch
export {
  Switch,
  SwitchContext,
  type SwitchProps,
  type SwitchRenderProps,
} from './Switch';

// Checkbox
export {
  Checkbox,
  CheckboxGroup,
  CheckboxContext,
  CheckboxGroupContext,
  CheckboxGroupStateContext,
  type CheckboxProps,
  type CheckboxRenderProps,
  type CheckboxGroupProps,
  type CheckboxGroupRenderProps,
} from './Checkbox';

// Radio
export {
  Radio,
  RadioGroup,
  RadioContext,
  RadioGroupContext,
  RadioGroupStateContext,
  type RadioProps,
  type RadioRenderProps,
  type RadioGroupProps,
  type RadioGroupRenderProps,
  type Orientation,
} from './RadioGroup';

// TextField
export {
  TextField,
  TextFieldContext,
  Label,
  Input,
  TextArea,
  type TextFieldProps,
  type TextFieldRenderProps,
  type TextFieldContextValue,
  type LabelProps,
  type InputProps,
  type TextAreaProps,
} from './TextField';
