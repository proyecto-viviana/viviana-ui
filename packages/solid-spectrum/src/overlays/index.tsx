/**
 * Overlays module compatibility entrypoint for proyecto-viviana-solid-spectrum.
 */

export {
  Dialog,
  DialogTrigger,
  DialogFooter,
} from '../dialog';
export type {
  DialogProps,
  DialogTriggerProps,
  DialogFooterProps,
  DialogSize,
} from '../dialog';

export {
  Popover,
  PopoverTrigger,
  PopoverHeader,
  PopoverFooter,
} from '../popover';
export type {
  PopoverProps,
  PopoverTriggerProps,
  PopoverHeaderProps,
  PopoverFooterProps,
  PopoverPlacement,
  PopoverSize,
  PopoverRenderProps,
} from '../popover';

export {
  Tooltip,
  TooltipTrigger,
  SimpleTooltip,
} from '../tooltip';
export type {
  TooltipProps,
  TooltipTriggerProps,
  TooltipPlacement,
  TooltipVariant,
  SimpleTooltipProps,
} from '../tooltip';

export { StyledModal, StyledModal as Modal } from './Modal';
export type { StyledModalProps, ModalSize } from './Modal';
export { Overlay } from './Overlay';
export type { OverlayProps } from './Overlay';
export { Tray } from './Tray';
export type { TrayProps } from './Tray';

export { OpenTransition } from './OpenTransition';
export type { OpenTransitionProps } from './OpenTransition';

