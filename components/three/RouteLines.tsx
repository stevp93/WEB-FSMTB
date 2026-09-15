'use client';

import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react';
import type { Group, Mesh } from 'three';
import type { Line2, LineGeometry } from 'three-stdlib';
import type { RouteId } from '@/lib/event';
import { ROUTE_START, heightAt, routePath } from '@/lib/terrain';
import { component, primitive } from '@/lib/tokens';
import { clamp01, type IntroState } from './intro';
import { applyWindowFade, type WindowUniforms } from './windowFade';

type P = [number, number, number];

const toPoints = (id: RouteId) => routePath(id, 0.6, 0.6).map((p) => [p.x, p.y, p.z] as P);

function revealLine(line: Line2 | null, progress: number, segments: number) {
  if (!line) return;
  line.visible = progress > 0;
  (line.geometry as LineGeometry).instanceCount = Math.max(1, Math.round(progress * segments));
}

type Props = { intro: MutableRefObject<IntroState>; windowUniforms: WindowUniforms };

/** Trazados de Carrera y Travesía sobre el terreno; se dibujan una vez durante la intro del hero. */
export function RouteLines({ intro, windowUniforms }: Props) {
  const carrera = useMemo(() => toPoints('carrera'), []);
  const travesia = useMemo(() => toPoints('travesia'), []);
  const start = useMemo<P>(() => [ROUTE_START[0], heightAt(ROUTE_START[0], ROUTE_START[1]), ROUTE_START[1]], []);
  const carreraRef = useRef<Line2>(null);
  const travesiaRef = useRef<Line2>(null);
  const poleRef = useRef<Line2>(null);
  const flagRef = useRef<Mesh>(null);
  const markerRef = useRef<Group>(null);

  useLayoutEffect(() => {
    for (const obj of [carreraRef.current, travesiaRef.current, poleRef.current, flagRef.current]) {
      if (!obj) continue;
      const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
      materials.forEach((material) => applyWindowFade(material, windowUniforms));
    }
  }, [windowUniforms]);

  useFrame(() => {
    const d = intro.current.draw;
    revealLine(carreraRef.current, d, carrera.length - 1);
    revealLine(travesiaRef.current, clamp01((d - 0.12) / 0.88), travesia.length - 1);
    if (markerRef.current) markerRef.current.visible = d > 0;
  });

  return (
    <>
      <Line ref={carreraRef} points={carrera} color={primitive[component['route-carrera']]} lineWidth={2.6} />
      <Line ref={travesiaRef} points={travesia} color={primitive[component['route-travesia']]} lineWidth={2.2} />
      <group ref={markerRef} position={start}>
        <Line
          ref={poleRef}
          points={[
            [0, 0, 0],
            [0, 7, 0],
          ]}
          color={primitive.niebla}
          lineWidth={1.4}
        />
        <mesh ref={flagRef} position={[0, 7, 0]}>
          <sphereGeometry args={[0.55, 16, 12]} />
          <meshBasicMaterial color={primitive.niebla} />
        </mesh>
      </group>
    </>
  );
}
