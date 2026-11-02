import { EVENT, formatCOP } from '@/lib/event';
import { GROUP_MESSAGE, whatsappLink } from '@/lib/whatsapp';
import { cx } from './cx';
import { inlineLinkClass } from './button';

/** Único valor de venta (la inscripción) y el aviso de descuento para grupos. */
export function Prices({ className, align = 'start' }: { className?: string; align?: 'start' | 'end' }) {
  return (
    <div className={cx('flex flex-col gap-2', align === 'end' && 'lg:items-end lg:text-right', className)}>
      <dl className="flex flex-col-reverse">
        <dt className="text-sm text-ink-muted">Inscripción</dt>
        <dd className="tabular font-display text-2xl font-semibold text-ink">{formatCOP(EVENT.price)}</dd>
      </dl>
      <p className="max-w-measure-sm text-sm text-ink-muted">
        ¿Grupo de más de {EVENT.groupDiscount.minPeople} personas? Tienen descuento:{' '}
        <a href={whatsappLink(GROUP_MESSAGE)} target="_blank" rel="noopener noreferrer" className={inlineLinkClass}>
          escríbenos por WhatsApp
        </a>
        .
      </p>
    </div>
  );
}
