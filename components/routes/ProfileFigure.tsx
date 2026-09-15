'use client';

import dynamic from 'next/dynamic';
import { Move3d, RotateCcw, RotateCw } from 'lucide-react';
import { startTransition, useCallback, useId, useRef, useState, type PointerEvent } from 'react';
import { useExperience } from '@/components/providers/Experience';
import type { ProfileRotation, RibbonPoint } from '@/components/three/ProfileView';
import { cx } from '@/components/ui/cx';
import type { RouteId } from '@/lib/event';
import { requestSceneFrame } from '@/lib/scene-bus';

const ProfileView = dynamic(() => import('@/components/three/ProfileView'), { ssr: false, loading: () => null });

type Props = {
  id: RouteId;
  name: string;
  distanceKm: number;
  ascentLabel: string;
  maxKm: number;
  points: RibbonPoint[];
  minM: number;
  rangeM: number;
  linePath: string;
  areaPath: string;
};

export function ProfileFigure(props: Props) {
  const { id, name, distanceKm, ascentLabel, maxKm } = props;
  const mode = useExperience();
  const [ready, setReady] = useState(false);
  const [touched, setTouched] = useState(false);
  const rotation = useRef<ProfileRotation>({ yaw: -0.6, tilt: 0.12 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const captionId = useId();
  const show3d = mode === '3d' && ready;
  const onReady = useCallback(() => setReady(true), []);

  // La rotación vive en un ref: arrastrar no re-renderiza React; solo el aviso inicial es una transición no urgente.
  const nudge = (yaw: number, tilt = 0) => {
    const r = rotation.current;
    r.yaw += yaw;
    r.tilt = Math.min(0.55, Math.max(-0.25, r.tilt + tilt));
    requestSceneFrame();
    if (!touched) startTransition(() => setTouched(true));
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!show3d || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    nudge((event.clientX - d.x) * 0.012, (event.clientY - d.y) * 0.004);
    d.x = event.clientX;
    d.y = event.clientY;
  };

  const endDrag = () => {
    drag.current = null;
  };

  return (
    <figure aria-labelledby={captionId} className={cx('relative', !show3d && 'bg-surface')}>
      <div
        className={cx('relative h-56 md:h-60 lg:h-72', show3d && 'cursor-grab touch-pan-y active:cursor-grabbing')}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          aria-hidden
          className={cx(
            'absolute inset-x-6 bottom-12 top-6 transition-opacity duration-240 ease-out md:inset-x-8',
            show3d && 'opacity-0',
          )}
        >
          <svg viewBox="0 0 600 200" preserveAspectRatio="none" className="h-full w-full overflow-visible">
            <path d={props.areaPath} className={id === 'carrera' ? 'fill-route-carrera/15' : 'fill-route-travesia/15'} />
            <path
              d={props.linePath}
              className={cx('fill-none', id === 'carrera' ? 'stroke-route-carrera' : 'stroke-route-travesia')}
              strokeWidth={2.5}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className="tabular absolute inset-x-0 -bottom-7 text-xs text-ink-muted">
            <span className="absolute left-0">0 km</span>
            <span className="absolute -translate-x-full" style={{ left: `${(distanceKm / maxKm) * 100}%` }}>
              {distanceKm} km
            </span>
          </div>
        </div>

        {mode === '3d' ? (
          <ProfileView
            id={id}
            points={props.points}
            minM={props.minM}
            rangeM={props.rangeM}
            rotation={rotation}
            onReady={onReady}
          />
        ) : null}
      </div>

      {show3d ? (
        <div className="absolute inset-x-6 bottom-2 flex items-center justify-between gap-3 md:inset-x-8">
          <p className="flex items-center gap-2 text-sm text-ink-muted">
            <Move3d className="size-4 shrink-0" aria-hidden />
            {touched ? 'Perfil 3D del recorrido' : 'Arrastra para girar el perfil'}
          </p>
          <div className="-mr-2 flex gap-2">
            <button
              type="button"
              onClick={() => nudge(-0.5)}
              aria-label={`Girar el perfil de ${name} a la izquierda`}
              className="grid size-11 place-items-center rounded-sm border border-line/30 text-ink transition-colors duration-150 hover:border-ink"
            >
              <RotateCcw className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => nudge(0.5)}
              aria-label={`Girar el perfil de ${name} a la derecha`}
              className="grid size-11 place-items-center rounded-sm border border-line/30 text-ink transition-colors duration-150 hover:border-ink"
            >
              <RotateCw className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}

      <figcaption id={captionId} className="sr-only">
        Perfil de referencia de la {name}: {distanceKm} km y {ascentLabel} de ascenso acumulado.
      </figcaption>
    </figure>
  );
}
