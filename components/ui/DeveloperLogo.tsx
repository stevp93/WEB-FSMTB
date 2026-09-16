import Image from 'next/image';
import { withBase } from '@/lib/asset';
import { EVENT } from '@/lib/event';
import { cx } from './cx';

/** Marca de SP Automatizaciones: símbolo compacto en el pie, logo completo en Aliados. */
/** decorative: el nombre ya aparece como texto junto al logo. */
export function DeveloperLogo({ size = 'sm', decorative = false }: { size?: 'sm' | 'lg'; decorative?: boolean }) {
  const { logo, mark, name } = EVENT.developer;
  const asset = size === 'lg' ? logo : mark;

  return (
    <Image
      src={withBase(asset.src)}
      alt={decorative ? '' : `Logo de ${name}`}
      width={asset.width}
      height={asset.height}
      className={cx('w-auto shrink-0 object-contain', size === 'lg' ? 'h-28 md:h-32' : 'h-8')}
    />
  );
}
