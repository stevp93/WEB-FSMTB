import { createNoise2D } from './noise';
import type { RouteId } from './event';

/**
 * Territorio sintético de San Francisco: cordillera al fondo, río en el valle y
 * el pueblo (salida) al frente. Funciones puras, sin three, para poder
 * calcular también los perfiles de altimetría en el servidor.
 */

export const TERRAIN_SIZE = 180;
export const HEIGHT_SCALE = 19;

const noiseA = createNoise2D(2026);
const noiseB = createNoise2D(1129);

function clamp01(x: number) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

function smoothstep(e0: number, e1: number, x: number) {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

/** Eje del río: serpentea de fondo a frente por el centro del valle. */
export function riverX(z: number) {
  return 13 * Math.sin(z * 0.034 + 0.6) + 5 * Math.sin(z * 0.09 + 2.1);
}

function fbm(x: number, z: number) {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  for (let o = 0; o < 5; o++) {
    sum += amp * noiseA(x * freq, z * freq);
    freq *= 2.03;
    amp *= 0.5;
  }
  return sum;
}

function ridged(x: number, z: number) {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  for (let o = 0; o < 4; o++) {
    const r = 1 - Math.abs(noiseB(x * freq, z * freq));
    sum += amp * r * r;
    freq *= 2.1;
    amp *= 0.5;
  }
  return sum;
}

/** Altura normalizada del terreno en coordenadas de mundo (x, z). */
export function heightAt(x: number, z: number): number {
  const u = x / 44;
  const w = z / 44;
  const base = fbm(u, w) * 0.5 + 0.5;
  const ridge = ridged(u * 0.8 + 3.1, w * 0.8 - 1.7);
  const back = smoothstep(45, -70, z);
  const flanks = smoothstep(35, 90, Math.abs(x)) * 0.4;

  let h = base * 0.32 + ridge * 0.8 * (0.4 + 0.8 * back) + back * 0.4 + flanks;

  const d = Math.abs(x - riverX(z));
  const valley = 1 - Math.exp(-(d * d) / (2 * 12 * 12));
  h *= 0.18 + 0.82 * valley;

  return h * HEIGHT_SCALE;
}

type XZ = readonly [number, number];

const START: XZ = [riverX(46) + 9, 46];

/** Puntos de control de cada trazado (bucles que salen y vuelven al pueblo). */
export const ROUTE_CONTROL: Record<RouteId, XZ[]> = {
  carrera: [
    START,
    [26, 36],
    [38, 18],
    [44, -4],
    [36, -28],
    [18, -46],
    [-4, -52],
    [-24, -40],
    [-38, -18],
    [-40, 4],
    [-28, 24],
    [-10, 38],
  ],
  travesia: [START, [24, 34], [30, 18], [20, 4], [4, 6], [-10, 16], [-14, 32], [-2, 44]],
};

export const ROUTE_START = START;

function catmullRomClosed(points: readonly XZ[], perSegment: number): [number, number][] {
  const n = points.length;
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    for (let s = 0; s < perSegment; s++) {
      const t = s / perSegment;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push([points[0][0], points[0][1]]);
  return out;
}

export type RoutePoint = { x: number; y: number; z: number };

/** Trazado denso sobre el terreno, remuestreado a paso constante en planta. */
export function routePath(id: RouteId, step = 0.6, lift = 0.45): RoutePoint[] {
  const raw = catmullRomClosed(ROUTE_CONTROL[id], 40);
  const out: RoutePoint[] = [];
  let carry = 0;
  out.push({ x: raw[0][0], z: raw[0][1], y: heightAt(raw[0][0], raw[0][1]) + lift });
  for (let i = 1; i < raw.length; i++) {
    const [ax, az] = raw[i - 1];
    const [bx, bz] = raw[i];
    const seg = Math.hypot(bx - ax, bz - az);
    let d = step - carry;
    while (d <= seg) {
      const t = d / seg;
      const x = ax + (bx - ax) * t;
      const z = az + (bz - az) * t;
      out.push({ x, z, y: heightAt(x, z) + lift });
      d += step;
    }
    carry = seg - (d - step);
  }
  return out;
}
