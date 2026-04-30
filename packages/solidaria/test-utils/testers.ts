/**
 * Component testers
 *
 * Pre-built test helpers for common component patterns.
 * These testers encapsulate common testing scenarios for accessibility.
 */

import { screen, within } from "@solidjs/testing-library";
import type { UserEventInstance } from "./interactions";
import { setupUser, pressKey } from "./interactions";
import {
  isAriaDisabled,
  isAriaPressed,
  isAriaChecked,
  isAriaExpanded,
  isAriaSelected,
  getAriaRole,
} from "./aria";
import { isFocused, isFocusWithin } from "./focus";

/**
 * Button tester interface
 */
export interface ButtonTester {
  /** The button element */
  element: HTMLElement;
  /** Check if button is pressed (for toggle buttons) */
  isPressed(): boolean | "mixed" | null;
  /** Check if button is disabled */
  isDisabled(): boolean;
  /** Click the button */
  press(): Promise<void>;
  /** Check if button is focused */
  isFocused(): boolean;
  /** Focus the button */
  focus(): void;
}

/**
 * Create a tester for button components.
 *
 * @example
 * ```ts
 * const button = createButtonTester(screen.getByRole('button'));
 * expect(button.isDisabled()).toBe(false);
 * await button.press();
 * expect(onPress).toHaveBeenCalled();
 * ```
 */
export function createButtonTester(element: HTMLElement, user?: UserEventInstance): ButtonTester {
  const userInstance = user || setupUser();

  return {
    element,
    isPressed() {
      return isAriaPressed(element);
    },
    isDisabled() {
      return isAriaDisabled(element);
    },
    async press() {
      await userInstance.click(element);
    },
    isFocused() {
      return isFocused(element);
    },
    focus() {
      element.focus();
    },
  };
}

/**
 * Checkbox tester interface
 */
export interface CheckboxTester {
  /** The checkbox element */
  element: HTMLElement;
  /** Check if checkbox is checked */
  isChecked(): boolean | "mixed" | null;
  /** Check if checkbox is disabled */
  isDisabled(): boolean;
  /** Toggle the checkbox */
  toggle(): Promise<void>;
  /** Check if checkbox is focused */
  isFocused(): boolean;
  /** Focus the checkbox */
  focus(): void;
}

/**
 * Create a tester for checkbox components.
 *
 * @example
 * ```ts
 * const checkbox = createCheckboxTester(screen.getByRole('checkbox'));
 * expect(checkbox.isChecked()).toBe(false);
 * await checkbox.toggle();
 * expect(checkbox.isChecked()).toBe(true);
 * ```
 */
export function createCheckboxTester(
  element: HTMLElement,
  user?: UserEventInstance,
): CheckboxTester {
  const userInstance = user || setupUser();

  return {
    element,
    isChecked() {
      return isAriaChecked(element);
    },
    isDisabled() {
      return isAriaDisabled(element);
    },
    async toggle() {
      await userInstance.click(element);
    },
    isFocused() {
      return isFocused(element);
    },
    focus() {
      element.focus();
    },
  };
}

/**
 * Radio group tester interface
 */
export interface RadioGroupTester {
  /** The radio group element */
  element: HTMLElement;
  /** Get all radio buttons in the group */
  getRadios(): HTMLElement[];
  /** Get the selected radio button */
  getSelected(): HTMLElement | null;
  /** Get the value of the selected radio */
  getSelectedValue(): string | null;
  /** Select a radio by value */
  select(value: string): Promise<void>;
  /** Check if a specific radio is disabled */
  isRadioDisabled(value: string): boolean;
  /** Navigate to next radio with arrow keys */
  navigateNext(): Promise<void>;
  /** Navigate to previous radio with arrow keys */
  navigatePrevious(): Promise<void>;
}

/**
 * Create a tester for radio group components.
 *
 * @example
 * ```ts
 * const radioGroup = createRadioGroupTester(screen.getByRole('radiogroup'));
 * expect(radioGroup.getSelectedValue()).toBe(null);
 * await radioGroup.select('option1');
 * expect(radioGroup.getSelectedValue()).toBe('option1');
 * ```
 */
export function createRadioGroupTester(
  element: HTMLElement,
  user?: UserEventInstance,
): RadioGroupTester {
  const userInstance = user || setupUser();

  return {
    element,
    getRadios() {
      return within(element).getAllByRole("radio");
    },
    getSelected() {
      const radios = this.getRadios();
      return radios.find((r) => isAriaChecked(r) === true) || null;
    },
    getSelectedValue() {
      const selected = this.getSelected();
      return selected?.getAttribute("value") || null;
    },
    async select(value: string) {
      const radios = this.getRadios();
      const target = radios.find((r) => r.getAttribute("value") === value);
      if (target) {
        await userInstance.click(target);
      }
    },
    isRadioDisabled(value: string) {
      const radios = this.getRadios();
      const target = radios.find((r) => r.getAttribute("value") === value);
      return target ? isAriaDisabled(target) : false;
    },
    async navigateNext() {
      await pressKey(userInstance, "ArrowDown");
    },
    async navigatePrevious() {
      await pressKey(userInstance, "ArrowUp");
    },
  };
}

/**
 * ListBox tester interface
 */
export interface ListBoxTester {
  /** The listbox element */
  element: HTMLElement;
  /** Get all options in the listbox */
  getOptions(): HTMLElement[];
  /** Get the selected option(s) */
  getSelected(): HTMLElement[];
  /** Get the selected value(s) */
  getSelectedValues(): string[];
  /** Select an option by value */
  select(value: string): Promise<void>;
  /** Check if an option is disabled */
  isOptionDisabled(value: string): boolean;
  /** Navigate to next option with arrow keys */
  navigateNext(): Promise<void>;
  /** Navigate to previous option with arrow keys */
  navigatePrevious(): Promise<void>;
  /** Navigate to first option */
  navigateFirst(): Promise<void>;
  /** Navigate to last option */
  navigateLast(): Promise<void>;
}

/**
 * Create a tester for listbox components.
 */
export function createListBoxTester(element: HTMLElement, user?: UserEventInstance): ListBoxTester {
  const userInstance = user || setupUser();

  return {
    element,
    getOptions() {
      return within(element).getAllByRole("option");
    },
    getSelected() {
      return this.getOptions().filter((o) => isAriaSelected(o));
    },
    getSelectedValues() {
      return this.getSelected().map((o) => o.getAttribute("data-value") || o.textContent || "");
    },
    async select(value: string) {
      const options = this.getOptions();
      const target = options.find(
        (o) => o.getAttribute("data-value") === value || o.textContent === value,
      );
      if (target) {
        await userInstance.click(target);
      }
    },
    isOptionDisabled(value: string) {
      const options = this.getOptions();
      const target = options.find(
        (o) => o.getAttribute("data-value") === value || o.textContent === value,
      );
      return target ? isAriaDisabled(target) : false;
    },
    async navigateNext() {
      await pressKey(userInstance, "ArrowDown");
    },
    async navigatePrevious() {
      await pressKey(userInstance, "ArrowUp");
    },
    async navigateFirst() {
      await pressKey(userInstance, "Home");
    },
    async navigateLast() {
      await pressKey(userInstance, "End");
    },
  };
}

/**
 * Menu tester interface
 */
export interface MenuTester {
  /** The menu element */
  element: HTMLElement;
  /** Get all menu items */
  getItems(): HTMLElement[];
  /** Get a menu item by text */
  getItem(text: string): HTMLElement | null;
  /** Select a menu item by text */
  select(text: string): Promise<void>;
  /** Check if menu is open */
  isOpen(): boolean;
  /** Navigate to next item */
  navigateNext(): Promise<void>;
  /** Navigate to previous item */
  navigatePrevious(): Promise<void>;
  /** Close the menu */
  close(): Promise<void>;
}

/**
 * Create a tester for menu components.
 */
export function createMenuTester(element: HTMLElement, user?: UserEventInstance): MenuTester {
  const userInstance = user || setupUser();

  return {
    element,
    getItems() {
      return within(element).getAllByRole("menuitem");
    },
    getItem(text: string) {
      try {
        return within(element).getByText(text);
      } catch {
        return null;
      }
    },
    async select(text: string) {
      const item = this.getItem(text);
      if (item) {
        await userInstance.click(item);
      }
    },
    isOpen() {
      // Check if menu is visible in the DOM
      return element.offsetParent !== null || getComputedStyle(element).display !== "none";
    },
    async navigateNext() {
      await pressKey(userInstance, "ArrowDown");
    },
    async navigatePrevious() {
      await pressKey(userInstance, "ArrowUp");
    },
    async close() {
      await pressKey(userInstance, "Escape");
    },
  };
}

/**
 * Select tester interface
 */
export interface SelectTester {
  /** The select trigger element */
  trigger: HTMLElement;
  /** Get the listbox element (when open) */
  getListBox(): HTMLElement | null;
  /** Check if select is open */
  isOpen(): boolean;
  /** Open the select */
  open(): Promise<void>;
  /** Close the select */
  close(): Promise<void>;
  /** Get the selected value */
  getSelectedValue(): string | null;
  /** Select an option by value */
  select(value: string): Promise<void>;
  /** Check if select is disabled */
  isDisabled(): boolean;
}

/**
 * Create a tester for select components.
 */
export function createSelectTester(trigger: HTMLElement, user?: UserEventInstance): SelectTester {
  const userInstance = user || setupUser();

  return {
    trigger,
    getListBox() {
      try {
        return screen.getByRole("listbox");
      } catch {
        return null;
      }
    },
    isOpen() {
      return isAriaExpanded(trigger) === true;
    },
    async open() {
      if (!this.isOpen()) {
        await userInstance.click(trigger);
      }
    },
    async close() {
      if (this.isOpen()) {
        await pressKey(userInstance, "Escape");
      }
    },
    getSelectedValue() {
      // Look for a value indicator in the trigger
      const valueElement = trigger.querySelector("[data-value]");
      return valueElement?.getAttribute("data-value") || trigger.textContent?.trim() || null;
    },
    async select(value: string) {
      await this.open();
      const listbox = this.getListBox();
      if (listbox) {
        const option = within(listbox).getByText(value);
        await userInstance.click(option);
      }
    },
    isDisabled() {
      return isAriaDisabled(trigger);
    },
  };
}

/**
 * Tabs tester interface
 */
export interface TabsTester {
  /** The tablist element */
  element: HTMLElement;
  /** Get all tabs */
  getTabs(): HTMLElement[];
  /** Get the selected tab */
  getSelectedTab(): HTMLElement | null;
  /** Get the selected tab's value/id */
  getSelectedValue(): string | null;
  /** Select a tab by value/text */
  select(value: string): Promise<void>;
  /** Navigate to next tab */
  navigateNext(): Promise<void>;
  /** Navigate to previous tab */
  navigatePrevious(): Promise<void>;
  /** Navigate to first tab */
  navigateFirst(): Promise<void>;
  /** Navigate to last tab */
  navigateLast(): Promise<void>;
  /** Get the tab panel for a specific tab */
  getTabPanel(tabValue: string): HTMLElement | null;
}

/**
 * Create a tester for tabs components.
 */
export function createTabsTester(element: HTMLElement, user?: UserEventInstance): TabsTester {
  const userInstance = user || setupUser();

  return {
    element,
    getTabs() {
      return within(element).getAllByRole("tab");
    },
    getSelectedTab() {
      const tabs = this.getTabs();
      return tabs.find((t) => isAriaSelected(t)) || null;
    },
    getSelectedValue() {
      const selected = this.getSelectedTab();
      return selected?.getAttribute("data-value") || selected?.id || null;
    },
    async select(value: string) {
      const tabs = this.getTabs();
      const target = tabs.find(
        (t) => t.getAttribute("data-value") === value || t.textContent === value || t.id === value,
      );
      if (target) {
        await userInstance.click(target);
      }
    },
    async navigateNext() {
      await pressKey(userInstance, "ArrowRight");
    },
    async navigatePrevious() {
      await pressKey(userInstance, "ArrowLeft");
    },
    async navigateFirst() {
      await pressKey(userInstance, "Home");
    },
    async navigateLast() {
      await pressKey(userInstance, "End");
    },
    getTabPanel(tabValue: string) {
      const tabs = this.getTabs();
      const tab = tabs.find(
        (t) => t.getAttribute("data-value") === tabValue || t.textContent === tabValue,
      );
      if (!tab) return null;

      const panelId = tab.getAttribute("aria-controls");
      if (!panelId) return null;

      return document.getElementById(panelId);
    },
  };
}

/**
 * Dialog tester interface
 */
export interface DialogTester {
  /** The dialog element */
  element: HTMLElement;
  /** Check if dialog is open */
  isOpen(): boolean;
  /** Check if dialog has focus or contains focus */
  hasFocus(): boolean;
  /** Get the dialog title */
  getTitle(): string | null;
  /** Close the dialog with Escape */
  close(): Promise<void>;
  /** Find an element within the dialog */
  find(text: string): HTMLElement | null;
  /** Click a button in the dialog */
  clickButton(text: string): Promise<void>;
}

/**
 * Create a tester for dialog components.
 */
export function createDialogTester(element: HTMLElement, user?: UserEventInstance): DialogTester {
  const userInstance = user || setupUser();

  return {
    element,
    isOpen() {
      const role = getAriaRole(element);
      const isDialog = role === "dialog" || role === "alertdialog";
      const isVisible =
        element.offsetParent !== null || getComputedStyle(element).display !== "none";
      return isDialog && isVisible;
    },
    hasFocus() {
      return isFocusWithin(element);
    },
    getTitle() {
      // Check aria-labelledby
      const labelledBy = element.getAttribute("aria-labelledby");
      if (labelledBy) {
        const titleElement = document.getElementById(labelledBy);
        return titleElement?.textContent || null;
      }

      // Check aria-label
      return element.getAttribute("aria-label");
    },
    async close() {
      await pressKey(userInstance, "Escape");
    },
    find(text: string) {
      try {
        return within(element).getByText(text);
      } catch {
        return null;
      }
    },
    async clickButton(text: string) {
      const button = within(element).getByRole("button", { name: text });
      await userInstance.click(button);
    },
  };
}
