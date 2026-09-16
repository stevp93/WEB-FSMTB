import type { Metadata } from 'next';
import Image from 'next/image';
import { FileDown } from 'lucide-react';
import { PageHeader } from '@/components/site/PageHeader';
import { KitIcon } from '@/components/ui/KitIcon';
import { Prices } from '@/components/ui/Prices';
import { RegisterLink } from '@/components/ui/RegisterLink';
import { buttonClass, inlineLinkClass } from '@/components/ui/button';
import { cx } from '@/components/ui/cx';
import { withBase } from '@/lib/asset';
import { EVENT, INCLUDES, PRIZES, ROUTES, formatCOP } from '@/lib/event';
import indumentaria from '@/public/images/indumentaria-opcional.webp';

const PODIUM_LABELS = ['Primero', 'Segundo', 'Tercero'];
const podiumTotal = PRIZES.podium.reduce((sum, value) => sum + value, 0);

export const metadata: Metadata = {
  title: 'Kit, servicios y premiación',
  description: `Inscripción de ${formatCOP(EVENT.price)} con número y chip, medalla Finishers, fotografía profesional, seguro de accidentes, avituallamiento y premiación. ${EVENT.apparel.label}: ${formatCOP(EVENT.apparel.price)}.`,
  alternates: { canonical: '/kit-servicios' },
};

export default function KitServiciosPage() {
  const { apparel } = EVENT;

  return (
    <>
      <PageHeader title="Kit, servicios y premiación" lead="Todo lo que incluye tu inscripción y la indumentaria oficial de la edición.">
        <Prices className="mt-8" />
      </PageHeader>

      <section aria-labelledby="incluye" className="pb-20 md:pb-28">
        <div className="frame">
          <h2 id="incluye" className="font-display text-xl font-semibold text-ink md:text-2xl">
            Lo que incluye tu inscripción de {formatCOP(EVENT.price)}
          </h2>
          <div className="mt-8 grid gap-12 md:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:gap-12">
            {INCLUDES.map((group) => (
              <section key={group.id} aria-labelledby={`incluye-${group.id}`}>
                <h3 id={`incluye-${group.id}`} className="font-display text-lg font-semibold text-ink">
                  {group.title}
                </h3>
                <ul className="mt-4 border-t border-line/20">
                  {group.items.map((item) => (
                    <li key={item.label} className="flex min-h-14 items-center gap-4 border-b border-line/20 py-3">
                      <KitIcon name={item.icon} className="size-6 shrink-0 text-accent" />
                      <span className="text-lg text-ink">{item.label}</span>
                      {item.route ? (
                        <span className="ml-auto inline-flex shrink-0 items-center gap-2 text-sm text-ink-muted">
                          <span
                            aria-hidden
                            className={cx('h-[3px] w-4 rounded-full', item.route === 'carrera' ? 'bg-route-carrera' : 'bg-route-travesia')}
                          />
                          {ROUTES[item.route].name}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="indumentaria" className="border-t border-line/15 py-20 md:py-28">
        <div className="frame grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-5">
            <p className="text-sm font-semibold text-accent">Se vende por separado</p>
            <h2 id="indumentaria" className="mt-2 font-display text-xl font-semibold text-ink md:text-2xl">
              {apparel.label}
            </h2>
            <p className="tabular mt-4 font-display text-3xl font-semibold text-ink">{formatCOP(apparel.price)}</p>
            <p className="mt-5 max-w-measure-sm text-lg text-ink-muted">
              Kit de indumentaria de la edición: Jersey Eleven con la cascada y las huellas de la montaña, guantes Force y
              medias SFMTB. No está incluido en la inscripción.
            </p>
            <RegisterLink className={buttonClass('primary', 'lg', 'mt-8')}>Reservar mi cupo</RegisterLink>
          </div>
          <figure className="lg:col-span-6 lg:col-start-7">
            <Image
              src={indumentaria}
              alt={`Indumentaria opcional por ${formatCOP(apparel.price)}: jersey Eleven color arena con cascada y huellas de llanta en vista frontal, dorsal y lateral, guantes Force negros y medias blancas SFMTB.`}
              sizes="(min-width: 1024px) 569px, (min-width: 768px) 448px, 100vw"
              placeholder="blur"
              className="mx-auto h-auto w-full max-w-md rounded-xs"
            />
            <figcaption className="mx-auto mt-3 max-w-md text-sm text-ink-muted">{apparel.items}.</figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="premiacion" className="border-t border-line/15 py-20 md:py-28">
        <div className="frame">
          <h2 id="premiacion" className="font-display text-xl font-semibold text-ink md:text-2xl">
            Premiación
          </h2>
          <p className="mt-4 max-w-measure text-lg text-ink-muted">
            En efectivo para las categorías de la {ROUTES.carrera.name} ({ROUTES.carrera.distanceKm} km). La{' '}
            {ROUTES.travesia.name} premia con obsequios. Además, rifa de 10 bonos de $200.000.
          </p>

          <div className="mt-10 overflow-hidden rounded-xs bg-surface shadow-lift-2">
            <div aria-hidden className="h-1 bg-route-carrera" />
            <table className="w-full text-left">
              <caption className="px-4 pb-2 pt-5 text-left font-semibold text-ink md:px-6">
                Premiación en efectivo, {ROUTES.carrera.name} {ROUTES.carrera.distanceKm} km
              </caption>
              <thead>
                <tr className="border-b border-line/25 text-sm text-ink-muted">
                  <th scope="col" className="px-4 py-3 font-normal md:px-6">
                    Categoría
                  </th>
                  {PODIUM_LABELS.map((label) => (
                    <th key={label} scope="col" className="px-2 py-3 text-right font-normal md:px-6">
                      {label}
                    </th>
                  ))}
                  <th scope="col" className="hidden px-6 py-3 text-right font-normal md:table-cell">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRIZES.categories.map((category) => (
                  <tr key={category.name} className="border-b border-line/15 last:border-b-0">
                    <th scope="row" className="px-4 py-3 text-left font-normal md:px-6">
                      <span className="block font-semibold text-ink">{category.name}</span>
                      <span className="block text-sm text-ink-muted">{category.ages}</span>
                    </th>
                    {PRIZES.podium.map((value, i) => (
                      <td key={PODIUM_LABELS[i]} className="tabular px-2 py-3 text-right text-sm text-ink md:px-6 md:text-base">
                        {formatCOP(value)}
                      </td>
                    ))}
                    <td className="tabular hidden px-6 py-3 text-right font-semibold text-ink md:table-cell">
                      {formatCOP(podiumTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-ink-muted">
            {formatCOP(podiumTotal)} por categoría de la {ROUTES.carrera.name} ({ROUTES.carrera.distanceKm} km). {PRIZES.note}
          </p>
          <a href={withBase(EVENT.rulesPdf.src)} download className={`${inlineLinkClass} mt-6 flex min-h-11 w-fit items-center gap-2`}>
            <FileDown className="size-5" aria-hidden />
            Descargar reglamento (PDF, {EVENT.rulesPdf.sizeLabel})
          </a>
        </div>
      </section>
    </>
  );
}
