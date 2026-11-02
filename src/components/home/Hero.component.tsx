'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useSiteContent } from '@/components/site/SiteContentProvider.component';
import contactInfo from '@/lib/contactInfo';

const CTA_CLASS =
  'flex justify-between rounded-xl border border-site-tile-border px-4 py-3 text-site-fg transition-colors duration-150 hover:border-site-accent focus-visible:border-site-accent';

export function Hero({ isCvAvailable }: { isCvAvailable: boolean }): ReactNode {
  const { content } = useSiteContent();
  const { developer, ctas } = content;

  return (
    <section className="flex flex-col gap-10 pb-10 pt-16 md:flex-row md:items-end md:gap-12 md:pt-20">
      <div className="min-w-0 flex-1">
        <p className="rise font-mono text-[15px] text-site-muted">
          <span className="text-site-ok">$</span> <span className="typed">curl pladsen.dev/api/me</span>
          <span className="caret" />
        </p>
        <h1
          className="rise shine mt-4 min-h-[0.95em] break-words text-[clamp(48px,8vw,96px)] font-extrabold leading-[0.95] tracking-[-0.04em]"
          style={{ animationDelay: '1.4s' }}
        >
          {developer.name}
        </h1>
        <p className="rise mt-3 text-2xl text-site-accent" style={{ animationDelay: '1.5s' }}>
          {developer.role}
        </p>
        <p className="rise mt-5 max-w-[600px] leading-relaxed text-site-muted" style={{ animationDelay: '1.6s' }}>
          {developer.tagline}
        </p>
        <p className="rise mt-1.5 max-w-[600px] leading-relaxed text-site-muted" style={{ animationDelay: '1.65s' }}>
          {developer.about}
        </p>
        <p className="rise mt-3 hidden font-mono text-xs text-site-faint md:block" style={{ animationDelay: '1.7s' }}>
          ↓ psst — this text is live. Edit it in page.tsx below.
        </p>
      </div>
      <div className="rise flex flex-col gap-2.5 text-sm md:w-64" style={{ animationDelay: '1.7s' }}>
        <Link
          href="/apps"
          className="flex justify-between rounded-xl bg-site-accent px-4 py-3 font-semibold text-site-ink transition-opacity duration-150 hover:opacity-90"
        >
          {ctas.primary} <span aria-hidden="true">→</span>
        </Link>
        {isCvAvailable && (
          <a className={CTA_CLASS} href="/cv.pdf" download="Magnus-Pladsen-CV.pdf">
            {ctas.cv} <span className="font-mono text-site-dim">.pdf</span>
          </a>
        )}
        <div className="flex gap-2">
          {contactInfo.socials.map((social) => (
            <a
              key={social.application}
              href={social.link}
              target="_blank"
              rel="noreferrer"
              className={`${CTA_CLASS} min-h-11 flex-1 justify-center px-2 capitalize text-site-muted`}
            >
              {social.application === 'github' ? 'GitHub' : social.application === 'linkedin' ? 'LinkedIn' : 'Discord'}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
