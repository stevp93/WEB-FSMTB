'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { CONSENT_GRANTED_EVENT, readConsent } from '@/lib/analytics';
import { canRun3D, isMobileDevice, type ExperienceMode } from '@/lib/experience';

const ExperienceContext = createContext<ExperienceMode>('pending');

export function useExperience() {
  return useContext(ExperienceContext);
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ExperienceMode>('pending');

  useEffect(() => {
    let decided = false;
    const evaluate = () => {
      decided = true;
      setMode(canRun3D() ? '3d' : 'poster');
    };
    // Cambios posteriores (rotación, reducción de movimiento) solo reevalúan cuando ya hubo una primera decisión.
    const reevaluate = () => {
      if (decided) evaluate();
    };

    // La decisión (y la descarga del chunk 3D) espera a que el hilo principal quede libre tras hidratar.
    // En celular el póster es el primer pantallazo y el 3D entra después: en la primera visita al tocar
    // "Aceptar" en el aviso de cookies (la intro se ve completa); si ya aceptó antes, tras la carga completa.
    let idleId = 0;
    let timeoutId = 0;
    const schedule = () => {
      if (typeof window.requestIdleCallback === 'function') idleId = window.requestIdleCallback(evaluate, { timeout: 1200 });
      else timeoutId = window.setTimeout(evaluate, 200);
    };
    const afterLoad = () => {
      if (document.readyState === 'complete') schedule();
      else window.addEventListener('load', schedule, { once: true });
    };
    if (!isMobileDevice()) schedule();
    else if (readConsent() === 'granted') afterLoad();
    else window.addEventListener(CONSENT_GRANTED_EVENT, afterLoad, { once: true });

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    motion.addEventListener('change', reevaluate);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(reevaluate, 250);
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('load', schedule);
      window.removeEventListener(CONSENT_GRANTED_EVENT, afterLoad);
      if (idleId) window.cancelIdleCallback(idleId);
      window.clearTimeout(timeoutId);
      window.clearTimeout(resizeTimer);
      motion.removeEventListener('change', reevaluate);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <ExperienceContext.Provider value={mode}>{children}</ExperienceContext.Provider>;
}
