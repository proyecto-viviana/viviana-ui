/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import { ColorEditor } from '../src/ColorEditor';

describe('ColorEditor (headless)', () => {
  describe('basic rendering', () => {
    it('renders the editor container', () => {
      const { container } = render(() => <ColorEditor />);
      expect(container.querySelector('.solidaria-ColorEditor')).toBeInTheDocument();
    });

    it('renders ColorArea', () => {
      const { container } = render(() => <ColorEditor />);
      expect(container.querySelector('.solidaria-ColorArea')).toBeInTheDocument();
    });

    it('renders hue slider', () => {
      render(() => <ColorEditor />);
      // Hue slider has aria-label "Hue"
      const hueSlider = screen.getByLabelText('Hue');
      expect(hueSlider).toBeInTheDocument();
    });

    it('renders alpha controls by default', () => {
      render(() => <ColorEditor />);
      const alphaElements = screen.getAllByLabelText('Alpha');
      // At least one alpha control (slider and/or field)
      expect(alphaElements.length).toBeGreaterThanOrEqual(1);
    });

    it('renders color format selector', () => {
      render(() => <ColorEditor />);
      expect(screen.getByLabelText('Color format')).toBeInTheDocument();
    });
  });

  describe('color space', () => {
    it('defaults to hsb color space', () => {
      const { container } = render(() => <ColorEditor />);
      const editor = container.querySelector('.solidaria-ColorEditor');
      expect(editor?.getAttribute('data-color-space')).toBe('hsb');
    });

    it('changes color space via selector', () => {
      const { container } = render(() => <ColorEditor />);
      const select = screen.getByLabelText('Color format') as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'rgb' } });
      const editor = container.querySelector('.solidaria-ColorEditor');
      expect(editor?.getAttribute('data-color-space')).toBe('rgb');
    });

    it('shows hex format option', () => {
      render(() => <ColorEditor />);
      const select = screen.getByLabelText('Color format') as HTMLSelectElement;
      const options = Array.from(select.options).map(o => o.value);
      expect(options).toContain('hex');
    });

    it('calls onColorSpaceChange when space changes', () => {
      const onSpaceChange = vi.fn();
      render(() => <ColorEditor onColorSpaceChange={onSpaceChange} />);
      const select = screen.getByLabelText('Color format') as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'hsl' } });
      expect(onSpaceChange).toHaveBeenCalledWith('hsl');
    });
  });

  describe('hideAlphaChannel', () => {
    it('hides alpha controls when hideAlphaChannel=true', () => {
      render(() => <ColorEditor hideAlphaChannel />);
      // Should not find any alpha-labeled elements
      expect(screen.queryAllByLabelText('Alpha')).toHaveLength(0);
    });
  });

  describe('disabled state', () => {
    it('disables the format selector', () => {
      render(() => <ColorEditor isDisabled />);
      expect(screen.getByLabelText('Color format')).toBeDisabled();
    });
  });

  describe('custom children', () => {
    it('renders custom children when provided', () => {
      render(() => (
        <ColorEditor>
          <div data-testid="custom">Custom content</div>
        </ColorEditor>
      ));
      expect(screen.getByTestId('custom')).toBeInTheDocument();
      // Default layout should not be present
      expect(screen.queryByLabelText('Color format')).not.toBeInTheDocument();
    });
  });
});
