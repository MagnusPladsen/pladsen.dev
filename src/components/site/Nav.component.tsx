import Link from 'next/link';
import type { ReactNode } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/apps', label: 'Apps' },
  { href: '/repos', label: 'Repos' },
];

export function Nav(): ReactNode {
  return (
    <header className="tile flex flex-wrap items-center gap-4 rounded-full py-2.5 pl-5 pr-3 text-sm sm:gap-6">
      <Link href="/" className="font-mono font-medium">
        ~/pladsen<span className="text-site-accent">.dev</span>
      </Link>
      <span className="grow" />
      <nav aria-label="Main" className="flex gap-4 sm:gap-6">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-site-muted transition-colors duration-150 first:text-site-fg hover:text-site-fg focus-visible:text-site-fg"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
