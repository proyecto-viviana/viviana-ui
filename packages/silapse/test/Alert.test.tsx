/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { setupUser } from '@proyecto-viviana/silapse-test-utils';
import { Alert } from '../src/alert';

describe('Alert (silapse)', () => {
  it('renders an alert with variant styling', () => {
    render(() => (
      <Alert variant="warning" title="Warning">
        Please review your configuration.
      </Alert>
    ));

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Warning');
    expect(alert).toHaveTextContent('Please review your configuration.');
    expect(alert.className).toContain('bg-warning-600');
  });

  it('supports dismissible alerts', async () => {
    const user = setupUser();
    const onDismiss = vi.fn();

    render(() => (
      <Alert dismissible onDismiss={onDismiss}>
        Dismiss me
      </Alert>
    ));

    const dismiss = screen.getByRole('button', { name: 'Dismiss' });
    await user.click(dismiss);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
