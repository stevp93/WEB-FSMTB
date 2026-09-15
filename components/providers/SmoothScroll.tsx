'use client';

import { useEffect } from 'react';
import type Lenis from 'lenis';
import 'lenis/dist/lenis.css';

type FrameCallback = (time: number) => void;

const subscribers = new Set<FrameCallback>();
let lenis: Lenis | null = null;
let rafId = 0;

/** Un único rAF para scroll suave y escena 3D: ambos leen la misma posición en el mismo frame. */
function tick(time: number) {
  lenis?.raf(time);
  subscribers.forEach((fn) => fn(time));
  rafId = requestAnimationFrame(tick);
}

function syncLoop() {
  const needed = lenis !== null || subscribers.size > 0;
  if (needed && !rafId) rafId = requestAnimationFrame(tick);
  if (!needed && rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
}

export function subscribeFrame(fn: FrameCallback) {
  subscribers.add(fn);
  syncLoop();
  return () => {
    subscribers.delete(fn);
    syncLoop();
  };
}

export function getLenis() {
  return lenis;
}

export function SmoothScroll() {
  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // En táctil el scroll nativo ya es suave; con movimiento reducido no se interpola.
    if (!finePointer || reduceMotion) return;

    // Import dinámico: los dispositivos táctiles nunca descargan Lenis.
    let instance: Lenis | null = null;
    let cancelled = false;
    void import('lenis').then(({ default: LenisCtor }) => {
      if (cancelled) return;
      instance = new LenisCtor({ autoRaf: false, lerp: 0.12, anchors: true });
      lenis = instance;
      syncLoop();
    });
    return () => {
      cancelled = true;
      instance?.destroy();
      if (lenis === instance) lenis = null;
      syncLoop();
    };
  }, []);

  return null;
}
