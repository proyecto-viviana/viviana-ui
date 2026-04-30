/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { render } from "@solidjs/testing-library";
import { ColorSwatchPicker, ColorSwatchPickerItem } from "../src/color/ColorSwatchPicker";

describe("ColorSwatchPicker (solid-spectrum)", () => {
  describe("basic rendering", () => {
    it("renders a grid of swatches", () => {
      const { container } = render(() => (
        <ColorSwatchPicker>
          <ColorSwatchPickerItem color="#ff0000" />
          <ColorSwatchPickerItem color="#00ff00" />
          <ColorSwatchPickerItem color="#0000ff" />
        </ColorSwatchPicker>
      ));
      expect(container.firstElementChild).toBeInTheDocument();
      expect(container.firstElementChild!.className).toContain("flex");
      expect(container.firstElementChild!.className).toContain("flex-wrap");
    });

    it("renders correct number of swatch items", () => {
      const { container } = render(() => (
        <ColorSwatchPicker>
          <ColorSwatchPickerItem color="#ff0000" />
          <ColorSwatchPickerItem color="#00ff00" />
          <ColorSwatchPickerItem color="#0000ff" />
        </ColorSwatchPicker>
      ));
      const items = container.querySelectorAll(
        '.solidaria-ColorSwatchPickerItem, [class*="cursor-pointer"]',
      );
      expect(items.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("density variants", () => {
    it("applies compact density (gap-1)", () => {
      const { container } = render(() => (
        <ColorSwatchPicker density="compact">
          <ColorSwatchPickerItem color="#ff0000" />
        </ColorSwatchPicker>
      ));
      expect(container.firstElementChild!.className).toContain("gap-1");
    });

    it("applies regular density by default (gap-2)", () => {
      const { container } = render(() => (
        <ColorSwatchPicker>
          <ColorSwatchPickerItem color="#ff0000" />
        </ColorSwatchPicker>
      ));
      expect(container.firstElementChild!.className).toContain("gap-2");
    });

    it("applies spacious density (gap-4)", () => {
      const { container } = render(() => (
        <ColorSwatchPicker density="spacious">
          <ColorSwatchPickerItem color="#ff0000" />
        </ColorSwatchPicker>
      ));
      expect(container.firstElementChild!.className).toContain("gap-4");
    });
  });

  describe("size variants", () => {
    it("applies xs size to swatches", () => {
      const { container } = render(() => (
        <ColorSwatchPicker size="xs">
          <ColorSwatchPickerItem color="#ff0000" />
        </ColorSwatchPicker>
      ));
      const swatch = container.querySelector('[class*="w-5"]');
      expect(swatch).toBeInTheDocument();
    });

    it("applies md size by default", () => {
      const { container } = render(() => (
        <ColorSwatchPicker>
          <ColorSwatchPickerItem color="#ff0000" />
        </ColorSwatchPicker>
      ));
      const swatch = container.querySelector('[class*="w-8"]');
      expect(swatch).toBeInTheDocument();
    });

    it("applies lg size to swatches", () => {
      const { container } = render(() => (
        <ColorSwatchPicker size="lg">
          <ColorSwatchPickerItem color="#ff0000" />
        </ColorSwatchPicker>
      ));
      const swatch = container.querySelector('[class*="w-10"]');
      expect(swatch).toBeInTheDocument();
    });

    it("supports Spectrum size aliases (M/L)", () => {
      const { container: mediumContainer } = render(() => (
        <ColorSwatchPicker size="M">
          <ColorSwatchPickerItem color="#ff0000" />
        </ColorSwatchPicker>
      ));
      expect(mediumContainer.querySelector('[class*="w-8"]')).toBeInTheDocument();

      const { container: largeContainer } = render(() => (
        <ColorSwatchPicker size="L">
          <ColorSwatchPickerItem color="#ff0000" />
        </ColorSwatchPicker>
      ));
      expect(largeContainer.querySelector('[class*="w-10"]')).toBeInTheDocument();
    });
  });

  describe("rounding variants", () => {
    it("applies no rounding by default", () => {
      const { container } = render(() => (
        <ColorSwatchPicker>
          <ColorSwatchPickerItem color="#ff0000" />
        </ColorSwatchPicker>
      ));
      const swatch = container.querySelector('[class*="rounded-none"]');
      expect(swatch).toBeInTheDocument();
    });

    it("applies default rounding", () => {
      const { container } = render(() => (
        <ColorSwatchPicker rounding="default">
          <ColorSwatchPickerItem color="#ff0000" />
        </ColorSwatchPicker>
      ));
      // Check that rounded class exists (but not rounded-none or rounded-full)
      const allElements = container.querySelectorAll("*");
      let hasDefaultRounding = false;
      allElements.forEach((el) => {
        if (
          el.className &&
          typeof el.className === "string" &&
          el.className.includes("rounded") &&
          !el.className.includes("rounded-none") &&
          !el.className.includes("rounded-full")
        ) {
          hasDefaultRounding = true;
        }
      });
      expect(hasDefaultRounding).toBe(true);
    });

    it("applies full rounding", () => {
      const { container } = render(() => (
        <ColorSwatchPicker rounding="full">
          <ColorSwatchPickerItem color="#ff0000" />
        </ColorSwatchPicker>
      ));
      const swatch = container.querySelector('[class*="rounded-full"]');
      expect(swatch).toBeInTheDocument();
    });
  });

  describe("custom class", () => {
    it("applies custom class to container", () => {
      const { container } = render(() => (
        <ColorSwatchPicker class="my-custom-class">
          <ColorSwatchPickerItem color="#ff0000" />
        </ColorSwatchPicker>
      ));
      expect(container.firstElementChild!.className).toContain("my-custom-class");
    });
  });
});
