import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SiteContentProvider } from '@/components/site/SiteContentProvider.component';
import type { GitHubSnapshot } from '@/lib/github/types';
import { TEST_NOW, makeSnapshot } from '@/test/snapshot';
import { Editor } from '../Editor.component';

function renderEditor(snapshot: GitHubSnapshot = makeSnapshot(), hasFakeTimers = false) {
  const user = userEvent.setup(hasFakeTimers ? { advanceTimers: vi.advanceTimersByTime } : {});
  render(
    <SiteContentProvider>
      <Editor snapshot={snapshot} now={TEST_NOW} />
    </SiteContentProvider>,
  );
  return user;
}

afterEach(() => {
  vi.useRealTimers();
  window.localStorage.clear();
});

describe('Terminal', () => {
  it('should run a command on Enter and clear the input', async () => {
    const user = renderEditor();
    const input = screen.getByRole('textbox', { name: 'Terminal command' });
    await user.type(input, 'whoami{Enter}');
    expect(screen.getByText(/Magnus Pladsen — Full-stack developer/)).toBeInTheDocument();
    expect(input).toHaveValue('');
  });
});

describe('Run', () => {
  it('should compile in the terminal and then open the live preview', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = renderEditor(makeSnapshot(), true);
    await user.click(screen.getByRole('button', { name: 'Run page.tsx' }));
    expect(screen.getByText(/compiling src\/app\/page.tsx/)).toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByRole('region', { name: 'Live preview' })).toHaveTextContent('Magnus Pladsen');
  });
});

describe('Problems', () => {
  it('should show the coffee warning', async () => {
    const user = renderEditor();
    await user.click(screen.getByRole('tab', { name: /PROBLEMS/ }));
    expect(screen.getByText(/coffee level low/)).toBeInTheDocument();
  });
});

describe('Release toast', () => {
  it('should announce the newest release and link to it', () => {
    renderEditor();
    expect(screen.getByRole('status')).toHaveTextContent('Proton-ish: v1.0.40 released');
    expect(screen.getByRole('link', { name: 'View' })).toHaveAttribute('href', expect.stringContaining('/releases/tag/v1.0.40'));
  });

  it('should hide when Later is clicked', async () => {
    const user = renderEditor();
    await user.click(screen.getByRole('button', { name: 'Later' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('should not render without a release', () => {
    renderEditor(makeSnapshot({ latestRelease: null }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

describe('Easter egg counter', () => {
  it('should stay hidden until the first easter egg is found', () => {
    renderEditor();
    expect(screen.queryByRole('button', { name: /Easter eggs found/ })).not.toBeInTheDocument();
  });

  it('should count each easter egg once', async () => {
    const user = renderEditor();
    const input = screen.getByRole('textbox', { name: 'Terminal command' });
    await user.type(input, 'vim{Enter}');
    await user.type(input, 'vim{Enter}');
    await user.type(input, 'sudo ping magnus{Enter}');
    expect(screen.getByRole('button', { name: /Easter eggs found: 2 of \d+/ })).toBeInTheDocument();
  });

  it('should count opening the .env tab', async () => {
    const user = renderEditor();
    await user.click(screen.getByRole('tab', { name: '.env' }));
    expect(screen.getByRole('button', { name: /Easter eggs found: 1 of/ })).toBeInTheDocument();
  });

  it('should answer an easter egg search in the search panel', async () => {
    const user = renderEditor();
    await user.click(screen.getByRole('button', { name: 'Search' }));
    await user.type(screen.getByRole('searchbox', { name: 'Search repos' }), 'easter');
    expect(screen.getByText(/aren.t indexed/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Easter eggs found: 1 of/ })).toBeInTheDocument();
  });
});
