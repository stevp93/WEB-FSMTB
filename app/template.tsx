'use client';

import { m } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';
import { EASE_OUT } from '@/components/ui/motion';

let hasNavigated = false;

/** Transición de página (≤400 ms, solo opacidad). La primera carga no se anima para no retrasar el LCP. */
export default function Template({ children }: { children: ReactNode }) {
  const animate = hasNavigated;

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <m.div initial={animate ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 0.32, ease: EASE_OUT }}>
      {children}
    </m.div>
  );
}
