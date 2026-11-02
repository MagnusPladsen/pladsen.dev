import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SiteContentProvider } from '@/components/site/SiteContentProvider.component';
import { FEATURED_APPS, MORE_APPS } from '@/lib/site-content';
import { AppGallery } from './AppGallery.component';

const ALL_APP_COUNT = FEATURED_APPS.length + MORE_APPS.length;
const DISCONTINUED_COUNT = MORE_APPS.filter((app) => app.isDiscontinued).length;

function renderGallery() {
  const user = userEvent.setup();
  render(
    <SiteContentProvider>
      <AppGallery />
    </SiteContentProvider>,
  );
  return user;
}

describe('AppGallery', () => {
  it('should show every app, featured first', () => {
    renderGallery();
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(ALL_APP_COUNT);
    expect(within(cards[0]).getByRole('heading')).toHaveTextContent('gamedev-studio');
    expect(within(cards[FEATURED_APPS.length]).getByRole('heading')).toHaveTextContent(MORE_APPS[0].name);
  });

  it('should link live apps and their source', () => {
    renderGallery();
    const [first] = screen.getAllByRole('article');
    expect(within(first).getByRole('link', { name: /Open app/ })).toHaveAttribute('href', FEATURED_APPS[0].url);
    expect(within(first).getByRole('link', { name: /Source/ })).toHaveAttribute('href', FEATURED_APPS[0].repo);
  });

  it('should mark discontinued apps and only link their source', () => {
    renderGallery();
    const discontinued = screen.getAllByRole('article').filter((card) => within(card).queryByText('discontinued'));
    expect(discontinued).toHaveLength(DISCONTINUED_COUNT);
    for (const card of discontinued) {
      expect(within(card).queryByRole('link', { name: /Open app/ })).not.toBeInTheDocument();
      expect(within(card).getByRole('link', { name: /Source/ })).toBeInTheDocument();
    }
  });

  it('should mark work-in-progress apps and still link them', () => {
    renderGallery();
    const card = screen.getAllByRole('article').find((article) => within(article).queryByText('polish-quest'))!;
    expect(within(card).getByText('wip')).toBeInTheDocument();
    expect(within(card).getByRole('link', { name: /Open app/ })).toHaveAttribute('href', 'https://polish.pladsen.dev');
  });

  it('should filter to discontinued apps', async () => {
    const user = renderGallery();
    await user.click(screen.getByRole('button', { name: /Discontinued/ }));
    expect(screen.getAllByRole('article')).toHaveLength(DISCONTINUED_COUNT);
  });

  it('should frame each screenshot in a browser window showing the app URL', () => {
    renderGallery();
    const [first] = screen.getAllByRole('article');
    expect(within(first).getByTestId('app-window')).toHaveTextContent(FEATURED_APPS[0].host);
    expect(within(first).getByRole('img', { name: /gamedev-studio screenshot/ })).toHaveAttribute('src', '/apps/gamedev-studio.jpg');
  });
});
