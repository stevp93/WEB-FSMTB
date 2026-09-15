'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/** Al cambiar de ruta, el foco vuelve a <main> para que el lector de pantalla empiece por el contenido nuevo. */
export function RouteFocus() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
