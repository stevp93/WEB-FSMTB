'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useExperience } from '@/components/providers/Experience';
import { cx } from '@/components/ui/cx';

// bundle-dynamic-imports: three/R3F/drei nunca entran al bundle inicial ni al HTML del servidor.
const Scene = dynamic(() => import('@/components/three/Scene'), { ssr: false, loading: () => null });

/** Capa 3D persistente: un solo Canvas montado en el layout que se reencuadra por ruta. */
export function Backdrop() {
  const mode = useExperience();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  if (mode !== '3d') return null;

  return (
    <div
      aria-hidden
      className={cx(
        'pointer-events-none fixed inset-0 z-canvas transition-opacity duration-400 ease-out',
        ready ? 'opacity-100' : 'opacity-0',
      )}
    >
      <Scene pathname={pathname} onReady={onReady} />
    </div>
  );
}
