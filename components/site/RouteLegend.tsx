import { ROUTES } from '@/lib/event';

/** Leyenda de los trazados dibujados sobre el terreno (3D o póster). */
export function RouteLegend({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="sr-only">Trazados dibujados sobre el terreno:</p>
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
        <li className="flex items-center gap-2">
          <span aria-hidden className="h-[3px] w-7 rounded-full bg-route-carrera" />
          {ROUTES.carrera.name} {ROUTES.carrera.distanceKm} km
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className="h-[3px] w-7 rounded-full bg-route-travesia" />
          {ROUTES.travesia.name} {ROUTES.travesia.distanceKm} km
        </li>
      </ul>
    </div>
  );
}
