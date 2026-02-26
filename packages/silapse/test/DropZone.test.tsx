/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { DropZone } from '../src/dropzone';

describe('DropZone (silapse)', () => {
  it('renders base styles and the hidden accessible drop button', () => {
    render(() => <DropZone>Drop files here</DropZone>);

    const zone = screen.getByText('Drop files here').closest('div') as HTMLDivElement;
    expect(zone).toBeInTheDocument();
    expect(zone.className).toContain('border-dashed');
    expect(zone.className).toContain('rounded-lg');

    const hiddenButton = screen.getByRole('button', { name: 'Drop files' });
    expect(hiddenButton).toBeInTheDocument();
  });

  it('applies custom and disabled styling classes', () => {
    render(() => (
      <DropZone isDisabled class="custom-dropzone">
        Drop files here
      </DropZone>
    ));

    const zone = screen.getByText('Drop files here').closest('div') as HTMLDivElement;
    expect(zone).toHaveClass('custom-dropzone');
    expect(zone.className).toContain('cursor-not-allowed');

    const hiddenButton = screen.getByRole('button', { name: 'Drop files' });
    expect(hiddenButton).toBeDisabled();
  });
});
