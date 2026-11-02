import type { ReactNode } from 'react';
import type { GitHubSnapshot } from '@/lib/github/types';

const HEATMAP_OPACITY = ['0.08', '0.25', '0.45', '0.7', '1'];

export function GitHubStats({ snapshot }: { snapshot: GitHubSnapshot }): ReactNode {
  const { totals, languages, contributions } = snapshot;
  const forkLabel = `${totals.forks} fork${totals.forks === 1 ? '' : 's'}`;

  return (
    <section aria-labelledby="stats-title" className="tile flex min-w-0 flex-col gap-4 p-6" style={{ animationDelay: '.25s' }}>
      <h2 id="stats-title" className="section-label">
        <span className="method-badge">GET</span> /github/stats
      </h2>
      <dl className="grid grid-cols-2 gap-3.5">
        <div>
          <dd className="text-[34px] font-extrabold">{totals.publicRepos}</dd>
          <dt className="font-mono text-[11px] text-site-dim">&quot;publicRepos&quot;</dt>
        </div>
        <div>
          <dd className="text-[34px] font-extrabold">{totals.originals}</dd>
          <dt className="font-mono text-[11px] text-site-dim">&quot;originals&quot; · {forkLabel}</dt>
        </div>
      </dl>
      {languages.length > 0 && (
        <>
          <div aria-hidden="true" className="flex h-2 gap-0.5 overflow-hidden rounded">
            {languages.map((language) => (
              <span key={language.name} style={{ flex: language.count, background: language.color }} />
            ))}
          </div>
          <ul className="flex flex-wrap gap-2.5 font-mono text-[11px] text-site-muted">
            {languages.map((language) => (
              <li key={language.name}>
                <span style={{ color: language.color }}>●</span> {language.name}
              </li>
            ))}
          </ul>
        </>
      )}
      {contributions && (
        <div data-testid="heatmap" aria-label="Contributions over the last 26 weeks" role="img" className="mt-auto grid grid-flow-col grid-cols-[repeat(26,minmax(0,1fr))] grid-rows-4 gap-0.5">
          {contributions.map((level, index) => (
            // Cells are positional; the index is their identity.
            <span key={index} className="aspect-square rounded-sm bg-site-accent" style={{ opacity: HEATMAP_OPACITY[level] }} />
          ))}
        </div>
      )}
    </section>
  );
}
