import { Banknote, Gift } from 'lucide-react';
import type { RibbonPoint } from '@/components/three/ProfileView';
import { RegisterLink } from '@/components/ui/RegisterLink';
import { buttonClass } from '@/components/ui/button';
import { cx } from '@/components/ui/cx';
import { ROUTES, formatThousands, type RouteId } from '@/lib/event';
import { profileSvg, type Profile } from '@/lib/profiles';
import { ProfileFigure } from './ProfileFigure';

const r = (value: number, digits: number) => Number(value.toFixed(digits));

type Props = { id: RouteId; profile: Profile; maxKm: number; rangeM: number };

export function RouteCard({ id, profile, maxKm, rangeM }: Props) {
  const route = ROUTES[id];
  const { line, area } = profileSvg(profile, 600, 200, maxKm, rangeM);
  const points: RibbonPoint[] = profile.points.map((p) => [r(p.km, 2), r(p.m, 1), r(p.px, 3), r(p.pz, 3)]);
  const ascentLabel = `${formatThousands(route.ascentM)} m`;
  const PrizeIcon = id === 'carrera' ? Banknote : Gift;

  return (
    <article aria-labelledby={`ruta-${id}`} className="flex flex-col overflow-hidden rounded-xs shadow-lift-2">
      <div aria-hidden className={cx('h-1', id === 'carrera' ? 'bg-route-carrera' : 'bg-route-travesia')} />
      <div className="bg-surface px-6 pt-6 md:px-8 md:pt-8">
        <h2 id={`ruta-${id}`} className="font-display text-2xl font-semibold text-ink">
          {route.name}
        </h2>
        <p className="mt-3 max-w-measure-sm text-ink-muted">{route.pitch}</p>
      </div>

      <ProfileFigure
        id={id}
        name={route.name}
        distanceKm={route.distanceKm}
        ascentLabel={ascentLabel}
        maxKm={maxKm}
        points={points}
        minM={profile.minM}
        rangeM={rangeM}
        linePath={line}
        areaPath={area}
      />

      <div className="flex flex-1 flex-col bg-surface px-6 pb-6 md:px-8 md:pb-8">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line/20 pt-6">
          <div className="flex flex-col-reverse">
            <dt className="text-sm text-ink-muted">Distancia</dt>
            <dd className="tabular font-display text-2xl font-semibold text-ink">
              {route.distanceKm} <span className="text-lg">km</span>
            </dd>
          </div>
          <div className="flex flex-col-reverse">
            <dt className="text-sm text-ink-muted">Ascenso acumulado</dt>
            <dd className="tabular font-display text-2xl font-semibold text-ink">
              {formatThousands(route.ascentM)} <span className="text-lg">m</span>
            </dd>
          </div>
          <div className="col-span-2 flex items-center justify-between gap-4 border-t border-line/15 pt-5">
            <dt className="text-ink-muted">Premiación</dt>
            <dd className="flex items-center gap-2 font-semibold text-ink">
              <PrizeIcon className="size-5 text-accent" aria-hidden />
              {route.prize}
            </dd>
          </div>
        </dl>
        <RegisterLink className={buttonClass('primary', 'lg', 'mt-8 w-full')}>
          {route.cta}
        </RegisterLink>
      </div>
    </article>
  );
}
