import { cx } from './cx';

type Variant = 'primary' | 'secondary';
type Size = 'md' | 'lg';

/** Clases compartidas por <button>, <Link> y <a>: la acción se ve igual sin importar el elemento. */
export function buttonClass(variant: Variant = 'primary', size: Size = 'md', extra?: string) {
  return cx(
    'inline-flex items-center justify-center gap-2 rounded-sm font-sans font-semibold transition-colors duration-150 ease-out',
    'disabled:cursor-not-allowed disabled:opacity-70',
    size === 'md' ? 'min-h-11 px-5 text-base' : 'min-h-14 px-7 text-lg',
    variant === 'primary' && 'bg-cta text-ink-on-cta hover:bg-cta-hover',
    variant === 'secondary' && 'border border-line/45 text-ink hover:border-ink',
    extra,
  );
}

export const inlineLinkClass =
  'font-semibold text-accent underline decoration-accent/40 decoration-2 underline-offset-4 transition-colors duration-150 hover:decoration-accent';
