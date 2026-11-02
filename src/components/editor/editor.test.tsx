import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FeaturedApps } from '@/components/home/FeaturedApps.component';
import { Hero } from '@/components/home/Hero.component';
import { SiteContentProvider } from '@/components/site/SiteContentProvider.component';
import { TEST_NOW, makeSnapshot } from '@/test/snapshot';
import { Editor } from './Editor.component';

function renderPage() {
  const user = userEvent.setup();
  const view = render(
    <SiteContentProvider>
      <Hero isCvAvailable />
      <Editor snapshot={makeSnapshot()} now={TEST_NOW} />
      <FeaturedApps />
    </SiteContentProvider>,
  );
  return { user, root: view.container.firstElementChild as HTMLElement };
}

describe('Editor', () => {
  it('should update the hero name when the name field is edited', async () => {
    const { user } = renderPage();
    const input = screen.getByRole('textbox', { name: 'developer.name' });
    await user.clear(input);
    await user.type(input, 'Ada');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ada');
  });

  it('should update the first app card when its description is edited', async () => {
    const { user } = renderPage();
    const input = screen.getByRole('textbox', { name: 'featured[0].desc' });
    await user.clear(input);
    await user.type(input, 'Pixel tools');
    expect(screen.getByText('Pixel tools')).toBeInTheDocument();
  });

  it('should keep an emptied field at least 2ch wide', async () => {
    const { user } = renderPage();
    const input = screen.getByRole('textbox', { name: 'developer.name' });
    await user.clear(input);
    expect(input).toBeInTheDocument();
    expect(input.style.width).toBe('2ch');
  });

  it('should cycle the theme from the status bar', async () => {
    const { user, root } = renderPage();
    await user.click(screen.getByRole('button', { name: /switch theme/i }));
    expect(root.dataset.theme).toBe('Light');
  });

  it('should recolour the site from settings.json only for a valid hex', async () => {
    const { user, root } = renderPage();
    await user.click(screen.getByRole('tab', { name: 'settings.json' }));
    const input = screen.getByRole('textbox', { name: 'pladsen.accent' });
    await user.clear(input);
    await user.type(input, '#22d3ee');
    expect(root.style.getPropertyValue('--site-accent')).toBe('#22d3ee');
    await user.clear(input);
    await user.type(input, '#22');
    expect(root.style.getPropertyValue('--site-accent')).toBe('#22d3ee');
  });

  it('should show the joke secret and blur the rest in .env', async () => {
    const { user } = renderPage();
    await user.click(screen.getByRole('tab', { name: '.env' }));
    expect(screen.getByText('nice-try')).toBeInTheDocument();
    expect(screen.getByText(/same as my luggage/)).toHaveClass('blur-[5px]');
  });

  it('should show the journey in journey.md', async () => {
    const { user } = renderPage();
    await user.click(screen.getByRole('tab', { name: 'journey.md' }));
    expect(screen.getByText(/Work · 2022 – now/)).toBeInTheDocument();
  });
});
