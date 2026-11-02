import type { ReactNode } from 'react';
import { CodeLine } from '../CodeLine.component';

const LINK_CLASS = 'text-site-accent hover:underline';

export function JourneyMd(): ReactNode {
  return (
    <div className="code">
      <CodeLine delay={0.05}>
        <span className="text-site-fn"># Journey</span>
      </CodeLine>
      <CodeLine delay={0.1} />
      <CodeLine delay={0.15}>
        <span className="text-site-num">## Work · 2022 – now</span>
      </CodeLine>
      <CodeLine delay={0.2}>
        Thrilled to be working as a full stack developer at{' '}
        <a href="https://abaris.no" target="_blank" rel="noreferrer" className={LINK_CLASS}>
          [Abaris Consulting AS](abaris.no)
        </a>
        .
      </CodeLine>
      <CodeLine delay={0.25} />
      <CodeLine delay={0.3}>
        <span className="text-site-num">## School · 2022 – 2024</span>
      </CodeLine>
      <CodeLine delay={0.35}>
        2 year frontend development course at{' '}
        <a href="https://noroff.no" target="_blank" rel="noreferrer" className={LINK_CLASS}>
          [Noroff](noroff.no)
        </a>
        . Graduated in 2024 with an A on the last exam.
      </CodeLine>
    </div>
  );
}
