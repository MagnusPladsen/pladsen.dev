'use client';

import type { ReactNode } from 'react';
import { useSiteContent } from '@/components/site/SiteContentProvider.component';
import contactInfo from '@/lib/contactInfo';
import { formatRelative } from '@/lib/github/transform';

export function HomeFooter({ deployedAt, now }: { deployedAt: string; now: string }): ReactNode {
  const { content } = useSiteContent();
  return (
    <footer className="mt-16 flex flex-wrap gap-4 border-t border-site-line pb-12 pt-3.5 font-mono text-xs text-site-dim">
      <span className="text-site-accent">⎇ main</span>
      <span>
        ✓ {content.copy.footer} {formatRelative(deployedAt, new Date(now))} ago
      </span>
      <span className="grow" />
      {contactInfo.socials.slice(0, 2).map((social) => (
        <a key={social.application} href={social.link} target="_blank" rel="noreferrer" className="capitalize hover:text-site-fg">
          {social.application === 'github' ? 'GitHub' : 'LinkedIn'}
        </a>
      ))}
    </footer>
  );
}
