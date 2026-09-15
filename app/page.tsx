import Image from 'next/image';
import Link from 'next/link';
import { Backpack, CalendarDays, Handshake, MapPin, Route } from 'lucide-react';
import { Countdown } from '@/components/home/Countdown';
import { RouteLegend } from '@/components/site/RouteLegend';
import { ScenePoster } from '@/components/site/ScenePoster';
import { RegisterLink } from '@/components/ui/RegisterLink';
import { buttonClass } from '@/components/ui/button';
import { EVENT, KIT, ORGANIZERS, ROUTES, formatCOP } from '@/lib/event';
import salida from '@/public/images/salida-edicion-anterior.webp';

const QUICK_LINKS = [
  {
    href: '/recorridos',
    title: 'Recorridos',
    text: `Carrera de ${ROUTES.carrera.distanceKm} km o Travesía de ${ROUTES.travesia.distanceKm} km: compara distancia, ascenso y premiación.`,
    icon: Route,
  },
  {
    href: '/kit-servicios',
    title: 'Kit y servicios',
    text: `${KIT.length} piezas de kit, seguro de accidentes, avituallamiento y apoyo en ruta.`,
    icon: Backpack,
  },
  {
    href: '/aliados',
    title: 'Aliados y contacto',
    text: 'Quién organiza la carrera y cómo escribirnos.',
    icon: Handshake,
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SportsEvent',
  name: EVENT.fullName,
  description: EVENT.shortDescription,
  sport: 'Ciclismo de montaña',
  startDate: EVENT.dateISO,
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  image: [`${EVENT.contact.website}/opengraph-image.jpg`],
  location: {
    '@type': 'Place',
    name: EVENT.place,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San Francisco',
      addressRegion: 'Cundinamarca',
      addressCountry: 'CO',
    },
  },
  offers: {
    '@type': 'Offer',
    price: String(EVENT.price),
    priceCurrency: EVENT.currency,
    url: EVENT.registrationUrl || EVENT.contact.website,
    availability: 'https://schema.org/InStock',
  },
  organizer: ORGANIZERS.map((org) => ({ '@type': 'Organization', name: org.name })),
};

export default function HomePage() {
  const { community } = EVENT;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section
        data-scene-window
        aria-labelledby="hero-titulo"
        className="relative isolate flex min-h-dvh flex-col justify-end pb-10 pt-28 md:pb-14 lg:pb-16"
      >
        <ScenePoster hero />
        <div className="frame">
          <p className="text-lg font-medium text-accent md:text-xl">{EVENT.motto}</p>
          <h1 id="hero-titulo" className="mt-3 font-display text-display font-bold text-ink">
            <span className="block">SFMTB</span>
            <span className="block">Trilogy Race</span>
          </h1>

          <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <ul className="flex flex-col gap-2 text-lg text-ink md:flex-row md:flex-wrap md:gap-x-8">
                <li className="flex items-center gap-2">
                  <CalendarDays className="size-5 shrink-0 text-accent" aria-hidden />
                  <time dateTime={EVENT.dateISO}>{EVENT.dateLabel}</time>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="size-5 shrink-0 text-accent" aria-hidden />
                  {EVENT.place}
                </li>
              </ul>
              <div className="mt-8 flex flex-col gap-3 md:flex-row">
                <RegisterLink className={buttonClass('primary', 'lg')}>
                  Reservar mi cupo — {formatCOP(EVENT.price)}
                </RegisterLink>
                <Link href="/recorridos" className={buttonClass('secondary', 'lg')}>
                  Ver recorridos
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-5 lg:items-end lg:text-right">
              <Countdown target={EVENT.countdownTarget} label="Faltan para el 29 de noviembre" />
              <RouteLegend />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="gancho" className="py-20 md:py-28 lg:py-36">
        <div className="frame grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-6">
            <h2 id="gancho" className="max-w-[20ch] font-display text-xl font-semibold text-ink md:text-2xl">
              Algunos ya saben qué significa SFMTB, para otros, es el turno de conocerlo.
            </h2>
            <p className="mt-6 max-w-measure-sm text-lg text-ink-muted md:text-xl">
              Ven a competir en un territorio que tiene una identidad propia.
            </p>
            <dl className="mt-12 grid max-w-md grid-cols-2 gap-6 border-t border-line/20 pt-8">
              <div className="flex flex-col-reverse gap-1">
                <dt className="text-sm text-ink-muted">participantes por edición</dt>
                <dd className="tabular font-display text-3xl font-semibold text-ink">+{community.participantsPerEdition}</dd>
              </div>
              <div className="flex flex-col-reverse gap-1">
                <dt className="text-sm text-ink-muted">acompañantes por edición</dt>
                <dd className="tabular font-display text-3xl font-semibold text-ink">+{community.companionsPerEdition}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-ink-muted">En cada una de las dos ediciones anteriores.</p>
          </div>

          <figure className="lg:col-span-6">
            <Image
              src={salida}
              alt="Decenas de ciclistas con casco y bicicleta esperando la salida en la plaza de San Francisco, con la montaña al fondo."
              sizes="(min-width: 1024px) 46vw, 100vw"
              placeholder="blur"
              className="h-auto w-full rounded-xs"
            />
            <figcaption className="mt-3 text-sm text-ink-muted">Salida de una edición anterior en San Francisco.</figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="accesos" className="pb-20 md:pb-28">
        <div className="frame">
          <h2 id="accesos" className="font-display text-xl font-semibold text-ink md:text-2xl">
            Prepara tu salida
          </h2>
          <ul className="mt-8 border-t border-line/20">
            {QUICK_LINKS.map(({ href, title, text, icon: Icon }) => (
              <li key={href} className="border-b border-line/20">
                <Link
                  href={href}
                  className="group grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-1 py-6 md:grid-cols-[auto_minmax(0,16rem)_1fr] md:gap-x-10 md:py-8"
                >
                  <Icon className="row-span-2 size-7 text-accent md:row-span-1" aria-hidden strokeWidth={1.75} />
                  <span className="font-display text-xl font-semibold text-ink transition-colors duration-150 group-hover:text-accent">
                    {title}
                  </span>
                  <span className="text-ink-muted">{text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="cta-final" className="border-t border-line/15">
        <div className="frame flex flex-col gap-8 py-16 md:py-24 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="cta-final" className="max-w-[16ch] font-display text-2xl font-semibold text-ink md:text-3xl">
              Tu cupo en la tercera edición
            </h2>
            <p className="mt-4 max-w-measure-sm text-lg text-ink-muted">
              {formatCOP(EVENT.price)} COP con kit completo, seguro de accidentes y apoyo en ruta.
            </p>
          </div>
          <RegisterLink className={buttonClass('primary', 'lg', 'self-start lg:self-auto')}>
            Reservar mi cupo
          </RegisterLink>
        </div>
      </section>
    </>
  );
}
