import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SiteContentProvider } from '@/components/site/SiteContentProvider.component';
import { FEATURED_APPS } from '@/lib/site-content';
import { AppGallery } from './AppGallery.component';

describe('AppGallery', () => {
  it('should show every app with a live link and its source', () => {
    render(
      <SiteContentProvider>
        <AppGallery />
      </SiteContentProvider>,
    );
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(FEATURED_APPS.length);
    FEATURED_APPS.forEach((app, index) => {
      expect(within(cards[index]).getByRole('link', { name: /Open app/ })).toHaveAttribute('href', app.url);
      expect(within(cards[index]).getByRole('link', { name: /Source/ })).toHaveAttribute('href', app.repo);
    });
  });

  it('should show the screenshot when an app has one', () => {
    render(
      <SiteContentProvider>
        <AppGallery />
      </SiteContentProvider>,
    );
    expect(screen.getByRole('img', { name: /gamedev-studio screenshot/ })).toHaveAttribute('src', '/apps/gamedev-studio.jpg');
  });
});
