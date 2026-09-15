'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, type MutableRefObject } from 'react';
import { BufferAttribute, Color, MathUtils, PlaneGeometry, ShaderMaterial } from 'three';
import { requestSceneFrame } from '@/lib/scene-bus';
import { HEIGHT_SCALE, TERRAIN_SIZE, heightAt } from '@/lib/terrain';
import { framingDistance } from '@/lib/shots';
import { primitive } from '@/lib/tokens';
import type { IntroState } from './intro';
import { WINDOW_FADE_GLSL, type WindowUniforms } from './windowFade';

const SEGMENTS = 220;
const FOG_NEAR = 95;
const FOG_FAR = 270;

const vertexShader = /* glsl */ `
  uniform float uReveal;
  varying vec3 vWorld;
  varying vec3 vNormalW;
  varying float vHeight;
  varying float vDepth;

  void main() {
    vec3 p = position;
    vHeight = p.y;
    p.y *= mix(0.03, 1.0, uReveal);
    vec4 world = modelMatrix * vec4(p, 1.0);
    vWorld = world.xyz;
    vNormalW = normalize(mat3(modelMatrix) * mix(vec3(0.0, 1.0, 0.0), normal, uReveal));
    vec4 mv = viewMatrix * world;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uLow;
  uniform vec3 uHigh;
  uniform vec3 uPeak;
  uniform vec3 uLine;
  uniform vec3 uFog;
  uniform vec3 uMist;
  uniform float uHeightScale;
  uniform float uStep;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uEdge;
  uniform float uTime;
  uniform float uReveal;
  uniform float uDim;
  uniform float uWinBottom;
  uniform float uWinHeight;
  uniform float uFade;
  varying vec3 vWorld;
  varying vec3 vNormalW;
  varying float vHeight;
  varying float vDepth;

  ${WINDOW_FADE_GLSL}

  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    float h = vHeight;
    float hn = clamp(h / (uHeightScale * 1.3), 0.0, 1.0);
    vec3 base = mix(uLow, uHigh, smoothstep(0.03, 0.5, hn));
    base = mix(base, uPeak, smoothstep(0.55, 1.0, hn) * 0.55);
    float diff = clamp(dot(normalize(vNormalW), normalize(vec3(-0.5, 0.78, 0.38))), 0.0, 1.0);
    base *= 0.32 + 1.0 * diff;

    // Curvas de nivel: la altimetría como lenguaje visual del territorio.
    float c = h / uStep;
    float fw = max(fwidth(c), 1e-4);
    float minor = (1.0 - smoothstep(0.0, 1.0, abs(fract(c - 0.5) - 0.5) / fw)) * (1.0 - smoothstep(0.2, 0.55, fw));
    float cm = c / 5.0;
    float fwm = max(fwidth(cm), 1e-4);
    float major = 1.0 - smoothstep(0.0, 1.2, abs(fract(cm - 0.5) - 0.5) / fwm);
    vec3 col = mix(base, uLine, clamp(minor * 0.2 + major * 0.4, 0.0, 1.0) * uReveal);

    // Niebla de valle: más densa abajo, desplazándose lentamente.
    float drift = snoise(vWorld.xz * 0.026 + vec2(uTime * 0.018, uTime * 0.007)) * 0.5 + 0.5;
    float detail = snoise(vWorld.xz * 0.07 - vec2(uTime * 0.03, uTime * 0.01)) * 0.5 + 0.5;
    float low = 1.0 - smoothstep(uHeightScale * 0.06, uHeightScale * 0.5, h);
    col = mix(col, uMist, low * mix(0.3, 1.0, drift * detail) * 0.6);

    float fog = smoothstep(uFogNear, uFogFar, vDepth);
    float edge = smoothstep(uEdge * 0.68, uEdge, length(vWorld.xz));
    col = mix(col, uFog, max(fog, edge));

    col = mix(mix(uFog, uMist, 0.6), col, smoothstep(0.05, 0.85, uReveal));

    col = mix(uFog, col, windowFade());
    col = mix(col, uFog, uDim);

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

type Props = {
  intro: MutableRefObject<IntroState>;
  dim: number;
  fade: number;
  animate: boolean;
  windowUniforms: WindowUniforms;
};

export function Terrain({ intro, dim, fade, animate, windowUniforms }: Props) {
  const geometry = useMemo(() => {
    const g = new PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, SEGMENTS, SEGMENTS);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position as BufferAttribute;
    for (let i = 0; i < pos.count; i++) pos.setY(i, heightAt(pos.getX(i), pos.getZ(i)));
    g.computeVertexNormals();
    return g;
  }, []);

  const material = useMemo(() => {
    const bruma = new Color(primitive['bruma-noche']);
    const bosque = new Color(primitive.bosque);
    const piedra = new Color(primitive.piedra);
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uLow: { value: bruma.clone().lerp(bosque, 0.5) },
        uHigh: { value: bosque.clone().multiplyScalar(1.8) },
        uPeak: { value: piedra.clone().multiplyScalar(0.34) },
        uLine: { value: piedra.clone() },
        uFog: { value: bruma.clone() },
        uMist: { value: bruma.clone().lerp(piedra, 0.2) },
        uHeightScale: { value: HEIGHT_SCALE },
        uStep: { value: HEIGHT_SCALE / 12 },
        uFogNear: { value: FOG_NEAR },
        uFogFar: { value: FOG_FAR },
        uEdge: { value: TERRAIN_SIZE / 2 },
        uTime: { value: 0 },
        uReveal: { value: intro.current.reveal },
        uDim: { value: dim },
        ...windowUniforms,
      },
    });
    // Los valores iniciales solo se leen al crear el material.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame(({ size }, delta) => {
    const dt = Math.min(delta, 0.05);
    const u = material.uniforms;
    const k = framingDistance(size.width / Math.max(size.height, 1));
    u.uFogNear.value = FOG_NEAR * k;
    u.uFogFar.value = FOG_FAR * k;
    u.uReveal.value = intro.current.reveal;
    if (animate) u.uTime.value += dt;
    u.uDim.value = MathUtils.damp(u.uDim.value, dim, 3, dt);
    windowUniforms.uFade.value = MathUtils.damp(windowUniforms.uFade.value, fade, 3.4, dt);
    if (Math.abs(u.uDim.value - dim) > 0.002 || Math.abs(windowUniforms.uFade.value - fade) > 0.002) requestSceneFrame();
  });

  return <mesh geometry={geometry} material={material} frustumCulled={false} />;
}
