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
  tint: string;
  screenshot?: string;
}

export const FEATURED_APPS: FeaturedApp[] = [
  { host: 'gamedev-studio.pladsen.dev', url: 'https://gamedev-studio.pladsen.dev', tint: 'linear-gradient(135deg,#f97316,#fbbf24)' },
  { host: 'proton-ish-site', url: 'https://proton-ish-site-magnus-pladsens-projects.vercel.app', tint: 'linear-gradient(135deg,#6366f1,#a855f7)' },
  { host: 'cv-app-phi-eight.vercel.app', url: 'https://cv-app-phi-eight.vercel.app', tint: 'linear-gradient(135deg,#10b981,#84cc16)' },
  { host: 'lane-kalkulator.vercel.app', url: 'https://lane-kalkulator.vercel.app', tint: 'linear-gradient(135deg,#0ea5e9,#22d3ee)' },
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
