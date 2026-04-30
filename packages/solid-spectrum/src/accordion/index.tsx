/**
 * Accordion module compatibility entrypoint for proyecto-viviana-solid-spectrum.
 */

export {
  DisclosureGroup as Accordion,
  Disclosure as AccordionItem,
  Disclosure,
  DisclosureTrigger as AccordionHeader,
  DisclosureTrigger as DisclosureTitle,
  DisclosurePanel as AccordionPanel,
  DisclosurePanel,
} from "../disclosure";
export type {
  DisclosureGroupProps as AccordionProps,
  DisclosureProps as AccordionItemProps,
  DisclosureProps,
  DisclosureTriggerProps as AccordionHeaderProps,
  DisclosureTriggerProps as DisclosureTitleProps,
  DisclosurePanelProps as AccordionPanelProps,
  DisclosurePanelProps,
  DisclosureSize as AccordionSize,
  DisclosureVariant as AccordionVariant,
} from "../disclosure";
