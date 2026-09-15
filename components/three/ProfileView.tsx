'use client';

import { Line, PerspectiveCamera, View } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react';
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  MathUtils,
  ShaderMaterial,
  type Group,
  type WebGLRenderer,
} from 'three';
import type { RouteId } from '@/lib/event';
import { requestSceneFrame } from '@/lib/scene-bus';
import { component, primitive } from '@/lib/tokens';

/** [km, metros relativos, planta x, planta z] */
export type RibbonPoint = [number, number, number, number];
export type ProfileRotation = { yaw: number; tilt: number };

type Props = {
  id: RouteId;
  points: RibbonPoint[];
  minM: number;
  rangeM: number;
  rotation: MutableRefObject<ProfileRotation>;
  onReady: () => void;
};

const RADIUS = 1.45;
const HEIGHT = 1.05;

const vertexShader = /* glsl */ `
  attribute float aT;
  varying float vT;
  void main() {
    vT = aT;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vT;
  void main() {
    gl_FragColor = vec4(uColor, mix(0.03, 0.55, pow(vT, 1.8)));
    #include <colorspace_fragment>
  }
`;

/** Perfil de altimetría como cortina 3D: planta real del trazado + altura escalada al ascenso oficial. */
export default function ProfileView(props: Props) {
  return (
    <View index={2} className="absolute inset-0">
      <ProfileScene {...props} />
    </View>
  );
}

function ProfileScene({ id, points, minM, rangeM, rotation, onReady }: Props) {
  const scene = useThree((s) => s.scene);
  const group = useRef<Group>(null);
  const readyCalled = useRef(false);
  const color = primitive[component[`route-${id}`]];

  // La vista limpia su propio rectángulo con el color de la tarjeta antes de dibujar.
  useLayoutEffect(() => {
    const surface = new Color(primitive.bosque);
    const previous = new Color();
    scene.onBeforeRender = (renderer: WebGLRenderer) => {
      renderer.getClearColor(previous);
      const alpha = renderer.getClearAlpha();
      renderer.setClearColor(surface, 1);
      renderer.clear(true, true, false);
      renderer.setClearColor(previous, alpha);
    };
    return () => {
      scene.onBeforeRender = () => {};
    };
  }, [scene]);

  useLayoutEffect(() => {
    if (!group.current) return;
    group.current.rotation.set(rotation.current.tilt, rotation.current.yaw, 0);
  }, [rotation]);

  const { curtain, top, ground } = useMemo(() => {
    const positions = new Float32Array(points.length * 6);
    const heights = new Float32Array(points.length * 2);
    const topPts: [number, number, number][] = [];
    const groundPts: [number, number, number][] = [];
    points.forEach(([, m, px, pz], i) => {
      const x = px * RADIUS;
      const z = pz * RADIUS;
      const y = ((m - minM) / rangeM) * HEIGHT + 0.015;
      positions.set([x, 0, z, x, y, z], i * 6);
      heights[i * 2] = 0;
      heights[i * 2 + 1] = 1;
      topPts.push([x, y, z]);
      groundPts.push([x, 0, z]);
    });
    const index: number[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const a = i * 2;
      index.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(positions, 3));
    g.setAttribute('aT', new BufferAttribute(heights, 1));
    g.setIndex(index);
    return { curtain: g, top: topPts, ground: groundPts };
  }, [points, minM, rangeM]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: { uColor: { value: new Color(color) } },
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
      }),
    [color],
  );

  useEffect(
    () => () => {
      curtain.dispose();
      material.dispose();
    },
    [curtain, material],
  );

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    const r = rotation.current;
    g.rotation.y = MathUtils.damp(g.rotation.y, r.yaw, 7, dt);
    g.rotation.x = MathUtils.damp(g.rotation.x, r.tilt, 7, dt);
    if (Math.abs(g.rotation.y - r.yaw) > 1e-3 || Math.abs(g.rotation.x - r.tilt) > 1e-3) requestSceneFrame();
    if (!readyCalled.current) {
      readyCalled.current = true;
      requestAnimationFrame(onReady);
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2.1, 5.9]} fov={30} onUpdate={(c) => c.lookAt(0, 0.2, 0)} />
      <group ref={group}>
        <mesh geometry={curtain} material={material} />
        <Line points={top} color={color} lineWidth={2.4} />
        <Line points={ground} color={primitive.piedra} lineWidth={1} transparent opacity={0.45} />
        <mesh position={top[0]}>
          <sphereGeometry args={[0.05, 16, 12]} />
          <meshBasicMaterial color={primitive.niebla} />
        </mesh>
      </group>
    </>
  );
}
