import type { CSSProperties, ReactNode } from 'react';

export function CodeLine({ children, delay = 0 }: { children?: ReactNode; delay?: number }): ReactNode {
  const style: CSSProperties = { animationDelay: `${delay}s` };
  return (
    <div className="code-line" style={style}>
      <span>{children ?? ' '}</span>
    </div>
  );
}

export function EditableString({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }): ReactNode {
  return (
    <>
      <span className="text-site-str">&apos;</span>
      <input
        aria-label={label}
        className="code-input"
        spellCheck={false}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{ width: `${Math.min(Math.max(value.length, 2), 48)}ch` }}
      />
      <span className="text-site-str">&apos;</span>
    </>
  );
}

export const Keyword = ({ children }: { children: ReactNode }): ReactNode => <span className="text-site-kw">{children}</span>;
export const Fn = ({ children }: { children: ReactNode }): ReactNode => <span className="text-site-fn">{children}</span>;
export const Str = ({ children }: { children: ReactNode }): ReactNode => <span className="text-site-str">{children}</span>;
export const Num = ({ children }: { children: ReactNode }): ReactNode => <span className="text-site-num">{children}</span>;
export const Comment = ({ children }: { children: ReactNode }): ReactNode => <span className="text-site-com">{children}</span>;
