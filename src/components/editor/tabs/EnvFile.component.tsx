import type { ReactNode } from 'react';
import { CodeLine, Comment } from '../CodeLine.component';

const BLURRED_SECRETS = [
  ['GITHUB_TOKEN', 'ghp_9fK2xQ7mZ1aB8cD4eF6gH0'],
  ['DATABASE_URL', 'postgres://magnus:hunter2@db:5432'],
  ['COFFEE_SUPPLY', 'critically-low'],
  ['NUCLEAR_LAUNCH_CODES', '00000000 # same as my luggage'],
];

export function EnvFile(): ReactNode {
  return (
    <div className="code">
      <CodeLine delay={0.02}>
        <Comment># you found the .env — nothing to see here</Comment>
      </CodeLine>
      <CodeLine delay={0.06}>
        <span className="text-site-fn">SECRET_KEY</span>=<span className="text-site-str">nice-try</span>
      </CodeLine>
      {BLURRED_SECRETS.map(([key, value], index) => (
        <CodeLine key={key} delay={0.1 + index * 0.04}>
          <span className="text-site-fn">{key}</span>=
          <span aria-hidden="true" className="select-none text-site-str blur-[5px]">
            {value}
          </span>
        </CodeLine>
      ))}
    </div>
  );
}
