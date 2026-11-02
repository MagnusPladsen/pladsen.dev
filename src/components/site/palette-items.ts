import contactInfo from '@/lib/contactInfo';
import { CV_URL } from '@/lib/cv';
import type { Repo } from '@/lib/github/types';
import { DEFAULT_CONTENT, FEATURED_APPS, MORE_APPS, type ListedApp } from '@/lib/site-content';

export type PaletteGroup = 'Pages' | 'Links' | 'Apps' | 'Repos';

export interface PaletteItem {
  id: string;
  label: string;
  hint: string;
  group: PaletteGroup;
  href: string;
  isExternal: boolean;
}

const PAGES: PaletteItem[] = [
  { id: 'page-home', label: 'Home', hint: '/', group: 'Pages', href: '/', isExternal: false },
  { id: 'page-apps', label: 'Apps', hint: '/apps', group: 'Pages', href: '/apps', isExternal: false },
  { id: 'page-repos', label: 'Repos', hint: '/repos', group: 'Pages', href: '/repos', isExternal: false },
];

const LINKS: PaletteItem[] = [
  { id: 'link-cv', label: 'Download CV', hint: 'cv.pladsen.dev', group: 'Links', href: CV_URL, isExternal: true },
  ...contactInfo.socials.map((social) => ({
    id: `link-${social.application}`,
    label: social.application === 'github' ? 'GitHub' : social.application === 'linkedin' ? 'LinkedIn' : 'Discord',
    hint: new URL(social.link).host,
    group: 'Links' as const,
    href: social.link,
    isExternal: true,
  })),
];

function getAppItems(): PaletteItem[] {
  const featured = FEATURED_APPS.map((app, index) => ({ ...app, name: DEFAULT_CONTENT.featured[index].name, isDiscontinued: false }));
  return [...featured, ...MORE_APPS].map((app: Pick<ListedApp, 'name' | 'host' | 'url' | 'repo' | 'isDiscontinued' | 'isWip'>) => ({
    id: `app-${app.name}`,
    label: app.name,
    hint: app.isDiscontinued ? 'discontinued · source' : app.isWip ? `wip · ${app.host}` : app.host,
    group: 'Apps',
    href: app.isDiscontinued ? app.repo : app.url,
    isExternal: true,
  }));
}

export function getPaletteItems(repos: Repo[]): PaletteItem[] {
  const repoItems: PaletteItem[] = repos.map((repo) => ({ id: `repo-${repo.name}`, label: repo.name, hint: repo.language ?? 'repo', group: 'Repos', href: repo.url, isExternal: true }));
  return [...PAGES, ...LINKS, ...getAppItems(), ...repoItems];
}
