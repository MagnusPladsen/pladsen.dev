'use client';

import type { ReactNode } from 'react';
import { useSiteContent } from '@/components/site/SiteContentProvider.component';
import { CodeLine, Comment, Num, Str } from '../CodeLine.component';

const Key = ({ children }: { children: string }): ReactNode => <span className="text-site-fn">&quot;{children}&quot;</span>;

export function SettingsJson(): ReactNode {
  const { theme, cycleTheme, accentDraft, setAccentDraft } = useSiteContent();

  return (
    <div className="code">
      <CodeLine delay={0.02}>
        <Comment>{'// Edit me. The whole site listens.'}</Comment>
      </CodeLine>
      <CodeLine delay={0.06}>{'{'}</CodeLine>
      <CodeLine delay={0.1}>
        {'  '}
        <Key>workbench.colorTheme</Key>:{' '}
        <button type="button" onClick={cycleTheme} title="Click to switch theme" className="text-site-str hover:underline focus-visible:underline">
          &quot;{theme}&quot;
        </button>
        ,
      </CodeLine>
      <CodeLine delay={0.14}>
        {'  '}
        <Key>pladsen.accent</Key>: <span aria-hidden="true" className="mr-1 inline-block h-[11px] w-[11px] border border-site-faint bg-site-accent align-middle" />
        <span className="text-site-str">&quot;</span>
        <input aria-label="pladsen.accent" spellCheck={false} className="code-input w-[8ch]" value={accentDraft} onChange={(event) => setAccentDraft(event.target.value)} />
        <span className="text-site-str">&quot;</span>,
      </CodeLine>
      <CodeLine delay={0.18}>
        {'  '}
        <Key>editor.fontFamily</Key>: <Str>&quot;Geist Mono&quot;</Str>,
      </CodeLine>
      <CodeLine delay={0.22}>
        {'  '}
        <Key>editor.cursorBlinking</Key>: <Str>&quot;phase&quot;</Str>,
      </CodeLine>
      <CodeLine delay={0.26}>
        {'  '}
        <Key>magnus.coffeePerDay</Key>: <Num>3</Num>
      </CodeLine>
      <CodeLine delay={0.3}>{'}'}</CodeLine>
    </div>
  );
}
