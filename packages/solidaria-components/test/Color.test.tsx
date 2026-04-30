/**
 * Color component tests
 *
 * Tests for ColorSlider, ColorArea, ColorWheel, ColorField, and ColorSwatch.
 */

import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@solidjs/testing-library";
import { createSignal, useContext } from "solid-js";
import {
  ColorSlider,
  ColorSliderContext,
  ColorSliderTrack,
  ColorSliderThumb,
  ColorArea,
  ColorAreaGradient,
  ColorAreaThumb,
  ColorWheel,
  ColorWheelTrack,
  ColorWheelThumb,
  ColorField,
  ColorFieldInput,
  ColorSwatch,
  ColorPicker,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "../src/Color";
import { parseColor } from "@proyecto-viviana/solid-stately";

// Helper components using render props pattern
function TestColorSlider(props: Parameters<typeof ColorSlider>[0]) {
  return (
    <ColorSlider {...props}>
      {() => <ColorSliderTrack>{() => <ColorSliderThumb />}</ColorSliderTrack>}
    </ColorSlider>
  );
}

function DragStateTrigger() {
  const context = useContext(ColorSliderContext);
  if (!context) return null;
  return (
    <button type="button" onClick={() => context.state.setDragging(true)}>
      Start drag
    </button>
  );
}

function TestColorArea(props: Parameters<typeof ColorArea>[0]) {
  return (
    <ColorArea {...props}>
      {() => (
        <>
          <ColorAreaGradient />
          <ColorAreaThumb />
        </>
      )}
    </ColorArea>
  );
}

function TestColorWheel(props: Parameters<typeof ColorWheel>[0]) {
  return (
    <ColorWheel {...props}>
      {() => <ColorWheelTrack>{() => <ColorWheelThumb />}</ColorWheelTrack>}
    </ColorWheel>
  );
}

function TestColorField(props: Parameters<typeof ColorField>[0]) {
  return <ColorField {...props}>{() => <ColorFieldInput />}</ColorField>;
}

function TestColorSwatchPicker(props: Parameters<typeof ColorSwatchPicker>[0]) {
  return (
    <ColorSwatchPicker {...props}>
      <ColorSwatchPickerItem color="#ff0000" />
      <ColorSwatchPickerItem color="#00ff00" />
      <ColorSwatchPickerItem color="#0000ff" />
    </ColorSwatchPicker>
  );
}

function TestColorSwatchPickerFourItems(props: Parameters<typeof ColorSwatchPicker>[0]) {
  return (
    <ColorSwatchPicker {...props}>
      <ColorSwatchPickerItem color="#ff0000" />
      <ColorSwatchPickerItem color="#00ff00" />
      <ColorSwatchPickerItem color="#0000ff" />
      <ColorSwatchPickerItem color="#ffff00" />
    </ColorSwatchPicker>
  );
}

function createMockRect(x: number, y: number, size = 16): DOMRect {
  return {
    x,
    y,
    width: size,
    height: size,
    top: y,
    left: x,
    right: x + size,
    bottom: y + size,
    toJSON() {
      return {};
    },
  } as DOMRect;
}

function mockGridOptionRects(options: HTMLElement[], columns: number) {
  const size = 16;
  const gap = 4;
  options.forEach((option, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = column * (size + gap);
    const y = row * (size + gap);
    Object.defineProperty(option, "getBoundingClientRect", {
      configurable: true,
      value: () => createMockRect(x, y, size),
    });
  });
}

describe("Color Components", () => {
  afterEach(() => {
    cleanup();
  });

  // ============================================
  // COLOR SLIDER
  // ============================================

  describe("ColorSlider", () => {
    describe("rendering", () => {
      it("should render with default class", () => {
        render(() => (
          <TestColorSlider
            channel="hue"
            defaultValue={parseColor("hsl(0, 100%, 50%)")}
            aria-label="Hue"
          />
        ));

        const slider = document.querySelector(".solidaria-ColorSlider");
        expect(slider).toBeTruthy();
      });

      it("should render with custom class", () => {
        render(() => (
          <TestColorSlider
            channel="hue"
            defaultValue={parseColor("hsl(0, 100%, 50%)")}
            aria-label="Hue"
            class="custom-slider"
          />
        ));

        const slider = document.querySelector(".custom-slider");
        expect(slider).toBeTruthy();
      });

      it("should render track and thumb elements", () => {
        render(() => (
          <TestColorSlider
            channel="hue"
            defaultValue={parseColor("hsl(0, 100%, 50%)")}
            aria-label="Hue"
          />
        ));

        const track = document.querySelector(".solidaria-ColorSlider-track");
        const thumb = document.querySelector(".solidaria-ColorSlider-thumb");
        expect(track).toBeTruthy();
        expect(thumb).toBeTruthy();
      });

      it("should render with label", () => {
        render(() => (
          <TestColorSlider
            channel="hue"
            defaultValue={parseColor("hsl(0, 100%, 50%)")}
            label="Hue"
          />
        ));

        expect(screen.getByText("Hue")).toBeTruthy();
      });
    });

    describe("data attributes", () => {
      it("should have data-channel attribute", () => {
        render(() => (
          <TestColorSlider
            channel="saturation"
            defaultValue={parseColor("hsl(0, 100%, 50%)")}
            aria-label="Saturation"
          />
        ));

        const slider = document.querySelector(".solidaria-ColorSlider");
        expect(slider?.getAttribute("data-channel")).toBe("saturation");
      });

      it("should have data-disabled when disabled", () => {
        render(() => (
          <TestColorSlider
            channel="hue"
            defaultValue={parseColor("hsl(0, 100%, 50%)")}
            aria-label="Hue"
            isDisabled
          />
        ));

        const slider = document.querySelector(".solidaria-ColorSlider");
        expect(slider?.getAttribute("data-disabled")).toBe("true");
      });
    });

    describe("different channels", () => {
      it("should work with hue channel", () => {
        render(() => (
          <TestColorSlider
            channel="hue"
            defaultValue={parseColor("hsl(180, 100%, 50%)")}
            aria-label="Hue"
          />
        ));

        const slider = document.querySelector(".solidaria-ColorSlider");
        expect(slider?.getAttribute("data-channel")).toBe("hue");
      });

      it("should work with saturation channel", () => {
        render(() => (
          <TestColorSlider
            channel="saturation"
            defaultValue={parseColor("hsl(0, 50%, 50%)")}
            aria-label="Saturation"
          />
        ));

        const slider = document.querySelector(".solidaria-ColorSlider");
        expect(slider?.getAttribute("data-channel")).toBe("saturation");
      });

      it("should work with lightness channel", () => {
        render(() => (
          <TestColorSlider
            channel="lightness"
            defaultValue={parseColor("hsl(0, 100%, 50%)")}
            aria-label="Lightness"
          />
        ));

        const slider = document.querySelector(".solidaria-ColorSlider");
        expect(slider?.getAttribute("data-channel")).toBe("lightness");
      });

      it("should work with alpha channel", () => {
        render(() => (
          <TestColorSlider
            channel="alpha"
            defaultValue={parseColor("hsla(0, 100%, 50%, 0.5)")}
            aria-label="Alpha"
          />
        ));

        const slider = document.querySelector(".solidaria-ColorSlider");
        expect(slider?.getAttribute("data-channel")).toBe("alpha");
      });
    });

    describe("interaction", () => {
      it("should place hidden input inside thumb for focus handling", () => {
        render(() => (
          <TestColorSlider
            channel="hue"
            defaultValue={parseColor("hsl(0, 100%, 50%)")}
            aria-label="Hue"
          />
        ));

        const thumb = document.querySelector(".solidaria-ColorSlider-thumb");
        expect(thumb?.querySelector('input[type="range"]')).toBeTruthy();
      });

      it("should call onChangeEnd when dragging ends", () => {
        const onChangeEnd = vi.fn();
        render(() => (
          <ColorSlider
            channel="hue"
            defaultValue={parseColor("hsl(0, 100%, 50%)")}
            aria-label="Hue"
            onChangeEnd={onChangeEnd}
          >
            {() => (
              <>
                <ColorSliderTrack>{() => <ColorSliderThumb />}</ColorSliderTrack>
                <DragStateTrigger />
              </>
            )}
          </ColorSlider>
        ));

        fireEvent.click(screen.getByRole("button", { name: "Start drag" }));
        const input = document.querySelector(
          '.solidaria-ColorSlider-thumb input[type="range"]',
        ) as HTMLInputElement;
        fireEvent.blur(input);

        expect(onChangeEnd).toHaveBeenCalledTimes(1);
      });
    });
  });

  // ============================================
  // COLOR AREA
  // ============================================

  describe("ColorArea", () => {
    describe("rendering", () => {
      it("should render with default class", () => {
        render(() => (
          <TestColorArea defaultValue={parseColor("hsl(0, 100%, 50%)")} aria-label="Color picker" />
        ));

        const area = document.querySelector(".solidaria-ColorArea");
        expect(area).toBeTruthy();
      });

      it("should render with custom class", () => {
        render(() => (
          <TestColorArea
            defaultValue={parseColor("hsl(0, 100%, 50%)")}
            aria-label="Color picker"
            class="custom-area"
          />
        ));

        const area = document.querySelector(".custom-area");
        expect(area).toBeTruthy();
      });

      it("should render gradient and thumb elements", () => {
        render(() => (
          <TestColorArea defaultValue={parseColor("hsl(0, 100%, 50%)")} aria-label="Color picker" />
        ));

        const gradient = document.querySelector(".solidaria-ColorArea-gradient");
        const thumb = document.querySelector(".solidaria-ColorArea-thumb");
        expect(gradient).toBeTruthy();
        expect(thumb).toBeTruthy();
      });
    });

    describe("data attributes", () => {
      it("should have data-disabled when disabled", () => {
        render(() => (
          <TestColorArea
            defaultValue={parseColor("hsl(0, 100%, 50%)")}
            aria-label="Color picker"
            isDisabled
          />
        ));

        const area = document.querySelector(".solidaria-ColorArea");
        expect(area?.getAttribute("data-disabled")).toBe("true");
      });
    });

    describe("channels", () => {
      it("should support xChannel and yChannel props", () => {
        render(() => (
          <TestColorArea
            defaultValue={parseColor("hsl(0, 100%, 50%)")}
            aria-label="Color picker"
            xChannel="saturation"
            yChannel="lightness"
          />
        ));

        const area = document.querySelector(".solidaria-ColorArea");
        expect(area).toBeTruthy();
      });
    });
  });

  // ============================================
  // COLOR WHEEL
  // ============================================

  describe("ColorWheel", () => {
    describe("rendering", () => {
      it("should render with default class", () => {
        render(() => (
          <TestColorWheel defaultValue={parseColor("hsl(0, 100%, 50%)")} aria-label="Hue wheel" />
        ));

        const wheel = document.querySelector(".solidaria-ColorWheel");
        expect(wheel).toBeTruthy();
      });

      it("should render with custom class", () => {
        render(() => (
          <TestColorWheel
            defaultValue={parseColor("hsl(0, 100%, 50%)")}
            aria-label="Hue wheel"
            class="custom-wheel"
          />
        ));

        const wheel = document.querySelector(".custom-wheel");
        expect(wheel).toBeTruthy();
      });

      it("should render track and thumb elements", () => {
        render(() => (
          <TestColorWheel defaultValue={parseColor("hsl(0, 100%, 50%)")} aria-label="Hue wheel" />
        ));

        const track = document.querySelector(".solidaria-ColorWheel-track");
        const thumb = document.querySelector(".solidaria-ColorWheel-thumb");
        expect(track).toBeTruthy();
        expect(thumb).toBeTruthy();
      });
    });

    describe("data attributes", () => {
      it("should have data-disabled when disabled", () => {
        render(() => (
          <TestColorWheel
            defaultValue={parseColor("hsl(0, 100%, 50%)")}
            aria-label="Hue wheel"
            isDisabled
          />
        ));

        const wheel = document.querySelector(".solidaria-ColorWheel");
        expect(wheel?.getAttribute("data-disabled")).toBe("true");
      });
    });
  });

  // ============================================
  // COLOR FIELD
  // ============================================

  describe("ColorField", () => {
    describe("rendering", () => {
      it("should render with default class", () => {
        render(() => <TestColorField defaultValue={parseColor("#ff0000")} aria-label="Color" />);

        const field = document.querySelector(".solidaria-ColorField");
        expect(field).toBeTruthy();
      });

      it("should render with custom class", () => {
        render(() => (
          <TestColorField
            defaultValue={parseColor("#ff0000")}
            aria-label="Color"
            class="custom-field"
          />
        ));

        const field = document.querySelector(".custom-field");
        expect(field).toBeTruthy();
      });

      it("should render input element", () => {
        render(() => <TestColorField defaultValue={parseColor("#ff0000")} aria-label="Color" />);

        const input = document.querySelector(".solidaria-ColorField-input");
        expect(input).toBeTruthy();
      });

      it("should render with label", () => {
        render(() => <TestColorField defaultValue={parseColor("#ff0000")} label="Color Value" />);

        expect(screen.getByText("Color Value")).toBeTruthy();
      });
    });

    describe("data attributes", () => {
      it("should have data-disabled when disabled", () => {
        render(() => (
          <TestColorField defaultValue={parseColor("#ff0000")} aria-label="Color" isDisabled />
        ));

        const field = document.querySelector(".solidaria-ColorField");
        expect(field?.getAttribute("data-disabled")).toBe("true");
      });

      it("should have data-readonly when read-only", () => {
        render(() => (
          <TestColorField defaultValue={parseColor("#ff0000")} aria-label="Color" isReadOnly />
        ));

        const field = document.querySelector(".solidaria-ColorField");
        expect(field?.getAttribute("data-readonly")).toBe("true");
      });
    });

    describe("channel mode", () => {
      it("should support single channel mode", () => {
        render(() => (
          <TestColorField
            defaultValue={parseColor("hsl(180, 100%, 50%)")}
            aria-label="Hue"
            channel="hue"
          />
        ));

        const field = document.querySelector(".solidaria-ColorField");
        expect(field).toBeTruthy();
      });
    });
  });

  // ============================================
  // COLOR SWATCH
  // ============================================

  describe("ColorSwatch", () => {
    describe("rendering", () => {
      it("should render with default class", () => {
        render(() => <ColorSwatch color="#ff0000" aria-label="Red" />);

        const swatch = document.querySelector(".solidaria-ColorSwatch");
        expect(swatch).toBeTruthy();
      });

      it("should render with custom class", () => {
        render(() => <ColorSwatch color="#ff0000" aria-label="Red" class="custom-swatch" />);

        const swatch = document.querySelector(".custom-swatch");
        expect(swatch).toBeTruthy();
      });

      it("should render with Color object", () => {
        render(() => <ColorSwatch color={parseColor("#00ff00")} aria-label="Green" />);

        const swatch = document.querySelector(".solidaria-ColorSwatch");
        expect(swatch).toBeTruthy();
      });
    });

    describe("color formats", () => {
      it("should render with hex color", () => {
        render(() => <ColorSwatch color="#0000ff" aria-label="Blue" />);

        const swatch = document.querySelector(".solidaria-ColorSwatch");
        expect(swatch).toBeTruthy();
      });

      it("should render with rgb color", () => {
        render(() => <ColorSwatch color="rgb(255, 128, 0)" aria-label="Orange" />);

        const swatch = document.querySelector(".solidaria-ColorSwatch");
        expect(swatch).toBeTruthy();
      });

      it("should render with hsl color", () => {
        render(() => <ColorSwatch color="hsl(270, 100%, 50%)" aria-label="Purple" />);

        const swatch = document.querySelector(".solidaria-ColorSwatch");
        expect(swatch).toBeTruthy();
      });

      it("should render with hsla color (with alpha)", () => {
        render(() => (
          <ColorSwatch color="hsla(180, 100%, 50%, 0.5)" aria-label="Cyan transparent" />
        ));

        const swatch = document.querySelector(".solidaria-ColorSwatch");
        expect(swatch).toBeTruthy();
      });
    });

    describe("render props", () => {
      it("should support render props children", () => {
        render(() => (
          <ColorSwatch color="#ff0000" aria-label="Red">
            {(props) => <span data-testid="color-value">{props.colorValue}</span>}
          </ColorSwatch>
        ));

        const value = screen.getByTestId("color-value");
        expect(value).toBeTruthy();
        // Should contain a CSS color value
        expect(value.textContent).toBeTruthy();
      });
    });
  });

  // ============================================
  // COLOR PICKER
  // ============================================

  describe("ColorPicker", () => {
    it("should provide color context to child swatches", async () => {
      const [value, setValue] = createSignal(parseColor("#ff0000"));
      render(() => (
        <ColorPicker value={value()}>
          {() => <ColorSwatch aria-label="Current color" />}
        </ColorPicker>
      ));

      const swatch = screen.getByRole("img", { name: "Current color" });
      expect((swatch as HTMLElement).style.backgroundColor).toBe("rgb(255, 0, 0)");

      setValue(parseColor("#00ff00"));

      await waitFor(() => {
        const updatedSwatch = screen.getByRole("img", { name: "Current color" });
        expect((updatedSwatch as HTMLElement).style.backgroundColor).toBe("rgb(0, 255, 0)");
      });
    });
  });

  // ============================================
  // COLOR SWATCH PICKER
  // ============================================

  describe("ColorSwatchPicker", () => {
    it("should render with listbox semantics", () => {
      render(() => <TestColorSwatchPicker />);

      const listbox = screen.getByRole("listbox", { name: /color swatch picker/i });
      expect(listbox).toBeTruthy();
      expect(screen.getAllByRole("option")).toHaveLength(3);
    });

    it("should expose layout data attribute", () => {
      render(() => <TestColorSwatchPicker layout="stack" aria-label="Palette" />);

      const listbox = screen.getByRole("listbox", { name: "Palette" });
      expect(listbox.getAttribute("data-layout")).toBe("stack");
    });

    it("should call onChange with selected color on click", () => {
      const onChange = vi.fn();
      render(() => <TestColorSwatchPicker onChange={onChange} aria-label="Palette" />);

      const options = screen.getAllByRole("option");
      fireEvent.click(options[1]!);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0]?.[0]?.toString("hexa")).toBe("#00ff00ff");
    });

    it("should support ArrowRight/ArrowLeft navigation in grid layout", () => {
      const onChange = vi.fn();
      render(() => (
        <TestColorSwatchPicker onChange={onChange} aria-label="Palette" layout="grid" />
      ));

      const getSelectedIndex = () =>
        screen
          .getAllByRole("option")
          .findIndex((option) => option.getAttribute("aria-selected") === "true");

      const listbox = screen.getByRole("listbox", { name: "Palette" });
      listbox.focus();

      expect(getSelectedIndex()).toBe(0);
      fireEvent.keyDown(listbox, { key: "ArrowRight" });
      expect(getSelectedIndex()).toBe(1);
      expect(onChange.mock.calls[0]?.[0]?.toString("hexa")).toBe("#00ff00ff");

      fireEvent.keyDown(listbox, { key: "ArrowLeft" });
      expect(getSelectedIndex()).toBe(0);
    });

    it("should wrap ArrowLeft navigation in grid layout", () => {
      render(() => <TestColorSwatchPicker aria-label="Palette" layout="grid" />);

      const getSelectedIndex = () =>
        screen
          .getAllByRole("option")
          .findIndex((option) => option.getAttribute("aria-selected") === "true");

      const listbox = screen.getByRole("listbox", { name: "Palette" });
      listbox.focus();

      fireEvent.keyDown(listbox, { key: "ArrowLeft" });
      expect(getSelectedIndex()).toBe(2);
    });

    it("should use geometry-based ArrowDown/ArrowUp navigation in multi-column grid layout", () => {
      render(() => <TestColorSwatchPickerFourItems aria-label="Palette" layout="grid" />);

      const getSelectedIndex = () =>
        screen
          .getAllByRole("option")
          .findIndex((option) => option.getAttribute("aria-selected") === "true");

      const options = screen.getAllByRole("option") as HTMLElement[];
      mockGridOptionRects(options, 2);

      const listbox = screen.getByRole("listbox", { name: "Palette" });
      listbox.focus();

      expect(getSelectedIndex()).toBe(0);
      fireEvent.keyDown(listbox, { key: "ArrowDown" });
      expect(getSelectedIndex()).toBe(2);

      fireEvent.keyDown(listbox, { key: "ArrowUp" });
      expect(getSelectedIndex()).toBe(0);
    });

    it("should wrap ArrowDown from bottom row to first item in multi-column grid layout", () => {
      render(() => <TestColorSwatchPickerFourItems aria-label="Palette" layout="grid" />);

      const getSelectedIndex = () =>
        screen
          .getAllByRole("option")
          .findIndex((option) => option.getAttribute("aria-selected") === "true");

      const options = screen.getAllByRole("option") as HTMLElement[];
      mockGridOptionRects(options, 2);

      fireEvent.click(options[3]!);

      const listbox = screen.getByRole("listbox", { name: "Palette" });
      listbox.focus();

      expect(getSelectedIndex()).toBe(3);
      fireEvent.keyDown(listbox, { key: "ArrowDown" });
      expect(getSelectedIndex()).toBe(0);
    });

    it("should invert horizontal arrows in RTL grid layout", () => {
      const previousDir = document.dir;
      document.dir = "rtl";

      try {
        render(() => <TestColorSwatchPicker aria-label="Palette" layout="grid" />);

        const getSelectedIndex = () =>
          screen
            .getAllByRole("option")
            .findIndex((option) => option.getAttribute("aria-selected") === "true");

        const listbox = screen.getByRole("listbox", { name: "Palette" });
        listbox.focus();

        expect(getSelectedIndex()).toBe(0);
        fireEvent.keyDown(listbox, { key: "ArrowRight" });
        expect(getSelectedIndex()).toBe(2);

        fireEvent.keyDown(listbox, { key: "ArrowLeft" });
        expect(getSelectedIndex()).toBe(0);
      } finally {
        document.dir = previousDir;
      }
    });

    it("should keep ArrowRight/ArrowLeft inert in stack layout", () => {
      const onChange = vi.fn();
      render(() => (
        <TestColorSwatchPicker onChange={onChange} aria-label="Palette" layout="stack" />
      ));

      const getSelectedIndex = () =>
        screen
          .getAllByRole("option")
          .findIndex((option) => option.getAttribute("aria-selected") === "true");

      const listbox = screen.getByRole("listbox", { name: "Palette" });
      listbox.focus();

      expect(getSelectedIndex()).toBe(0);
      fireEvent.keyDown(listbox, { key: "ArrowRight" });
      expect(getSelectedIndex()).toBe(0);
      expect(onChange).not.toHaveBeenCalled();

      fireEvent.keyDown(listbox, { key: "ArrowDown" });
      expect(getSelectedIndex()).toBe(1);
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  // ============================================
  // CONTEXT ERRORS
  // ============================================

  describe("context errors", () => {
    it("should throw when ColorSliderTrack is used outside ColorSlider", () => {
      expect(() => {
        render(() => <ColorSliderTrack />);
      }).toThrow("ColorSliderTrack must be used within a ColorSlider");
    });

    it("should throw when ColorSliderThumb is used outside ColorSlider", () => {
      expect(() => {
        render(() => <ColorSliderThumb />);
      }).toThrow("ColorSliderThumb must be used within a ColorSlider");
    });

    it("should throw when ColorAreaGradient is used outside ColorArea", () => {
      expect(() => {
        render(() => <ColorAreaGradient />);
      }).toThrow("ColorAreaGradient must be used within a ColorArea");
    });

    it("should throw when ColorAreaThumb is used outside ColorArea", () => {
      expect(() => {
        render(() => <ColorAreaThumb />);
      }).toThrow("ColorAreaThumb must be used within a ColorArea");
    });

    it("should throw when ColorWheelTrack is used outside ColorWheel", () => {
      expect(() => {
        render(() => <ColorWheelTrack />);
      }).toThrow("ColorWheelTrack must be used within a ColorWheel");
    });

    it("should throw when ColorWheelThumb is used outside ColorWheel", () => {
      expect(() => {
        render(() => <ColorWheelThumb />);
      }).toThrow("ColorWheelThumb must be used within a ColorWheel");
    });

    it("should throw when ColorFieldInput is used outside ColorField", () => {
      expect(() => {
        render(() => <ColorFieldInput />);
      }).toThrow("ColorFieldInput must be used within a ColorField");
    });

    it("should throw when ColorSwatchPickerItem is used outside ColorSwatchPicker", () => {
      expect(() => {
        render(() => <ColorSwatchPickerItem color="#ff0000" />);
      }).toThrow("ColorSwatchPickerItem must be used within a ColorSwatchPicker");
    });
  });
});
