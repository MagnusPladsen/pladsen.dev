import contactInfo from './contactInfo';

export interface DeveloperContent {
  name: string;
  role: string;
  location: string;
  tagline: string;
  about: string;
}

export interface FeaturedAppContent {
  name: string;
  desc: string;
}

export interface SiteContent {
  developer: DeveloperContent;
  ctas: { primary: string; cv: string };
  featured: FeaturedAppContent[];
  copy: { featuredTitle: string; allApps: string; browseRepos: string; footer: string };
}

export interface FeaturedApp {
  host: string;
  url: string;
  repo: string;
  tint: string;
  screenshot?: string;
}

export interface ListedApp extends FeaturedApp {
  name: string;
  desc: string;
  isDiscontinued: boolean;
  isWip?: boolean;
}

export const FEATURED_APPS: FeaturedApp[] = [
  { host: 'gamedev-studio.pladsen.dev', url: 'https://gamedev-studio.pladsen.dev', repo: 'https://github.com/MagnusPladsen/gamedev-studio', screenshot: '/apps/gamedev-studio.jpg', tint: '#f97316' },
  { host: 'proton-ish.pladsen.dev', url: 'https://proton-ish.pladsen.dev', repo: 'https://github.com/MagnusPladsen/Proton-ish', screenshot: '/apps/proton-ish.jpg', tint: '#6366f1' },
  { host: 'cvapp.pladsen.dev', url: 'https://cvapp.pladsen.dev', repo: 'https://github.com/MagnusPladsen/cv-app', screenshot: '/apps/cvapp.jpg', tint: '#10b981' },
  { host: 'lane-kalkulator.pladsen.dev', url: 'https://lane-kalkulator.pladsen.dev', repo: 'https://github.com/MagnusPladsen/lane-kalkulator', screenshot: '/apps/lane-kalkulator.jpg', tint: '#0ea5e9' },
];

export const MORE_APPS: ListedApp[] = [
  { name: 'hordejakten-2026', desc: '', host: 'horde.pladsen.dev', url: 'https://horde.pladsen.dev', repo: 'https://github.com/MagnusPladsen/hordejakten-2026', screenshot: '/apps/hordejakten.jpg', tint: '#ec4899', isDiscontinued: false },
  { name: 'vaktmester-herstad', desc: '', host: 'herstad.pladsen.dev', url: 'https://herstad.pladsen.dev', repo: 'https://github.com/MagnusPladsen/vaktmester-herstad', screenshot: '/apps/herstad.jpg', tint: '#10b981', isDiscontinued: false },
  { name: 'ozonbehandling', desc: '', host: 'ozonbehandling.no', url: 'https://www.ozonbehandling.no', repo: 'https://github.com/MagnusPladsen/ozonbehandling', screenshot: '/apps/ozonbehandling.jpg', tint: '#0ea5e9', isDiscontinued: false },
  { name: 'vanillammer', desc: '', host: 'vanillammer.pladsen.dev', url: 'https://vanillammer.pladsen.dev', repo: 'https://github.com/MagnusPladsen/vanillammer', screenshot: '/apps/vanillammer.jpg', tint: '#fbbf24', isDiscontinued: false },
  { name: 'Productivity-App', desc: 'App using my other repo, Productivity-Stack', host: 'productivity.pladsen.dev', url: 'https://productivity.pladsen.dev', repo: 'https://github.com/MagnusPladsen/Productivity-App', screenshot: '/apps/productivity-app.jpg', tint: '#a855f7', isDiscontinued: false },
  { name: 'BarPro', desc: 'BarPro - startup website', host: 'barpro.pladsen.dev', url: 'https://barpro.pladsen.dev', repo: 'https://github.com/MagnusPladsen/BarPro', screenshot: '/apps/barpro.jpg', tint: '#f97316', isDiscontinued: false },
  { name: 'basekit-ui', desc: 'Simple base UI component library for REACT – install and use it immediately, no configuration required.', host: 'basekitui.pladsen.dev', url: 'https://basekitui.pladsen.dev', repo: 'https://github.com/MagnusPladsen/basekit-ui', screenshot: '/apps/basekit-ui.jpg', tint: '#6366f1', isDiscontinued: true },
  { name: 'polish-quest', desc: '', host: 'polish.pladsen.dev', url: 'https://polish.pladsen.dev', repo: 'https://github.com/MagnusPladsen/polish-quest', screenshot: '/apps/polish-quest.jpg', tint: '#ec4899', isDiscontinued: false, isWip: true },
  { name: 'cv-app', desc: 'Free web application for creating a CV', host: 'cv-app-wheat-gamma.vercel.app', url: 'https://cv-app-wheat-gamma.vercel.app', repo: 'https://github.com/MagnusPladsen/cv-app', tint: '#10b981', isDiscontinued: true },
  { name: 'Cashflow', desc: '', host: 'cashflow-magnus-pladsens-projects.vercel.app', url: 'https://cashflow-magnus-pladsens-projects.vercel.app', repo: 'https://github.com/MagnusPladsen/Cashflow', tint: '#0ea5e9', isDiscontinued: true },
  { name: 'cheatsheet-app', desc: 'Keybinding cheatsheet app — fetches live from dotfiles', host: 'my-cheatsheet-eta.vercel.app', url: 'https://my-cheatsheet-eta.vercel.app', repo: 'https://github.com/MagnusPladsen/cheatsheet-app', tint: '#fbbf24', isDiscontinued: true },
];

export const DEFAULT_CONTENT: SiteContent = {
  developer: {
    name: contactInfo.fullName,
    role: contactInfo.role,
    location: contactInfo.location,
    tagline: 'Building modern web applications with React, Next.js & Tailwind CSS',
    about:
      'Frontend-focused developer with a strong foundation in React development. Passionate about creating intuitive user interfaces and exploring full-stack technologies to build modern web applications.',
  },
  ctas: { primary: 'See my apps', cv: 'Download CV' },
  featured: [
    { name: 'gamedev-studio', desc: 'Free, open source game development toolkit — pixel art, music, SFX, tilemaps and more.' },
    { name: 'Proton-ish', desc: 'Steam Play for macOS' },
    { name: 'cv-app-new', desc: 'New version of cv-app created from the beginning.' },
    { name: 'lane-kalkulator', desc: '' },
  ],
  copy: { featuredTitle: 'featured apps', allApps: 'All apps', browseRepos: 'Browse all repos', footer: 'deployed' },
};
