'use client';

import type { ReactNode } from 'react';
import { useSiteContent, type FieldPath } from '@/components/site/SiteContentProvider.component';
import { FEATURED_APPS, type SiteContent } from '@/lib/site-content';
import { CodeLine, EditableString, Fn, Keyword, Comment } from '../CodeLine.component';
import { useEditorState } from '../EditorState.component';

type GroupName = 'developer' | 'ctas' | 'copy';

function GroupLines({ group, content, setField }: { group: GroupName; content: SiteContent; setField: (path: FieldPath, value: string) => void }): ReactNode {
  return Object.entries(content[group]).map(([key, value]) => (
    <CodeLine key={key} delay={0.2}>
      {'  '}
      {key}: <EditableString label={`${group}.${key}`} value={value} onChange={(next) => setField([group, key] as FieldPath, next)} />,
    </CodeLine>
  ));
}

function DeveloperHint({ name, role }: { name: string; role: string }): ReactNode {
  const { findEgg } = useEditorState();
  return (
    <span onMouseEnter={() => findEgg('type-hint')} className="group relative cursor-help border-b border-dotted border-site-faint text-site-fn">
      developer
      <span role="tooltip" className="absolute left-0 top-6 z-10 hidden whitespace-pre rounded-lg border border-site-tile-border bg-site-pop px-3 py-2.5 text-xs leading-relaxed text-site-text2 shadow-2xl group-hover:block">
        <Keyword>const</Keyword> <Fn>developer</Fn>: {'{'}
        {`\n  name: string;  // "${name}"\n  role: string;  // "${role}"\n  work: { at: string; since: 2022 };\n}`}
      </span>
    </span>
  );
}

function VisitorCursor(): ReactNode {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute z-[3]" style={{ left: 120, top: 58, animation: 'wander 14s ease-in-out infinite' }}>
      <span className="block h-5 w-0.5 bg-site-cyan" />
      <span className="absolute -top-4 left-0 whitespace-nowrap rounded-sm rounded-bl-none bg-site-cyan px-1 font-mono text-[10px] text-site-ink">visitor</span>
    </span>
  );
}

export function PageTsx(): ReactNode {
  const { content, setField } = useSiteContent();

  return (
    <div className="code relative">
      <VisitorCursor />
      <CodeLine delay={0.05}>
        <Keyword>import type</Keyword> {'{ '}
        <Fn>Developer</Fn>, <Fn>App</Fn>
        {' }'} <Keyword>from</Keyword> <span className="text-site-str">&apos;@/types&apos;</span>;
      </CodeLine>
      <CodeLine delay={0.1} />
      <CodeLine delay={0.15}>
        <Keyword>export const</Keyword> <DeveloperHint name={content.developer.name} role={content.developer.role} /> = {'{'}
      </CodeLine>
      <GroupLines group="developer" content={content} setField={setField} />
      <CodeLine delay={0.25}>
        {'  '}work: {'{'} at: <span className="text-site-str">&apos;Abaris Consulting AS&apos;</span>, since: <span className="text-site-num">2022</span> {'}'},
      </CodeLine>
      <CodeLine delay={0.3}>
        {'}'} <Keyword>satisfies</Keyword> <Fn>Developer</Fn>;
      </CodeLine>
      <CodeLine delay={0.3} />
      <CodeLine delay={0.35}>
        <Keyword>export const</Keyword> <Fn>ctas</Fn> = {'{'}
      </CodeLine>
      <GroupLines group="ctas" content={content} setField={setField} />
      <CodeLine delay={0.35}>{'};'}</CodeLine>
      <CodeLine delay={0.4} />
      <CodeLine delay={0.4}>
        <Keyword>export const</Keyword> <Fn>featured</Fn>: <Fn>App</Fn>[] = [
      </CodeLine>
      {content.featured.map((app, index) => (
        <CodeLine key={FEATURED_APPS[index].url} delay={0.45}>
          {'  { '}name: <EditableString label={`featured[${index}].name`} value={app.name} onChange={(next) => setField(['featured', index, 'name'], next)} />, desc:{' '}
          <EditableString label={`featured[${index}].desc`} value={app.desc} onChange={(next) => setField(['featured', index, 'desc'], next)} />
          {' },'}
        </CodeLine>
      ))}
      <CodeLine delay={0.45}>];</CodeLine>
      <CodeLine delay={0.5} />
      <CodeLine delay={0.5}>
        <Keyword>export const</Keyword> <Fn>copy</Fn> = {'{'}
      </CodeLine>
      <GroupLines group="copy" content={content} setField={setField} />
      <CodeLine delay={0.5}>{'};'}</CodeLine>
      <CodeLine delay={0.55} />
      <CodeLine delay={0.55}>
        <Comment>{'// pushes + stats: api.github.com, revalidate 3600 (read-only)'}</Comment>
      </CodeLine>
      <CodeLine delay={0.6}>
        <span className="inline-block w-0 overflow-hidden whitespace-nowrap align-bottom italic text-site-faint" style={{ animation: 'ghost 9s ease-in-out 2s infinite' }}>
          {'// TODO: ship gamedev-studio 1.0 this weekend'}
        </span>
      </CodeLine>
      <CodeLine delay={0.6}>
        <Keyword>export default function</Keyword> <Fn>Home</Fn>() {'{'}
      </CodeLine>
      <CodeLine delay={0.65}>
        {'  '}
        <Keyword>return</Keyword> &lt;<Fn>Hero</Fn> {'{...'}
        <Fn>developer</Fn>
        {'}'} ctas={'{'}
        <Fn>ctas</Fn>
        {'}'} /&gt;;
      </CodeLine>
      <CodeLine delay={0.7}>{'}'}</CodeLine>
    </div>
  );
}
