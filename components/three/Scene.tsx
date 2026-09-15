'use client';

import { View } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Color } from 'three';
import { subscribeFrame } from '@/components/providers/SmoothScroll';
import { requestSceneFrame, sceneBus } from '@/lib/scene-bus';
import { shotFor } from '@/lib/shots';
import { primitive } from '@/lib/tokens';
import { CameraRig } from './CameraRig';
import { RouteLines } from './RouteLines';
import { Terrain } from './Terrain';
import { clamp01, easeInOutCubic, easeOutCubic, introMemory, type IntroState } from './intro';
import { createWindowUniforms, type WindowUniforms } from './windowFade';

type SceneProps = {
  pathname: string;
  onReady?: () => void;
  /** Solo para generar el póster: conserva el buffer para leerlo como imagen. */
  capture?: boolean;
};

export default function Scene({ pathname, onReady, capture = false }: SceneProps) {
  return (
    <Canvas
      frameloop="never"
      flat
      dpr={[1, 2]}
      resize={{ scroll: false }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: capture }}
      camera={{ fov: 34, near: 1, far: 800, position: [0, 46, 112] }}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
      onCreated={({ gl }) => {
        gl.autoClear = false;
        gl.setClearColor(new Color(primitive['bruma-noche']), 1);
      }}
    >
      <World pathname={pathname} onReady={onReady} capture={capture} />
      <View.Port />
    </Canvas>
  );
}

function World({ pathname, onReady, capture }: { pathname: string; onReady?: () => void; capture: boolean }) {
  const baseShot = shotFor(pathname);
  const shot = useMemo(() => (capture ? { ...baseShot, orbit: false } : baseShot), [baseShot, capture]);
  const windowUniforms = useMemo(() => createWindowUniforms(shot.fade), []); // eslint-disable-line react-hooks/exhaustive-deps
  const playing = useRef(!introMemory.played && pathname === '/');
  const intro = useRef<IntroState>(playing.current ? { reveal: 0, draw: 0 } : { reveal: 1, draw: 1 });
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    introMemory.played = true;
  }, []);

  useEffect(() => {
    // El hero orbita y los perfiles siguen el scroll: ahí se renderiza cada frame; en el resto, bajo demanda.
    sceneBus.continuous = pathname === '/' || pathname === '/recorridos';
    requestSceneFrame();
  }, [pathname]);

  useFrame((state) => {
    if (!playing.current) return;
    const now = state.clock.elapsedTime;
    if (startedAt.current === null) startedAt.current = now;
    const t = now - startedAt.current;
    intro.current.reveal = easeOutCubic(clamp01(t / 2.6));
    intro.current.draw = easeInOutCubic(clamp01((t - 1.9) / 2.6));
    if (t >= 4.5) {
      intro.current.reveal = 1;
      intro.current.draw = 1;
      playing.current = false;
    }
    requestSceneFrame();
  });

  return (
    <>
      <FrameDriver onReady={onReady} />
      <CameraRig shot={shot} />
      <Terrain intro={intro} dim={shot.dim} fade={shot.fade} animate={pathname === '/'} windowUniforms={windowUniforms} />
      <RouteLines intro={intro} windowUniforms={windowUniforms} />
      <WindowRenderer pathname={pathname} windowUniforms={windowUniforms} />
    </>
  );
}

/** Avanza el Canvas desde el rAF compartido con Lenis, solo cuando hay algo que dibujar. */
function FrameDriver({ onReady }: { onReady?: () => void }) {
  const advance = useThree((s) => s.advance);
  const size = useThree((s) => s.size);
  const readyRef = useRef(onReady);

  useEffect(() => {
    readyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    requestSceneFrame();
  }, [size]);

  useEffect(() => {
    let notified = false;
    let lastScroll = -1;
    const onResize = () => requestSceneFrame();
    window.addEventListener('resize', onResize, { passive: true });

    const unsubscribe = subscribeFrame((time) => {
      const scroll = window.scrollY;
      if (scroll !== lastScroll) {
        lastScroll = scroll;
        sceneBus.dirty = true;
      }
      if (!sceneBus.continuous && !sceneBus.dirty) return;
      sceneBus.dirty = false;
      advance(time / 1000);
      if (!notified) {
        notified = true;
        readyRef.current?.();
      }
    });

    return () => {
      window.removeEventListener('resize', onResize);
      unsubscribe();
    };
  }, [advance]);

  return null;
}

/**
 * Dibuja el terreno solo dentro del rectángulo visible de [data-scene-window]
 * (hero o cabecera). El resto del lienzo queda en bruma-noche, por eso el
 * contenido no necesita fondos propios para ser legible.
 */
function WindowRenderer({ pathname, windowUniforms }: { pathname: string; windowUniforms: WindowUniforms }) {
  const windowEl = useRef<Element | null>(null);
  const clearColor = useMemo(() => new Color(primitive['bruma-noche']), []);

  useEffect(() => {
    windowEl.current = null;
    requestSceneFrame();
  }, [pathname]);

  useFrame(({ gl, scene, camera, size }) => {
    if (!windowEl.current || !windowEl.current.isConnected) {
      windowEl.current = document.querySelector('[data-scene-window]');
    }

    gl.setScissorTest(false);
    gl.setClearColor(clearColor, 1);
    gl.clear(true, true, true);

    const rect = windowEl.current?.getBoundingClientRect();
    if (!rect) return;
    const top = Math.max(0, rect.top);
    const bottom = Math.min(size.height, rect.bottom);
    if (bottom <= top) return;

    const dpr = gl.getPixelRatio();
    windowUniforms.uWinBottom.value = (size.height - rect.bottom) * dpr;
    windowUniforms.uWinHeight.value = rect.height * dpr;

    gl.setViewport(0, 0, size.width, size.height);
    gl.setScissor(0, size.height - bottom, size.width, bottom - top);
    gl.setScissorTest(true);
    gl.render(scene, camera);
    gl.setScissorTest(false);
  }, 1);

  return null;
}
