/**
 * Accordion module compatibility entrypoint for proyecto-viviana-ui.
 */

export {
  DisclosureGroup as Accordion,
  Disclosure as AccordionItem,
  DisclosureTrigger as AccordionHeader,
  DisclosurePanel as AccordionPanel,
} from '../disclosure';
export type {
  DisclosureGroupProps as AccordionProps,
  DisclosureProps as AccordionItemProps,
  DisclosureTriggerProps as AccordionHeaderProps,
  DisclosurePanelProps as AccordionPanelProps,
  DisclosureSize as AccordionSize,
  DisclosureVariant as AccordionVariant,
} from '../disclosure';

