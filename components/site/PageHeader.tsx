import type { ReactNode } from 'react';
import { ScenePoster } from './ScenePoster';

/** Cabecera de página: es la "ventana" por la que se ve el terreno (data-scene-window). */
export function PageHeader({ title, lead, children }: { title: string; lead?: ReactNode; children?: ReactNode }) {
  return (
    <header
      data-scene-window
      className="relative isolate flex min-h-[62svh] flex-col justify-end pb-12 pt-28 md:min-h-[58vh] md:pb-16 lg:pt-32"
    >
      <ScenePoster />
      <div className="frame">
        <h1 className="max-w-[17ch] font-display text-2xl font-semibold text-ink md:text-3xl xl:text-4xl">{title}</h1>
        {lead ? <p className="mt-5 max-w-measure-sm text-lg text-ink-muted md:text-xl">{lead}</p> : null}
        {children}
      </div>
    </header>
  );
}
