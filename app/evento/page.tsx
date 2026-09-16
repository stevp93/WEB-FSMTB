import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Droplets, FileDown, Mountain, Users } from 'lucide-react';
import { PageHeader } from '@/components/site/PageHeader';
import { RegisterLink } from '@/components/ui/RegisterLink';
import { buttonClass } from '@/components/ui/button';
import { withBase } from '@/lib/asset';
import { EVENT } from '@/lib/event';
import cascada from '@/public/images/cascada-san-francisco.webp';
import escuela from '@/public/images/escuela-ciclomontanismo.webp';

export const metadata: Metadata = {
  title: 'El Evento',
  description: `${EVENT.longDescription} ${EVENT.dateLabel}, ${EVENT.place}.`,
  alternates: { canonical: '/evento' },
};

const IDENTITY = [
  { icon: Droplets, title: 'Agua', text: 'Ríos, quebradas y cascadas que definen el paisaje del municipio.' },
  { icon: Mountain, title: 'Montaña', text: 'Cordillera que pone a prueba piernas, cabeza y técnica.' },
  { icon: Users, title: 'Comunidad', text: 'Familias, comercio local y una escuela que forma a los próximos corredores.' },
];

export default function EventoPage() {
  const { community } = EVENT;

  return (
    <>
      <PageHeader title="Tercera edición. La trilogía se completa." lead={EVENT.longDescription} />

      <section aria-labelledby="historia" className="pb-20 md:pb-28">
        <div className="frame grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 id="historia" className="font-display text-xl font-semibold text-ink md:text-2xl">
              Una historia que sigue rodando
            </h2>
            <div className="mt-6 max-w-measure space-y-4 text-lg text-ink-muted">
              <p>
                San Francisco MTB nació de una pasión compartida por el ciclomontañismo y de un propósito: apoyar a los niños y
                jóvenes de la Escuela de Formación de Ciclomontañismo del municipio.
              </p>
              <p>
                Lo que empezó entre entusiastas hoy reúne a ciclistas, familias, marcas, comercio local y comunidad alrededor de
                una misma experiencia.
              </p>
            </div>

            <ol aria-label="Ediciones" className="mt-10 space-y-8 border-l-2 border-dashed border-route-carrera/60 pl-6">
              <li>
                <h3 className="font-display text-lg font-semibold text-ink">Primera y segunda edición</h3>
                <p className="mt-1 text-ink-muted">
                  Más de {community.participantsPerEdition} participantes y {community.companionsPerEdition} acompañantes en
                  cada una, llegados desde Bogotá, el Gualivá y otros municipios de Cundinamarca.
                </p>
              </li>
              <li>
                <h3 className="font-display text-lg font-semibold text-ink">Tercera edición: {EVENT.name}</h3>
                <p className="mt-1 text-ink-muted">
                  <time dateTime={EVENT.dateISO}>{EVENT.dateLabel}</time>. Vamos por {community.projectedParticipants}{' '}
                  participantes y {community.projectedCompanions} acompañantes.
                </p>
              </li>
            </ol>
          </div>

          <figure className="lg:col-span-6 lg:col-start-7">
            <Image
              src={escuela}
              alt="Niñas, niños y jóvenes de la escuela de ciclomontañismo con casco y uniforme, frente al telón de la Gran Travesía San Francisco MTB."
              sizes="(min-width: 1024px) 46vw, 100vw"
              placeholder="blur"
              className="h-auto w-full rounded-xs"
            />
            <figcaption className="mt-3 text-sm text-ink-muted">Escuela de Formación de Ciclomontañismo de San Francisco.</figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="territorio" className="border-t border-line/15 py-20 md:py-28">
        <div className="frame grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 id="territorio" className="font-display text-xl font-semibold text-ink md:text-2xl">
              {EVENT.motto}
            </h2>
            <p className="mt-6 max-w-measure text-lg text-ink-muted">
              San Francisco no es solo el lugar donde ocurre la carrera: es parte de la experiencia. Sus montañas, caminos,
              bosques y fuentes de agua hacen de este territorio un escenario que no se puede replicar.
            </p>
            <dl className="mt-10 divide-y divide-line/15 border-y border-line/15">
              {IDENTITY.map(({ icon: Icon, title, text }) => (
                <div key={title} className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-1 py-5">
                  <dt className="contents">
                    <Icon className="size-6 translate-y-1 text-accent" aria-hidden strokeWidth={1.75} />
                    <span className="font-display text-lg font-semibold text-ink">{title}</span>
                  </dt>
                  <dd className="col-start-2 text-ink-muted">{text}</dd>
                </div>
              ))}
            </dl>
          </div>

          <figure className="lg:order-first lg:col-span-5">
            <Image
              src={cascada}
              alt="Agua del río Cañas corriendo entre rocas y bosque en San Francisco, Cundinamarca."
              sizes="(min-width: 1024px) 38vw, 100vw"
              placeholder="blur"
              className="mx-auto h-auto w-full max-w-md rounded-xs lg:max-w-none"
            />
            <figcaption className="mt-3 text-sm text-ink-muted">Río Cañas, San Francisco, Cundinamarca.</figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="evento-cta" className="border-t border-line/15">
        <div className="frame flex flex-col gap-8 py-16 md:py-24 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="evento-cta" className="max-w-[18ch] font-display text-2xl font-semibold text-ink md:text-3xl">
            Conoce las dos rutas de la montaña
          </h2>
          <div className="flex flex-col gap-3 md:flex-row">
            <Link href="/recorridos" className={buttonClass('secondary', 'lg')}>
              Ver recorridos
            </Link>
            <a href={withBase(EVENT.rulesPdf.src)} download className={buttonClass('secondary', 'lg')}>
              <FileDown className="size-5" aria-hidden />
              Reglamento
            </a>
            <RegisterLink className={buttonClass('primary', 'lg')}>
              Reservar mi cupo
            </RegisterLink>
          </div>
        </div>
      </section>
    </>
  );
}
