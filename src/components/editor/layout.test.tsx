import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SiteContentProvider } from '@/components/site/SiteContentProvider.component';
import { TEST_NOW, makeSnapshot } from '@/test/snapshot';
import { Editor } from './Editor.component';
import { EDITOR_TABS } from './EditorState.component';
import { PANEL_SIZE, SIDEBAR_SIZE } from './useEditorLayout';

function renderEditor() {
  const user = userEvent.setup();
  render(
    <SiteContentProvider>
      <Editor snapshot={makeSnapshot()} now={TEST_NOW} />
    </SiteContentProvider>,
  );
  return user;
}

const openTabNames = () => within(screen.getByRole('tablist', { name: 'Open files' })).getAllByRole('tab').map((tab) => tab.textContent);
const activeFile = () => within(screen.getByRole('tablist', { name: 'Open files' })).getByRole('tab', { selected: true });
const sidebar = () => screen.getByRole('complementary', { name: 'Sidebar' });

describe('Editor tabs', () => {
  it('should close a tab and activate its right-hand neighbour', async () => {
    const user = renderEditor();
    await user.click(screen.getByRole('button', { name: 'Close page.tsx' }));
    expect(activeFile()).toHaveTextContent('journey.md');
  });

  it('should remove a closed tab from the tab bar', async () => {
    const user = renderEditor();
    await user.click(screen.getByRole('button', { name: 'Close .env' }));
    expect(openTabNames()).not.toContain('.env');
  });

  it('should reopen a closed file from the Explorer', async () => {
    const user = renderEditor();
    await user.click(screen.getByRole('button', { name: 'Close settings.json' }));
    await user.click(within(sidebar()).getByRole('button', { name: /settings\.json/ }));
    expect(activeFile()).toHaveTextContent('settings.json');
  });

  it('should show the shortcut watermark when every tab is closed', async () => {
    const user = renderEditor();
    for (const tab of EDITOR_TABS) await user.click(screen.getByRole('button', { name: `Close ${tab}` }));
    expect(screen.getByText('Toggle Primary Side Bar')).toBeInTheDocument();
  });
});

describe('Side bar', () => {
  it('should hide when the active activity icon is clicked', async () => {
    const user = renderEditor();
    await user.click(screen.getByRole('button', { name: 'Explorer' }));
    expect(sidebar()).toHaveClass('md:hidden');
  });

  it('should toggle with cmd+b', async () => {
    const user = renderEditor();
    screen.getByRole('region', { name: 'Code editor' }).focus();
    await user.keyboard('{Meta>}b{/Meta}');
    expect(sidebar()).toHaveClass('md:hidden');
  });

  it('should widen with the arrow keys on its sash', async () => {
    const user = renderEditor();
    const sash = screen.getByRole('separator', { name: 'Resize side bar' });
    sash.focus();
    await user.keyboard('{ArrowRight}');
    expect(sash).toHaveAttribute('aria-valuenow', String(SIDEBAR_SIZE.initial + 20));
  });
});

describe('Bottom panel', () => {
  it('should close from its close button', async () => {
    const user = renderEditor();
    await user.click(screen.getByRole('button', { name: 'Close panel' }));
    expect(screen.queryByRole('tablist', { name: 'Panel' })).not.toBeInTheDocument();
  });

  it('should reopen from the problems count in the status bar', async () => {
    const user = renderEditor();
    await user.click(screen.getByRole('button', { name: 'Close panel' }));
    await user.click(screen.getByTitle('Show problems'));
    expect(screen.getByRole('tab', { name: 'PROBLEMS 1' })).toHaveAttribute('aria-selected', 'true');
  });

  it('should toggle with cmd+j', async () => {
    const user = renderEditor();
    screen.getByRole('region', { name: 'Code editor' }).focus();
    await user.keyboard('{Meta>}j{/Meta}');
    expect(screen.queryByRole('tablist', { name: 'Panel' })).not.toBeInTheDocument();
  });

  it('should maximize and offer to restore', async () => {
    const user = renderEditor();
    await user.click(screen.getByRole('button', { name: 'Maximize panel size' }));
    expect(screen.getByRole('button', { name: 'Restore panel size' })).toBeInTheDocument();
  });

  it('should grow when its sash is moved up', async () => {
    const user = renderEditor();
    const sash = screen.getByRole('separator', { name: 'Resize panel' });
    sash.focus();
    await user.keyboard('{ArrowUp}');
    expect(sash).toHaveAttribute('aria-valuenow', String(PANEL_SIZE.initial + 20));
  });
});
