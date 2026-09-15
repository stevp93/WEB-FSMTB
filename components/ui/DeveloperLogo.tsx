import Image from 'next/image';
import { withBase } from '@/lib/asset';
import { EVENT } from '@/lib/event';
import { cx } from './cx';

/** Espacio reservado para la marca de SP Automatizaciones: muestra el logo cuando se defina en lib/event.ts. */
export function DeveloperLogo({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const { logo, name } = EVENT.developer;

  if (logo) {
    return (
      <Image
        src={withBase(logo.src)}
        alt={`Logo de ${name}`}
        width={logo.width}
        height={logo.height}
        sizes={size === 'lg' ? '192px' : '96px'}
        className={cx('w-auto object-contain', size === 'lg' ? 'max-h-24' : 'h-8')}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cx(
        'grid shrink-0 place-items-center rounded-xs border border-dashed border-line/50 font-display font-semibold text-ink-muted',
        size === 'lg' ? 'h-24 w-40 text-2xl' : 'h-8 w-12 text-xs',
      )}
    >
      SP
    </span>
  );
}
