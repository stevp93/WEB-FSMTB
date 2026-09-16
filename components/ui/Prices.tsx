import { EVENT, formatCOP } from '@/lib/event';
import { cx } from './cx';

/** Los dos valores del evento, siempre juntos: inscripción e indumentaria opcional. */
export function Prices({ className, align = 'start' }: { className?: string; align?: 'start' | 'end' }) {
  const { apparel } = EVENT;
  return (
    <dl className={cx('flex flex-wrap gap-x-8 gap-y-3', align === 'end' && 'lg:justify-end', className)}>
      <div className="flex flex-col-reverse">
        <dt className="text-sm text-ink-muted">Inscripción</dt>
        <dd className="tabular font-display text-2xl font-semibold text-ink">{formatCOP(EVENT.price)}</dd>
      </div>
      <div className="flex flex-col-reverse">
        <dt className="text-sm text-ink-muted">
          {apparel.label} <span className="sr-only">({apparel.items})</span>
        </dt>
        <dd className="tabular font-display text-2xl font-semibold text-ink">{formatCOP(apparel.price)}</dd>
      </div>
    </dl>
  );
}
