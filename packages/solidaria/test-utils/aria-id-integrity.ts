/**
 * ARIA ID integrity checker (INFRA-3)
 *
 * Scans ARIA referencing attributes and verifies every referenced ID exists
 * in the document. Catches dangling aria-labelledby, aria-controls, etc.
 */

/** Attributes that reference element IDs (space-separated ID lists) */
const ARIA_ID_ATTRIBUTES = [
  'aria-labelledby',
  'aria-controls',
  'aria-describedby',
  'aria-owns',
  'aria-activedescendant',
  'aria-errormessage',
  'for',
] as const;

export interface DanglingRef {
  element: Element;
  attribute: string;
  missingId: string;
}

export interface AriaIdIntegrityResult {
  danglingRefs: DanglingRef[];
  totalRefsChecked: number;
  ok: boolean;
}

/**
 * Check all ARIA ID references within a container.
 *
 * @example
 * ```ts
 * const result = checkAriaIdIntegrity(container);
 * expect(result.ok).toBe(true);
 * ```
 */
export function checkAriaIdIntegrity(
  container: Element = document.body,
): AriaIdIntegrityResult {
  const danglingRefs: DanglingRef[] = [];
  let totalRefsChecked = 0;

  for (const attr of ARIA_ID_ATTRIBUTES) {
    const selector = `[${attr}]`;
    const elements = container.querySelectorAll(selector);

    for (const element of elements) {
      const value = element.getAttribute(attr);
      if (!value) continue;

      // aria-activedescendant is a single ID; others can be space-separated lists
      const ids = attr === 'aria-activedescendant' ? [value] : value.split(/\s+/).filter(Boolean);

      for (const id of ids) {
        totalRefsChecked++;
        if (!document.getElementById(id)) {
          danglingRefs.push({ element, attribute: attr, missingId: id });
        }
      }
    }
  }

  return {
    danglingRefs,
    totalRefsChecked,
    ok: danglingRefs.length === 0,
  };
}

function formatDanglingRefs(refs: DanglingRef[]): string {
  const lines: string[] = [`${refs.length} dangling ARIA ID reference(s):\n`];
  for (const ref of refs) {
    const tag = ref.element.tagName.toLowerCase();
    const id = ref.element.id ? `#${ref.element.id}` : '';
    const role = ref.element.getAttribute('role') || '';
    const desc = [tag, id, role ? `[role="${role}"]` : ''].filter(Boolean).join('');
    lines.push(`  ${desc} → ${ref.attribute}="${ref.missingId}" (missing)`);
  }
  return lines.join('\n');
}

/**
 * Assert that all ARIA ID references resolve to existing elements.
 * Throws with a formatted list of dangling references on failure.
 *
 * @example
 * ```ts
 * assertAriaIdIntegrity(container);
 * ```
 */
export function assertAriaIdIntegrity(
  container: Element = document.body,
): void {
  const result = checkAriaIdIntegrity(container);
  if (!result.ok) {
    throw new Error(formatDanglingRefs(result.danglingRefs));
  }
}
