import type { ReactNode } from 'react';
import techData from '@/components/tech/tech.data';
import { PanelHeading } from './PanelHeading.component';

export const EXTENSION_COUNT = techData.reduce((sum, group) => sum + group.techs.length, 0);

export function Extensions(): ReactNode {
  return (
    <>
      <PanelHeading>EXTENSIONS · {EXTENSION_COUNT} INSTALLED</PanelHeading>
      {techData.map((group) => (
        <section key={group.name} aria-label={group.name}>
          <h4 className="px-3.5 pb-1 pt-2.5 font-mono text-[10px] font-normal tracking-wider text-site-dim">▾ {group.name.toUpperCase()}</h4>
          <ul>
            {group.techs.map((tech) => (
              <li key={tech.name}>
                <a href={tech.link} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 px-3.5 py-1.5 transition-colors duration-150 hover:bg-site-hover focus-visible:bg-site-hover">
                  <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-md p-1" style={{ background: tech.bgColor }}>
                    {tech.icon && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={tech.icon} alt="" className="h-full w-full object-contain" />
                    )}
                  </span>
                  <span className="flex min-w-0 grow flex-col">
                    <span className="text-[13px] font-semibold text-site-fg">{tech.name}</span>
                    <span className="truncate text-[11px] text-site-dim">{tech.blurb}</span>
                  </span>
                  <span className="rounded border border-site-tile-border px-1.5 py-0.5 font-mono text-[9px] text-site-muted">Installed</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
