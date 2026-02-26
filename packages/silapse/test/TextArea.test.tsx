/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import { TextArea } from '../src/textfield/TextArea';

describe('TextArea (silapse)', () => {
  describe('basic rendering', () => {
    it('renders a textarea element', () => {
      render(() => <TextArea aria-label="Notes" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
    });

    it('renders with label', () => {
      render(() => <TextArea label="Notes" />);
      expect(screen.getByRole('textbox', { name: 'Notes' })).toBeInTheDocument();
      expect(screen.getByText('Notes')).toBeInTheDocument();
    });

    it('renders with description', () => {
      render(() => <TextArea aria-label="Notes" description="Enter your notes" />);
      expect(screen.getByText('Enter your notes')).toBeInTheDocument();
    });

    it('renders with error message when invalid', () => {
      render(() => (
        <TextArea
          aria-label="Notes"
          errorMessage="This field is required"
          isInvalid
        />
      ));
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });

  describe('size variants', () => {
    it('applies sm size styles', () => {
      render(() => <TextArea aria-label="Notes" size="sm" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.className).toContain('text-sm');
    });

    it('applies md size styles by default', () => {
      render(() => <TextArea aria-label="Notes" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.className).toContain('text-base');
    });

    it('applies lg size styles', () => {
      render(() => <TextArea aria-label="Notes" size="lg" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.className).toContain('text-lg');
    });
  });

  describe('variant styles', () => {
    it('applies outline variant by default', () => {
      render(() => <TextArea aria-label="Notes" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.className).toContain('border-bg-400');
    });

    it('applies filled variant', () => {
      render(() => <TextArea aria-label="Notes" variant="filled" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.className).toContain('bg-bg-200');
    });
  });

  describe('states', () => {
    it('handles disabled state', () => {
      render(() => <TextArea aria-label="Notes" isDisabled />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
    });

    it('handles read-only state', () => {
      render(() => <TextArea aria-label="Notes" isReadOnly />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea.readOnly).toBe(true);
    });

    it('supports controlled value', () => {
      render(() => <TextArea aria-label="Notes" value="Hello world" />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea.value).toBe('Hello world');
    });

    it('supports defaultValue', () => {
      render(() => <TextArea aria-label="Notes" defaultValue="Default text" />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea.value).toBe('Default text');
    });
  });

  describe('accessibility', () => {
    it('associates label with textarea', () => {
      render(() => <TextArea label="Notes" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.getAttribute('aria-label') || textarea.getAttribute('aria-labelledby')).toBeTruthy();
    });

    it('applies aria-label', () => {
      render(() => <TextArea aria-label="User notes" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('marks invalid state with aria-invalid', () => {
      render(() => <TextArea aria-label="Notes" isInvalid errorMessage="Required" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.getAttribute('aria-invalid')).toBe('true');
    });
  });
});
