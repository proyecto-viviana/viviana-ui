# Component Playbook

Read
[`docs/adr/0001-s2-styling-source-of-truth.md`](../../docs/adr/0001-s2-styling-source-of-truth.md)
first.

## Checklist

1. Use the real React Spectrum S2 component as the React reference.
2. Use `@proyecto-viviana/solid-spectrum` as the Solid side.
3. Implement styling through the S2-compatible style system.
4. Review the S2 source before implementing. Port real S2 wrapper structure,
   slots, state logic, overlay behavior, and temporal behavior when it exists;
   do not assume the component is only a headless reskin.
5. Do not add or tune app-local Spectrum component CSS.
6. If the Solid component is not migrated, mark it missing/gap.
7. Match S2 props and TypeScript names in controls and fixtures.
8. Cover light and dark themes.
9. Cover component-specific states before screenshots.
10. Compare DOM slots, state attributes, computed styles, geometry, behavior, and
    screenshots.
11. Commit snapshots only after the React and Solid implementations are both the
    intended references.

## Screenshot Rule

Screenshots validate implementation. They do not define implementation.

If a screenshot fails, inspect the S2 style declaration and Solid style-system
output before changing CSS.
