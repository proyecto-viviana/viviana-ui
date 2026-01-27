/**
 * Color component tests
 *
 * Tests for ColorSlider, ColorArea, ColorWheel, ColorField, and ColorSwatch.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@solidjs/testing-library';
import {
  ColorSlider,
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
} from '../src/Color';
import { parseColor } from '@proyecto-viviana/solid-stately';

// Helper components using render props pattern
function TestColorSlider(props: Parameters<typeof ColorSlider>[0]) {
  return (
    <ColorSlider {...props}>
      {() => (
        <ColorSliderTrack>
          {() => <ColorSliderThumb />}
        </ColorSliderTrack>
      )}
    </ColorSlider>
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
      {() => (
        <ColorWheelTrack>
          {() => <ColorWheelThumb />}
        </ColorWheelTrack>
      )}
    </ColorWheel>
  );
}

function TestColorField(props: Parameters<typeof ColorField>[0]) {
  return (
    <ColorField {...props}>
      {() => <ColorFieldInput />}
    </ColorField>
  );
}

describe('Color Components', () => {
  afterEach(() => {
    cleanup();
  });

  // ============================================
  // COLOR SLIDER
  // ============================================

  describe('ColorSlider', () => {
    describe('rendering', () => {
      it('should render with default class', () => {
        render(() => (
          <TestColorSlider
            channel="hue"
            defaultValue={parseColor('hsl(0, 100%, 50%)')}
            aria-label="Hue"
          />
        ));

        const slider = document.querySelector('.solidaria-ColorSlider');
        expect(slider).toBeTruthy();
      });

      it('should render with custom class', () => {
        render(() => (
          <TestColorSlider
            channel="hue"
            defaultValue={parseColor('hsl(0, 100%, 50%)')}
            aria-label="Hue"
            class="custom-slider"
          />
        ));

        const slider = document.querySelector('.custom-slider');
        expect(slider).toBeTruthy();
      });

      it('should render track and thumb elements', () => {
        render(() => (
          <TestColorSlider
            channel="hue"
            defaultValue={parseColor('hsl(0, 100%, 50%)')}
            aria-label="Hue"
          />
        ));

        const track = document.querySelector('.solidaria-ColorSlider-track');
        const thumb = document.querySelector('.solidaria-ColorSlider-thumb');
        expect(track).toBeTruthy();
        expect(thumb).toBeTruthy();
      });

      it('should render with label', () => {
        render(() => (
          <TestColorSlider
            channel="hue"
            defaultValue={parseColor('hsl(0, 100%, 50%)')}
            label="Hue"
          />
        ));

        expect(screen.getByText('Hue')).toBeTruthy();
      });
    });

    describe('data attributes', () => {
      it('should have data-channel attribute', () => {
        render(() => (
          <TestColorSlider
            channel="saturation"
            defaultValue={parseColor('hsl(0, 100%, 50%)')}
            aria-label="Saturation"
          />
        ));

        const slider = document.querySelector('.solidaria-ColorSlider');
        expect(slider?.getAttribute('data-channel')).toBe('saturation');
      });

      it('should have data-disabled when disabled', () => {
        render(() => (
          <TestColorSlider
            channel="hue"
            defaultValue={parseColor('hsl(0, 100%, 50%)')}
            aria-label="Hue"
            isDisabled
          />
        ));

        const slider = document.querySelector('.solidaria-ColorSlider');
        expect(slider?.getAttribute('data-disabled')).toBe('true');
      });
    });

    describe('different channels', () => {
      it('should work with hue channel', () => {
        render(() => (
          <TestColorSlider
            channel="hue"
            defaultValue={parseColor('hsl(180, 100%, 50%)')}
            aria-label="Hue"
          />
        ));

        const slider = document.querySelector('.solidaria-ColorSlider');
        expect(slider?.getAttribute('data-channel')).toBe('hue');
      });

      it('should work with saturation channel', () => {
        render(() => (
          <TestColorSlider
            channel="saturation"
            defaultValue={parseColor('hsl(0, 50%, 50%)')}
            aria-label="Saturation"
          />
        ));

        const slider = document.querySelector('.solidaria-ColorSlider');
        expect(slider?.getAttribute('data-channel')).toBe('saturation');
      });

      it('should work with lightness channel', () => {
        render(() => (
          <TestColorSlider
            channel="lightness"
            defaultValue={parseColor('hsl(0, 100%, 50%)')}
            aria-label="Lightness"
          />
        ));

        const slider = document.querySelector('.solidaria-ColorSlider');
        expect(slider?.getAttribute('data-channel')).toBe('lightness');
      });

      it('should work with alpha channel', () => {
        render(() => (
          <TestColorSlider
            channel="alpha"
            defaultValue={parseColor('hsla(0, 100%, 50%, 0.5)')}
            aria-label="Alpha"
          />
        ));

        const slider = document.querySelector('.solidaria-ColorSlider');
        expect(slider?.getAttribute('data-channel')).toBe('alpha');
      });
    });
  });

  // ============================================
  // COLOR AREA
  // ============================================

  describe('ColorArea', () => {
    describe('rendering', () => {
      it('should render with default class', () => {
        render(() => (
          <TestColorArea
            defaultValue={parseColor('hsl(0, 100%, 50%)')}
            aria-label="Color picker"
          />
        ));

        const area = document.querySelector('.solidaria-ColorArea');
        expect(area).toBeTruthy();
      });

      it('should render with custom class', () => {
        render(() => (
          <TestColorArea
            defaultValue={parseColor('hsl(0, 100%, 50%)')}
            aria-label="Color picker"
            class="custom-area"
          />
        ));

        const area = document.querySelector('.custom-area');
        expect(area).toBeTruthy();
      });

      it('should render gradient and thumb elements', () => {
        render(() => (
          <TestColorArea
            defaultValue={parseColor('hsl(0, 100%, 50%)')}
            aria-label="Color picker"
          />
        ));

        const gradient = document.querySelector('.solidaria-ColorArea-gradient');
        const thumb = document.querySelector('.solidaria-ColorArea-thumb');
        expect(gradient).toBeTruthy();
        expect(thumb).toBeTruthy();
      });
    });

    describe('data attributes', () => {
      it('should have data-disabled when disabled', () => {
        render(() => (
          <TestColorArea
            defaultValue={parseColor('hsl(0, 100%, 50%)')}
            aria-label="Color picker"
            isDisabled
          />
        ));

        const area = document.querySelector('.solidaria-ColorArea');
        expect(area?.getAttribute('data-disabled')).toBe('true');
      });
    });

    describe('channels', () => {
      it('should support xChannel and yChannel props', () => {
        render(() => (
          <TestColorArea
            defaultValue={parseColor('hsl(0, 100%, 50%)')}
            aria-label="Color picker"
            xChannel="saturation"
            yChannel="lightness"
          />
        ));

        const area = document.querySelector('.solidaria-ColorArea');
        expect(area).toBeTruthy();
      });
    });
  });

  // ============================================
  // COLOR WHEEL
  // ============================================

  describe('ColorWheel', () => {
    describe('rendering', () => {
      it('should render with default class', () => {
        render(() => (
          <TestColorWheel
            defaultValue={parseColor('hsl(0, 100%, 50%)')}
            aria-label="Hue wheel"
          />
        ));

        const wheel = document.querySelector('.solidaria-ColorWheel');
        expect(wheel).toBeTruthy();
      });

      it('should render with custom class', () => {
        render(() => (
          <TestColorWheel
            defaultValue={parseColor('hsl(0, 100%, 50%)')}
            aria-label="Hue wheel"
            class="custom-wheel"
          />
        ));

        const wheel = document.querySelector('.custom-wheel');
        expect(wheel).toBeTruthy();
      });

      it('should render track and thumb elements', () => {
        render(() => (
          <TestColorWheel
            defaultValue={parseColor('hsl(0, 100%, 50%)')}
            aria-label="Hue wheel"
          />
        ));

        const track = document.querySelector('.solidaria-ColorWheel-track');
        const thumb = document.querySelector('.solidaria-ColorWheel-thumb');
        expect(track).toBeTruthy();
        expect(thumb).toBeTruthy();
      });
    });

    describe('data attributes', () => {
      it('should have data-disabled when disabled', () => {
        render(() => (
          <TestColorWheel
            defaultValue={parseColor('hsl(0, 100%, 50%)')}
            aria-label="Hue wheel"
            isDisabled
          />
        ));

        const wheel = document.querySelector('.solidaria-ColorWheel');
        expect(wheel?.getAttribute('data-disabled')).toBe('true');
      });
    });
  });

  // ============================================
  // COLOR FIELD
  // ============================================

  describe('ColorField', () => {
    describe('rendering', () => {
      it('should render with default class', () => {
        render(() => (
          <TestColorField
            defaultValue={parseColor('#ff0000')}
            aria-label="Color"
          />
        ));

        const field = document.querySelector('.solidaria-ColorField');
        expect(field).toBeTruthy();
      });

      it('should render with custom class', () => {
        render(() => (
          <TestColorField
            defaultValue={parseColor('#ff0000')}
            aria-label="Color"
            class="custom-field"
          />
        ));

        const field = document.querySelector('.custom-field');
        expect(field).toBeTruthy();
      });

      it('should render input element', () => {
        render(() => (
          <TestColorField
            defaultValue={parseColor('#ff0000')}
            aria-label="Color"
          />
        ));

        const input = document.querySelector('.solidaria-ColorField-input');
        expect(input).toBeTruthy();
      });

      it('should render with label', () => {
        render(() => (
          <TestColorField
            defaultValue={parseColor('#ff0000')}
            label="Color Value"
          />
        ));

        expect(screen.getByText('Color Value')).toBeTruthy();
      });
    });

    describe('data attributes', () => {
      it('should have data-disabled when disabled', () => {
        render(() => (
          <TestColorField
            defaultValue={parseColor('#ff0000')}
            aria-label="Color"
            isDisabled
          />
        ));

        const field = document.querySelector('.solidaria-ColorField');
        expect(field?.getAttribute('data-disabled')).toBe('true');
      });

      it('should have data-readonly when read-only', () => {
        render(() => (
          <TestColorField
            defaultValue={parseColor('#ff0000')}
            aria-label="Color"
            isReadOnly
          />
        ));

        const field = document.querySelector('.solidaria-ColorField');
        expect(field?.getAttribute('data-readonly')).toBe('true');
      });
    });

    describe('channel mode', () => {
      it('should support single channel mode', () => {
        render(() => (
          <TestColorField
            defaultValue={parseColor('hsl(180, 100%, 50%)')}
            aria-label="Hue"
            channel="hue"
          />
        ));

        const field = document.querySelector('.solidaria-ColorField');
        expect(field).toBeTruthy();
      });
    });
  });

  // ============================================
  // COLOR SWATCH
  // ============================================

  describe('ColorSwatch', () => {
    describe('rendering', () => {
      it('should render with default class', () => {
        render(() => (
          <ColorSwatch color="#ff0000" aria-label="Red" />
        ));

        const swatch = document.querySelector('.solidaria-ColorSwatch');
        expect(swatch).toBeTruthy();
      });

      it('should render with custom class', () => {
        render(() => (
          <ColorSwatch color="#ff0000" aria-label="Red" class="custom-swatch" />
        ));

        const swatch = document.querySelector('.custom-swatch');
        expect(swatch).toBeTruthy();
      });

      it('should render with Color object', () => {
        render(() => (
          <ColorSwatch color={parseColor('#00ff00')} aria-label="Green" />
        ));

        const swatch = document.querySelector('.solidaria-ColorSwatch');
        expect(swatch).toBeTruthy();
      });
    });

    describe('color formats', () => {
      it('should render with hex color', () => {
        render(() => (
          <ColorSwatch color="#0000ff" aria-label="Blue" />
        ));

        const swatch = document.querySelector('.solidaria-ColorSwatch');
        expect(swatch).toBeTruthy();
      });

      it('should render with rgb color', () => {
        render(() => (
          <ColorSwatch color="rgb(255, 128, 0)" aria-label="Orange" />
        ));

        const swatch = document.querySelector('.solidaria-ColorSwatch');
        expect(swatch).toBeTruthy();
      });

      it('should render with hsl color', () => {
        render(() => (
          <ColorSwatch color="hsl(270, 100%, 50%)" aria-label="Purple" />
        ));

        const swatch = document.querySelector('.solidaria-ColorSwatch');
        expect(swatch).toBeTruthy();
      });

      it('should render with hsla color (with alpha)', () => {
        render(() => (
          <ColorSwatch color="hsla(180, 100%, 50%, 0.5)" aria-label="Cyan transparent" />
        ));

        const swatch = document.querySelector('.solidaria-ColorSwatch');
        expect(swatch).toBeTruthy();
      });
    });

    describe('render props', () => {
      it('should support render props children', () => {
        render(() => (
          <ColorSwatch color="#ff0000" aria-label="Red">
            {(props) => <span data-testid="color-value">{props.colorValue}</span>}
          </ColorSwatch>
        ));

        const value = screen.getByTestId('color-value');
        expect(value).toBeTruthy();
        // Should contain a CSS color value
        expect(value.textContent).toBeTruthy();
      });
    });
  });

  // ============================================
  // CONTEXT ERRORS
  // ============================================

  describe('context errors', () => {
    it('should throw when ColorSliderTrack is used outside ColorSlider', () => {
      expect(() => {
        render(() => <ColorSliderTrack />);
      }).toThrow('ColorSliderTrack must be used within a ColorSlider');
    });

    it('should throw when ColorSliderThumb is used outside ColorSlider', () => {
      expect(() => {
        render(() => <ColorSliderThumb />);
      }).toThrow('ColorSliderThumb must be used within a ColorSlider');
    });

    it('should throw when ColorAreaGradient is used outside ColorArea', () => {
      expect(() => {
        render(() => <ColorAreaGradient />);
      }).toThrow('ColorAreaGradient must be used within a ColorArea');
    });

    it('should throw when ColorAreaThumb is used outside ColorArea', () => {
      expect(() => {
        render(() => <ColorAreaThumb />);
      }).toThrow('ColorAreaThumb must be used within a ColorArea');
    });

    it('should throw when ColorWheelTrack is used outside ColorWheel', () => {
      expect(() => {
        render(() => <ColorWheelTrack />);
      }).toThrow('ColorWheelTrack must be used within a ColorWheel');
    });

    it('should throw when ColorWheelThumb is used outside ColorWheel', () => {
      expect(() => {
        render(() => <ColorWheelThumb />);
      }).toThrow('ColorWheelThumb must be used within a ColorWheel');
    });

    it('should throw when ColorFieldInput is used outside ColorField', () => {
      expect(() => {
        render(() => <ColorFieldInput />);
      }).toThrow('ColorFieldInput must be used within a ColorField');
    });
  });
});
