'use client';

import type { ReactNode } from 'react';
import contactInfo from '@/lib/contactInfo';
import { useEditorState, type EditorTab } from '../EditorState.component';
import { PanelHeading, SIDEBAR_ROW } from './PanelHeading.component';

const FILES: { label: EditorTab; icon: string; colorClass: string }[] = [
  { label: 'page.tsx', icon: 'TS', colorClass: 'text-site-info' },
  { label: 'journey.md', icon: 'M↓', colorClass: 'text-site-muted' },
  { label: 'settings.json', icon: '⚙', colorClass: 'text-site-muted' },
  { label: '.env', icon: '$', colorClass: 'text-site-warn' },
];

export function Explorer(): ReactNode {
  const { tab, setTab } = useEditorState();
  return (
    <>
      <PanelHeading>EXPLORER</PanelHeading>
      <ul>
        {FILES.map((file) => (
          <li key={file.label}>
            <button type="button" onClick={() => setTab(file.label)} className={`${SIDEBAR_ROW} ${tab === file.label ? 'bg-site-hover text-site-fg' : ''}`}>
              <span className={`w-[18px] ${file.colorClass}`}>{file.icon}</span>
              {file.label}
            </button>
          </li>
        ))}
        {contactInfo.socials.map((social) => (
          <li key={social.application}>
            <a href={social.link} target="_blank" rel="noreferrer" className={SIDEBAR_ROW}>
              <span className="w-[18px]">↗</span>
              {social.application}.link
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
