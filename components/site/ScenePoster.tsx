'use client';

import { getImageProps } from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useExperience } from '@/components/providers/Experience';
import { cx } from '@/components/ui/cx';
import { withBase } from '@/lib/asset';
import { shotFor, type Shot } from '@/lib/shots';

const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const PORTRAIT_MEDIA = '(max-width: 767px)';
const LANDSCAPE_MEDIA = '(prefers-reduced-motion: reduce), (max-width: 1023px) and (pointer: coarse)';

type Framing = Shot['poster'];
let lastFraming: Framing | null = null;

/**
 * Póster del terreno (misma composición que la escena 3D). El <picture> decide por
 * media query quién lo descarga: móvil, táctil o movimiento reducido; en escritorio
 * con 3D no se baja nada. El <picture> nunca se modifica tras hidratar: tocar sus
 * <source> reinicia la imagen y retrasa el LCP.
 */
export function ScenePoster({ hero = false }: { hero?: boolean }) {
  const pathname = usePathname();
  const mode = useExperience();
  const target = shotFor(pathname).poster;
  const [framing, setFraming] = useState<Framing>(() => lastFraming ?? target);
  const [desktopFallback, setDesktopFallback] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setFraming(target));
    lastFraming = target;
    return () => cancelAnimationFrame(id);
  }, [target]);

  // Escritorio donde el 3D se descartó (ahorro de datos, red lenta, sin WebGL): el <picture> no descargó nada.
  useEffect(() => {
    setDesktopFallback(
      mode === 'poster' && !window.matchMedia(`${PORTRAIT_MEDIA}, ${LANDSCAPE_MEDIA}`).matches,
    );
  }, [mode]);

  const common = { alt: '', sizes: '100vw', quality: 72, priority: true } as const;
  const portrait = getImageProps({ ...common, src: withBase('/poster/terreno-retrato.jpg'), width: 1080, height: 1920 }).props;
  const { style: _ignored, ...landscape } = getImageProps({
    ...common,
    src: withBase('/poster/terreno-horizontal.jpg'),
    width: 2400,
    height: 1350,
  }).props;

  const imageStyle = {
    transform: `translate3d(${framing.x}%, ${framing.y}%, 0) scale(${framing.scale})`,
    transition: 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1)',
  };

  return (
    <div
      aria-hidden
      className={cx(
        'pointer-events-none absolute inset-0 -z-10 overflow-hidden',
        // En móvil el hero es más alto que la pantalla: el póster se queda en el primer pantallazo y sube la cordillera sobre el texto.
        hero && 'max-md:bottom-auto max-md:h-[100svh]',
        mode === '3d' && 'hidden',
      )}
    >
      <picture className={cx('block h-full w-full', hero && 'max-md:-translate-y-[9%]')}>
        <source media={PORTRAIT_MEDIA} srcSet={portrait.srcSet ?? portrait.src} sizes="100vw" />
        <source media={LANDSCAPE_MEDIA} srcSet={landscape.srcSet ?? landscape.src} sizes="100vw" />
        <source srcSet={BLANK} sizes="100vw" />
        <img {...landscape} alt="" className="h-full w-full object-cover object-[50%_35%]" style={imageStyle} />
      </picture>
      {desktopFallback ? (
        <img {...landscape} alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_35%]" style={imageStyle} />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/45 to-canvas/0" />
    </div>
  );
}
