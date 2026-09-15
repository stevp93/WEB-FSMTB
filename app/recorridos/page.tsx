import type { Metadata } from 'next';
import Link from 'next/link';
import { RouteCard } from '@/components/routes/RouteCard';
import { PageHeader } from '@/components/site/PageHeader';
import { RouteLegend } from '@/components/site/RouteLegend';
import { inlineLinkClass } from '@/components/ui/button';
import { ROUTES, ROUTE_ORDER, formatThousands } from '@/lib/event';
import { buildProfile } from '@/lib/profiles';

export const metadata: Metadata = {
  title: 'Recorridos',
  description: `Carrera: ${ROUTES.carrera.distanceKm} km y ${formatThousands(ROUTES.carrera.ascentM)} m de ascenso. Travesía: ${ROUTES.travesia.distanceKm} km y ${formatThousands(ROUTES.travesia.ascentM)} m de ascenso.`,
  alternates: { canonical: '/recorridos' },
};

export default function RecorridosPage() {
  const profiles = ROUTE_ORDER.map((id) => buildProfile(id));
  // Escala compartida: las dos tarjetas se comparan en los mismos ejes.
  const maxKm = Math.max(...ROUTE_ORDER.map((id) => ROUTES[id].distanceKm));
  const rangeM = Math.max(...profiles.map((p) => p.maxM - p.minM));
  const extraKm = ROUTES.carrera.distanceKm - ROUTES.travesia.distanceKm;
  const extraM = ROUTES.carrera.ascentM - ROUTES.travesia.ascentM;

  return (
    <>
      <PageHeader title="Recorridos" lead="Una montaña, dos formas de vivirla. Eliges tu ruta al inscribirte.">
        <RouteLegend className="mt-8" />
      </PageHeader>

      <section aria-label="Comparación de modalidades" className="pb-20 md:pb-28">
        <div className="frame">
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {profiles.map((profile) => (
              <RouteCard key={profile.id} id={profile.id} profile={profile} maxKm={maxKm} rangeM={rangeM} />
            ))}
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-12">
            <p className="max-w-measure text-lg text-ink-muted lg:col-span-8">
              La Carrera suma <strong className="font-semibold text-ink">{extraKm} km</strong> y{' '}
              <strong className="font-semibold text-ink">{formatThousands(extraM)} m de ascenso</strong> más que la Travesía.
              Las dos incluyen seguro de accidentes, avituallamiento, asistencia mecánica y carro escoba.{' '}
              <Link href="/kit-servicios" className={inlineLinkClass}>
                Ver todo lo que incluye
              </Link>
            </p>
            <p className="text-sm text-ink-muted lg:col-span-8">
              Distancias aproximadas. Los perfiles son de referencia y respetan la distancia y el ascenso acumulado publicados.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
