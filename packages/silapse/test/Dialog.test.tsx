/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { setupUser } from '@proyecto-viviana/silapse-test-utils';
import { DialogTrigger, Dialog } from '../src/dialog';
import { Button } from '../src/button';

describe('Dialog (silapse)', () => {
  it('opens from trigger and closes via close action', async () => {
    const user = setupUser();

    render(() => (
      <DialogTrigger
        trigger={<Button>Open dialog</Button>}
        content={(close) => (
          <Dialog title="Settings" isDismissable onClose={close}>
            <button onClick={close}>Close now</button>
          </Dialog>
        )}
      />
    ));

    await user.click(screen.getByRole('button', { name: 'Open dialog' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close now' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
