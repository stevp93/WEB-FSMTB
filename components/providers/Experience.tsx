'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { canRun3D, type ExperienceMode } from '@/lib/experience';

const ExperienceContext = createContext<ExperienceMode>('pending');

export function useExperience() {
  return useContext(ExperienceContext);
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ExperienceMode>('pending');

  useEffect(() => {
    const evaluate = () => setMode(canRun3D() ? '3d' : 'poster');

    // La decisión (y la descarga del chunk 3D) espera a que el hilo principal quede libre tras hidratar.
    let idleId = 0;
    let timeoutId = 0;
    if (typeof window.requestIdleCallback === 'function') idleId = window.requestIdleCallback(evaluate, { timeout: 1200 });
    else timeoutId = window.setTimeout(evaluate, 200);

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    motion.addEventListener('change', evaluate);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(evaluate, 250);
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      if (idleId) window.cancelIdleCallback(idleId);
      window.clearTimeout(timeoutId);
      window.clearTimeout(resizeTimer);
      motion.removeEventListener('change', evaluate);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <ExperienceContext.Provider value={mode}>{children}</ExperienceContext.Provider>;
}
