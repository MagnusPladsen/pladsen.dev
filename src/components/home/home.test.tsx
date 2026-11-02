import { render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { SiteContentProvider } from '@/components/site/SiteContentProvider.component';
import contactInfo from '@/lib/contactInfo';
import { TEST_NOW, makeEmptySnapshot, makeSnapshot } from '@/test/snapshot';
import { FeaturedApps } from './FeaturedApps.component';
import { GitHubStats } from './GitHubStats.component';
import { Hero } from './Hero.component';
import { LatestPushes } from './LatestPushes.component';

const renderInProvider = (node: ReactNode) => render(<SiteContentProvider>{node}</SiteContentProvider>);

describe('Hero', () => {
  it('should show the name, role and both taglines', () => {
    renderInProvider(<Hero isCvAvailable />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Magnus Pladsen');
    expect(screen.getByText('Full-stack developer')).toBeInTheDocument();
    expect(screen.getByText(/Building modern web applications/)).toBeInTheDocument();
    expect(screen.getByText(/Frontend-focused developer/)).toBeInTheDocument();
  });

  it('should link the CTAs and socials', () => {
    renderInProvider(<Hero isCvAvailable />);
    expect(screen.getByRole('link', { name: /See my apps/ })).toHaveAttribute('href', '/apps');
    const cv = screen.getByRole('link', { name: /Download CV/ });
    expect(cv).toHaveAttribute('href', '/cv.pdf');
    expect(cv).toHaveAttribute('download', 'Magnus-Pladsen-CV.pdf');
    for (const social of contactInfo.socials) {
      expect(screen.getByRole('link', { name: new RegExp(social.application, 'i') })).toHaveAttribute('href', social.link);
    }
  });

  it('should hide the CV link when no CV file exists', () => {
    renderInProvider(<Hero isCvAvailable={false} />);
    expect(screen.queryByRole('link', { name: /Download CV/ })).not.toBeInTheDocument();
  });
});

describe('LatestPushes', () => {
  it('should render one row per recent repo with HEAD on the newest', () => {
    renderInProvider(<LatestPushes snapshot={makeSnapshot()} now={TEST_NOW} />);
    const rows = screen.getAllByRole('link', { name: /^push / });
    expect(rows).toHaveLength(6);
    expect(within(rows[0]).getByText('HEAD')).toBeInTheDocument();
    expect(screen.getByText('/repos?sort=pushed')).toBeInTheDocument();
    expect(screen.getByText(/synced 12 min ago/)).toBeInTheDocument();
  });

  it('should show diff stats when GitHub returned them', () => {
    const snapshot = makeSnapshot();
    const commit = snapshot.recent[0].commits[0];
    renderInProvider(<LatestPushes snapshot={snapshot} now={TEST_NOW} />);
    expect(screen.getAllByText(`+${commit.additions}`)[0]).toBeInTheDocument();
  });

  it('should omit diff stats when additions are unknown', () => {
    const snapshot = makeSnapshot();
    snapshot.recent = snapshot.recent.map((repo) => ({ ...repo, commits: repo.commits.map((commit) => ({ ...commit, additions: null, deletions: null })) }));
    renderInProvider(<LatestPushes snapshot={snapshot} now={TEST_NOW} />);
    expect(screen.queryByTestId('diff-bar')).not.toBeInTheDocument();
  });

  it('should show an empty state when GitHub was unreachable', () => {
    renderInProvider(<LatestPushes snapshot={makeEmptySnapshot()} now={TEST_NOW} />);
    expect(screen.getByText(/couldn't reach GitHub/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Browse all repos/ })).toHaveAttribute('href', 'https://github.com/MagnusPladsen?tab=repositories');
  });
});

describe('GitHubStats', () => {
  it('should show totals', () => {
    renderInProvider(<GitHubStats snapshot={makeSnapshot()} />);
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText(/1 fork/)).toBeInTheDocument();
  });

  it('should omit the heatmap without contribution data', () => {
    renderInProvider(<GitHubStats snapshot={makeSnapshot({ contributions: null })} />);
    expect(screen.queryByTestId('heatmap')).not.toBeInTheDocument();
  });
});

describe('FeaturedApps', () => {
  it('should render the four featured apps in order', () => {
    renderInProvider(<FeaturedApps />);
    const names = screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);
    expect(names).toEqual(['gamedev-studio', 'Proton-ish', 'cv-app-new', 'lane-kalkulator']);
  });

  it('should leave out the description line for an app without one', () => {
    renderInProvider(<FeaturedApps />);
    const card = screen.getByRole('link', { name: /lane-kalkulator/ });
    expect(within(card).queryByTestId('app-desc')).not.toBeInTheDocument();
  });
});
