import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/site/PageHeader';
import { KitIcon } from '@/components/ui/KitIcon';
import { buttonClass } from '@/components/ui/button';
import { cx } from '@/components/ui/cx';
import { EVENT, KIT, ROUTES, SERVICES, formatCOP } from '@/lib/event';
import jersey from '@/public/images/jersey-eleven-trilogy.webp';

export const metadata: Metadata = {
  title: 'Kit del corredor y servicios',
  description: `Jersey Eleven, medalla Finishers, fotografía profesional, seguro de accidentes, avituallamiento y más, incluidos en tu inscripción de ${formatCOP(EVENT.price)}.`,
  alternates: { canonical: '/kit-servicios' },
};

export default function KitServiciosPage() {
  return (
    <>
      <PageHeader
        title="Kit del corredor y servicios"
        lead={`Todo lo que recibes y todo lo que te respalda con tu inscripción de ${formatCOP(EVENT.price)}.`}
      />

      <section aria-label="Qué incluye la inscripción" className="pb-20 md:pb-28">
        <div className="frame grid gap-14 md:grid-cols-2 md:gap-10 lg:gap-16">
          <section aria-labelledby="kit">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="kit" className="font-display text-xl font-semibold text-ink md:text-2xl">
                Kit del corredor
              </h2>
              <p className="tabular shrink-0 whitespace-nowrap text-sm text-ink-muted">{KIT.length} elementos</p>
            </div>
            <ul className="mt-6 border-t border-line/20">
              {KIT.map((item) => (
                <li key={item.label} className="flex min-h-14 items-center gap-4 border-b border-line/20 py-3">
                  <KitIcon name={item.icon} className="size-6 shrink-0 text-accent" />
                  <span className="text-lg text-ink">{item.label}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="servicios">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="servicios" className="font-display text-xl font-semibold text-ink md:text-2xl">
                Servicios en ruta y evento
              </h2>
              <p className="tabular shrink-0 whitespace-nowrap text-sm text-ink-muted">{SERVICES.length} servicios</p>
            </div>
            <ul className="mt-6 border-t border-line/20">
              {SERVICES.map((item) => (
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
        </div>
      </section>

      <section aria-labelledby="jersey" className="border-t border-line/15 py-20 md:py-28">
        <div className="frame grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-5">
            <h2 id="jersey" className="font-display text-xl font-semibold text-ink md:text-2xl">
              Jersey Eleven, edición Trilogy Race
            </h2>
            <p className="mt-5 max-w-measure-sm text-lg text-ink-muted">
              La cascada y las huellas de la montaña, impresas en la prenda que te llevas. Eliges tu talla al inscribirte.
            </p>
            <Link href="/inscripcion" className={buttonClass('primary', 'lg', 'mt-8')}>
              Reservar mi cupo
            </Link>
          </div>
          <figure className="lg:col-span-6 lg:col-start-7">
            <Image
              src={jersey}
              alt="Diseño del jersey Eleven de la SFMTB Trilogy Race en vista frontal, dorsal y lateral: fondo arena con una cascada y huellas de llanta."
              sizes="(min-width: 1024px) 40vw, (min-width: 768px) 448px, 100vw"
              placeholder="blur"
              className="mx-auto h-auto w-full max-w-md rounded-xs lg:max-w-none"
            />
            <figcaption className="mt-3 text-sm text-ink-muted">Diseño del jersey 2026.</figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
