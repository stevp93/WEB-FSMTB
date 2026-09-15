import type { Metadata } from 'next';
import Image from 'next/image';
import { withBase } from '@/lib/asset';
import { Handshake, Instagram, MessageCircle, Phone } from 'lucide-react';
import { PageHeader } from '@/components/site/PageHeader';
import { DeveloperLogo } from '@/components/ui/DeveloperLogo';
import { buttonClass, inlineLinkClass } from '@/components/ui/button';
import { EVENT, ORGANIZERS } from '@/lib/event';
import { ALLY_MESSAGE, GENERAL_MESSAGE, whatsappLink } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Aliados y contacto',
  description: `Organizan y apoyan: ${ORGANIZERS.map((o) => o.name).join(', ')}. WhatsApp ${EVENT.contact.phoneLabel}.`,
  alternates: { canonical: '/aliados' },
};

export default function AliadosPage() {
  const { contact, developer } = EVENT;

  return (
    <>
      <PageHeader title="Aliados y contacto" lead="Quienes hacen posible la SFMTB Trilogy Race y cómo encontrarnos." />

      <section aria-labelledby="organizan" className="pb-20 md:pb-28">
        <div className="frame">
          <h2 id="organizan" className="font-display text-xl font-semibold text-ink md:text-2xl">
            Organiza y apoya
          </h2>
          <ul className="mt-8 border-t border-line/20">
            {ORGANIZERS.map((org) => (
              <li key={org.name} className="grid gap-6 border-b border-line/20 py-8 md:grid-cols-[12rem_1fr] md:items-center md:gap-10">
                <div className="flex h-28 w-44 items-center md:h-32 md:w-48">
                  <Image
                    src={withBase(org.logo.src)}
                    alt={`Logo de ${org.name}`}
                    width={org.logo.width}
                    height={org.logo.height}
                    sizes="192px"
                    className="max-h-full w-auto object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink md:text-xl">{org.name}</h3>
                  <p className="mt-2 max-w-measure text-ink-muted">{org.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="contacto" className="border-t border-line/15 py-20 md:py-28">
        <div className="frame grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h2 id="contacto" className="font-display text-xl font-semibold text-ink md:text-2xl">
              Contacto
            </h2>
            <p className="mt-4 max-w-measure-sm text-lg text-ink-muted">
              Resolvemos dudas de inscripción, rutas y logística por WhatsApp.
            </p>
          </div>

          <dl className="grid gap-10 md:grid-cols-2 lg:col-span-8">
            <div className="md:col-span-2">
              <dt className="text-sm text-ink-muted">Teléfono y WhatsApp</dt>
              <dd className="tabular mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">{contact.phoneLabel}</dd>
              <dd className="mt-5 flex flex-col gap-3 md:flex-row">
                <a href={whatsappLink(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className={buttonClass('primary', 'md')}>
                  <MessageCircle className="size-5" aria-hidden />
                  Escribir por WhatsApp
                </a>
                <a href={contact.phoneHref} className={buttonClass('secondary', 'md')}>
                  <Phone className="size-5" aria-hidden />
                  Llamar
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-ink-muted">Sitio web</dt>
              <dd className="mt-2">
                <a
                  href={contact.website}
                  className="inline-flex min-h-11 items-center font-display text-xl font-semibold text-ink underline decoration-accent decoration-2 underline-offset-8 transition-colors duration-150 hover:text-accent"
                >
                  {contact.websiteLabel}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-ink-muted">Lugar y fecha</dt>
              <dd className="mt-2 text-lg text-ink">
                {EVENT.place}, {EVENT.country}
              </dd>
              <dd className="text-lg text-ink">
                <time dateTime={EVENT.dateISO}>{EVENT.dateLabel}</time>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section aria-labelledby="marcas" className="border-t border-line/15">
        <div className="frame flex flex-col gap-6 py-16 md:py-20 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 id="marcas" className="font-display text-xl font-semibold text-ink md:text-2xl">
              ¿Tu marca quiere ser parte?
            </h2>
            <p className="mt-3 max-w-measure-sm text-ink-muted">
              Patrocinio principal, marca aliada, aliado de experiencia o apoyo en especie: te contamos cómo sumarte.
            </p>
          </div>
          <a
            href={whatsappLink(ALLY_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass('secondary', 'lg', 'self-start lg:self-auto')}
          >
            <Handshake className="size-5" aria-hidden />
            Hablar de alianzas
          </a>
        </div>
      </section>

      <section aria-labelledby="desarrollo" className="border-t border-line/15">
        <div className="frame grid gap-6 py-16 md:grid-cols-[12rem_1fr] md:items-center md:gap-10 md:py-20">
          <a
            href={developer.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${developer.name} en Instagram`}
            className="flex h-28 w-44 items-center md:h-32 md:w-48"
          >
            <DeveloperLogo size="lg" />
          </a>
          <div>
            <h2 id="desarrollo" className="font-display text-xl font-semibold text-ink md:text-2xl">
              Desarrollo del sitio
            </h2>
            <p className="mt-2 max-w-measure text-ink-muted">
              {developer.name} diseñó y desarrolló la web oficial de la SFMTB Trilogy Race.
            </p>
            <a
              href={developer.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${inlineLinkClass} mt-2 inline-flex min-h-11 items-center gap-2`}
            >
              <Instagram className="size-4" aria-hidden />
              {developer.handle} en Instagram
            </a>
          </div>
        </div>
      </section>

      <section aria-label="Firma oficial" className="border-t border-line/15">
        <div className="frame flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:gap-10 md:py-20">
          <Image
            src={withBase('/logos/sfmtb-oficial.png')}
            alt="SFMTB San Francisco MTB Oficial"
            width={720}
            height={323}
            sizes="(min-width: 768px) 288px, 224px"
            className="h-auto w-56 md:w-72"
          />
          <p className="font-display text-xl font-semibold text-ink md:text-2xl">{EVENT.signature}</p>
        </div>
      </section>
    </>
  );
}
