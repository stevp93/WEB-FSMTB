import type { Metadata } from 'next';
import Link from 'next/link';
import { Camera, GlassWater, MessageCircle, Route, ShieldCheck, Shirt, UtensilsCrossed } from 'lucide-react';
import { RegistrationForm } from '@/components/inscripcion/RegistrationForm';
import { PageHeader } from '@/components/site/PageHeader';
import { buttonClass, inlineLinkClass } from '@/components/ui/button';
import { EVENT, formatCOP } from '@/lib/event';
import { GENERAL_MESSAGE, whatsappLink } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Inscripción',
  description: `Reserva tu cupo en la ${EVENT.name} por ${formatCOP(EVENT.price)} COP. ${EVENT.dateLabel}, ${EVENT.place}.`,
  alternates: { canonical: '/inscripcion' },
};

const INCLUDES = [
  { icon: Shirt, text: 'Kit del corredor: jersey Eleven, medias, guantes, strap, número y chip, medalla, tula y productos de patrocinadores.' },
  { icon: Camera, text: 'Fotografía profesional personalizada.' },
  { icon: GlassWater, text: 'Avituallamiento, asistencia mecánica básica y carro escoba.' },
  { icon: UtensilsCrossed, text: 'Almuerzo típico de la región.' },
  { icon: Route, text: 'Ruta a elección: Carrera o Travesía.' },
];

export default function InscripcionPage() {
  return (
    <>
      <PageHeader title="Inscripción" lead={`Reserva tu cupo para el ${EVENT.dateLabel} en ${EVENT.place}.`}>
        <p className="mt-8 flex items-baseline gap-3">
          <span className="tabular font-display text-2xl font-semibold text-ink md:text-3xl">{formatCOP(EVENT.price)}</span>
          <span className="text-lg text-ink-muted">COP</span>
        </p>
      </PageHeader>

      <section aria-label="Formulario de inscripción" className="pb-20 md:pb-28">
        <div className="frame grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <RegistrationForm />
          </div>

          <aside aria-labelledby="incluye" className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <h2 id="incluye" className="font-display text-xl font-semibold text-ink">
                Tu inscripción incluye
              </h2>
              <ul className="mt-6 space-y-4">
                {INCLUDES.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex gap-4">
                    <Icon className="mt-0.5 size-6 shrink-0 text-accent" aria-hidden strokeWidth={1.75} />
                    <span className="text-ink">{text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/kit-servicios" className={`${inlineLinkClass} mt-5 inline-flex min-h-11 items-center`}>
                Ver el kit y los servicios completos
              </Link>

              <div className="mt-10 border-t border-line/20 pt-8">
                <h3 className="flex items-center gap-3 font-display text-lg font-semibold text-ink">
                  <ShieldCheck className="size-7 shrink-0 text-accent" aria-hidden strokeWidth={1.75} />
                  Respaldo en cada kilómetro
                </h3>
                <p className="mt-3 text-ink-muted">
                  Corres con seguro de accidentes, cuerpos de emergencia acompañando la ruta y carro escoba cerrando el recorrido.
                </p>
              </div>

              <div className="mt-8 border-t border-line/20 pt-8">
                <p className="text-ink-muted">¿Dudas antes de inscribirte?</p>
                <a
                  href={whatsappLink(GENERAL_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass('secondary', 'md', 'mt-3')}
                >
                  <MessageCircle className="size-5" aria-hidden />
                  Escribir al {EVENT.contact.phoneLabel}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
