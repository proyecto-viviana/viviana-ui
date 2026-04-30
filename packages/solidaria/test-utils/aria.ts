/**
 * ARIA testing utilities
 *
 * Helpers for querying and asserting ARIA attributes on elements.
 */

/**
 * State of an ARIA-enabled element
 */
export interface AriaState {
  role: string | null;
  label: string | null;
  labelledBy: string | null;
  describedBy: string | null;
  disabled: boolean;
  expanded: boolean | null;
  pressed: boolean | "mixed" | null;
  checked: boolean | "mixed" | null;
  selected: boolean;
  required: boolean;
  invalid: boolean | "grammar" | "spelling";
  hidden: boolean;
  busy: boolean;
  controls: string | null;
  owns: string | null;
  activeDescendant: string | null;
  level: number | null;
  setSize: number | null;
  posInSet: number | null;
  valueNow: number | null;
  valueMin: number | null;
  valueMax: number | null;
  valueText: string | null;
}

/**
 * Get the ARIA role of an element.
 * Checks both explicit role attribute and implicit semantic role.
 */
export function getAriaRole(element: Element): string | null {
  // Explicit role
  const explicitRole = element.getAttribute("role");
  if (explicitRole) return explicitRole;

  // Implicit roles based on tag name
  const tagName = element.tagName.toLowerCase();
  const implicitRoles: Record<string, string> = {
    button: "button",
    a: element.hasAttribute("href") ? "link" : "",
    input: getInputRole(element as HTMLInputElement),
    select: "combobox",
    textarea: "textbox",
    article: "article",
    aside: "complementary",
    footer: "contentinfo",
    header: "banner",
    main: "main",
    nav: "navigation",
    section:
      element.hasAttribute("aria-label") || element.hasAttribute("aria-labelledby") ? "region" : "",
    form:
      element.hasAttribute("aria-label") || element.hasAttribute("aria-labelledby") ? "form" : "",
    table: "table",
    thead: "rowgroup",
    tbody: "rowgroup",
    tfoot: "rowgroup",
    tr: "row",
    th: "columnheader",
    td: "cell",
    ul: "list",
    ol: "list",
    li: "listitem",
    dl: "list",
    dt: "term",
    dd: "definition",
    img: element.getAttribute("alt") === "" ? "presentation" : "img",
    hr: "separator",
    dialog: "dialog",
    meter: "meter",
    progress: "progressbar",
    option: "option",
    optgroup: "group",
    datalist: "listbox",
    details: "group",
    summary: "button",
    menu: "list",
    menuitem: "menuitem",
  };

  return implicitRoles[tagName] || null;
}

function getInputRole(input: HTMLInputElement): string {
  const type = input.type.toLowerCase();
  const inputRoles: Record<string, string> = {
    button: "button",
    checkbox: "checkbox",
    email: "textbox",
    image: "button",
    number: "spinbutton",
    radio: "radio",
    range: "slider",
    reset: "button",
    search: "searchbox",
    submit: "button",
    tel: "textbox",
    text: "textbox",
    url: "textbox",
  };
  return inputRoles[type] || "textbox";
}

/**
 * Check if an element has an accessible label.
 */
export function hasAriaLabel(element: Element): boolean {
  return getAriaLabel(element) !== null;
}

/**
 * Get the accessible label of an element.
 * Checks aria-label, aria-labelledby, and native label associations.
 */
export function getAriaLabel(element: Element): string | null {
  // aria-label takes precedence
  const ariaLabel = element.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel;

  // aria-labelledby
  const labelledBy = element.getAttribute("aria-labelledby");
  if (labelledBy) {
    const labels = labelledBy
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent)
      .filter(Boolean);
    if (labels.length > 0) return labels.join(" ");
  }

  // Native label association for form elements
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  ) {
    const id = element.id;
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) return label.textContent;
    }
    // Wrapped in label
    const parentLabel = element.closest("label");
    if (parentLabel) return parentLabel.textContent;
  }

  // Button/link text content
  if (element instanceof HTMLButtonElement || element instanceof HTMLAnchorElement) {
    return element.textContent;
  }

  return null;
}

/**
 * Get the aria-describedby attribute value.
 */
export function getAriaDescribedBy(element: Element): string | null {
  return element.getAttribute("aria-describedby");
}

/**
 * Get the aria-labelledby attribute value.
 */
export function getAriaLabelledBy(element: Element): string | null {
  return element.getAttribute("aria-labelledby");
}

/**
 * Check if an element is disabled via aria-disabled or native disabled.
 */
export function isAriaDisabled(element: Element): boolean {
  if (element.getAttribute("aria-disabled") === "true") return true;
  if ((element as HTMLButtonElement).disabled) return true;
  return false;
}

/**
 * Get the expanded state of an element.
 * Returns null if aria-expanded is not set.
 */
export function isAriaExpanded(element: Element): boolean | null {
  const value = element.getAttribute("aria-expanded");
  if (value === null) return null;
  return value === "true";
}

/**
 * Get the pressed state of an element.
 * Returns null if aria-pressed is not set.
 */
export function isAriaPressed(element: Element): boolean | "mixed" | null {
  const value = element.getAttribute("aria-pressed");
  if (value === null) return null;
  if (value === "mixed") return "mixed";
  return value === "true";
}

/**
 * Get the checked state of an element.
 * Returns null if aria-checked is not set.
 */
export function isAriaChecked(element: Element): boolean | "mixed" | null {
  const value = element.getAttribute("aria-checked");
  if (value === null) {
    // Check native checked for inputs
    if (
      element instanceof HTMLInputElement &&
      (element.type === "checkbox" || element.type === "radio")
    ) {
      return element.checked;
    }
    return null;
  }
  if (value === "mixed") return "mixed";
  return value === "true";
}

/**
 * Check if an element is selected.
 */
export function isAriaSelected(element: Element): boolean {
  return element.getAttribute("aria-selected") === "true";
}

/**
 * Check if an element is required.
 */
export function isAriaRequired(element: Element): boolean {
  if (element.getAttribute("aria-required") === "true") return true;
  if ((element as HTMLInputElement).required) return true;
  return false;
}

/**
 * Get the invalid state of an element.
 */
export function isAriaInvalid(element: Element): boolean | "grammar" | "spelling" {
  const value = element.getAttribute("aria-invalid");
  if (value === "grammar") return "grammar";
  if (value === "spelling") return "spelling";
  if (value === "true") return true;
  return false;
}

/**
 * Check if an element is hidden from assistive technology.
 */
export function isAriaHidden(element: Element): boolean {
  return element.getAttribute("aria-hidden") === "true";
}

/**
 * Check if an element is in a busy state.
 */
export function isAriaBusy(element: Element): boolean {
  return element.getAttribute("aria-busy") === "true";
}

/**
 * Get the aria-controls attribute value.
 */
export function getAriaControls(element: Element): string | null {
  return element.getAttribute("aria-controls");
}

/**
 * Get the aria-owns attribute value.
 */
export function getAriaOwns(element: Element): string | null {
  return element.getAttribute("aria-owns");
}

/**
 * Get the aria-activedescendant attribute value.
 */
export function getAriaActiveDescendant(element: Element): string | null {
  return element.getAttribute("aria-activedescendant");
}

/**
 * Get the aria-valuenow attribute value.
 */
export function getAriaValueNow(element: Element): number | null {
  const value = element.getAttribute("aria-valuenow");
  return value !== null ? parseFloat(value) : null;
}

/**
 * Get the aria-valuemin attribute value.
 */
export function getAriaValueMin(element: Element): number | null {
  const value = element.getAttribute("aria-valuemin");
  return value !== null ? parseFloat(value) : null;
}

/**
 * Get the aria-valuemax attribute value.
 */
export function getAriaValueMax(element: Element): number | null {
  const value = element.getAttribute("aria-valuemax");
  return value !== null ? parseFloat(value) : null;
}

/**
 * Get the aria-valuetext attribute value.
 */
export function getAriaValueText(element: Element): string | null {
  return element.getAttribute("aria-valuetext");
}

/**
 * Get the aria-level attribute value.
 */
export function getAriaLevel(element: Element): number | null {
  const value = element.getAttribute("aria-level");
  return value !== null ? parseInt(value, 10) : null;
}

/**
 * Get the aria-setsize attribute value.
 */
export function getAriaSetSize(element: Element): number | null {
  const value = element.getAttribute("aria-setsize");
  return value !== null ? parseInt(value, 10) : null;
}

/**
 * Get the aria-posinset attribute value.
 */
export function getAriaPosInSet(element: Element): number | null {
  const value = element.getAttribute("aria-posinset");
  return value !== null ? parseInt(value, 10) : null;
}

/**
 * Get the complete ARIA state of an element.
 */
export function getAriaState(element: Element): AriaState {
  return {
    role: getAriaRole(element),
    label: getAriaLabel(element),
    labelledBy: getAriaLabelledBy(element),
    describedBy: getAriaDescribedBy(element),
    disabled: isAriaDisabled(element),
    expanded: isAriaExpanded(element),
    pressed: isAriaPressed(element),
    checked: isAriaChecked(element),
    selected: isAriaSelected(element),
    required: isAriaRequired(element),
    invalid: isAriaInvalid(element),
    hidden: isAriaHidden(element),
    busy: isAriaBusy(element),
    controls: getAriaControls(element),
    owns: getAriaOwns(element),
    activeDescendant: getAriaActiveDescendant(element),
    level: getAriaLevel(element),
    setSize: getAriaSetSize(element),
    posInSet: getAriaPosInSet(element),
    valueNow: getAriaValueNow(element),
    valueMin: getAriaValueMin(element),
    valueMax: getAriaValueMax(element),
    valueText: getAriaValueText(element),
  };
}

/**
 * Assert that an element has a specific role.
 */
export function assertAriaRole(element: Element, expectedRole: string): void {
  const actualRole = getAriaRole(element);
  if (actualRole !== expectedRole) {
    throw new Error(`Expected element to have role "${expectedRole}", but got "${actualRole}"`);
  }
}

/**
 * Assert that an element has an accessible label.
 */
export function assertHasAriaLabel(element: Element): void {
  if (!hasAriaLabel(element)) {
    throw new Error("Expected element to have an accessible label");
  }
}

/**
 * Assert that an element is accessible (has role and label).
 */
export function assertAccessible(element: Element): void {
  const role = getAriaRole(element);
  if (!role) {
    throw new Error("Expected element to have an ARIA role");
  }

  // Interactive elements should have labels
  const interactiveRoles = [
    "button",
    "link",
    "checkbox",
    "radio",
    "textbox",
    "combobox",
    "listbox",
    "menu",
    "menuitem",
    "slider",
    "spinbutton",
    "switch",
    "tab",
  ];
  if (interactiveRoles.includes(role) && !hasAriaLabel(element)) {
    throw new Error(`Interactive element with role "${role}" should have an accessible label`);
  }
}
