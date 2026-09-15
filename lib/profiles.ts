import { ROUTES, type RouteId } from './event';
import { routePath } from './terrain';

export type ProfilePoint = {
  /** Kilómetro recorrido (0 → distancia oficial). */
  km: number;
  /** Metros relativos a la salida, escalados para que el ascenso acumulado sea el oficial. */
  m: number;
  /** Planta normalizada (-1..1) para la cinta 3D. */
  px: number;
  pz: number;
};

export type Profile = {
  id: RouteId;
  points: ProfilePoint[];
  minM: number;
  maxM: number;
  ascentM: number;
  distanceKm: number;
};

const cache = new Map<string, Profile>();

/**
 * Perfil de referencia anclado a los datos oficiales: la forma sale del trazado
 * sobre el terreno y la escala se ajusta a la distancia y al ascenso acumulado publicados.
 */
export function buildProfile(id: RouteId, samples = 180): Profile {
  const key = `${id}:${samples}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const path = routePath(id, 0.5);
  const cum: number[] = [0];
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1];
    const b = path[i];
    cum.push(cum[i - 1] + Math.hypot(b.x - a.x, b.z - a.z));
  }
  const total = cum[cum.length - 1];

  // Remuestreo uniforme por distancia.
  const res: { d: number; y: number; x: number; z: number }[] = [];
  let j = 0;
  for (let s = 0; s < samples; s++) {
    const d = (s / (samples - 1)) * total;
    while (j < cum.length - 2 && cum[j + 1] < d) j++;
    const span = cum[j + 1] - cum[j] || 1;
    const t = Math.min(1, Math.max(0, (d - cum[j]) / span));
    const a = path[j];
    const b = path[j + 1];
    res.push({ d, y: a.y + (b.y - a.y) * t, x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t });
  }

  // Suavizado ligero: el GPS real también filtra el ruido de altura.
  const smooth = res.map((_, i) => {
    let acc = 0;
    let n = 0;
    for (let k = -3; k <= 3; k++) {
      const q = res[i + k];
      if (q) {
        acc += q.y;
        n++;
      }
    }
    return acc / n;
  });

  let rawAscent = 0;
  for (let i = 1; i < smooth.length; i++) rawAscent += Math.max(0, smooth[i] - smooth[i - 1]);

  const route = ROUTES[id];
  const scale = route.ascentM / (rawAscent || 1);

  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const p of res) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minZ = Math.min(minZ, p.z);
    maxZ = Math.max(maxZ, p.z);
  }
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  const half = Math.max(maxX - minX, maxZ - minZ) / 2 || 1;

  const points = res.map((p, i) => ({
    km: (p.d / total) * route.distanceKm,
    m: (smooth[i] - smooth[0]) * scale,
    px: (p.x - cx) / half,
    pz: (p.z - cz) / half,
  }));

  const profile: Profile = {
    id,
    points,
    minM: Math.min(...points.map((p) => p.m)),
    maxM: Math.max(...points.map((p) => p.m)),
    ascentM: route.ascentM,
    distanceKm: route.distanceKm,
  };
  cache.set(key, profile);
  return profile;
}

/** Trazos SVG del perfil (línea y área) en un lienzo w×h. */
export function profileSvg(profile: Profile, w: number, h: number, maxKm: number, rangeM: number) {
  const padTop = 8;
  const usable = h - padTop;
  const x = (km: number) => (km / maxKm) * w;
  const y = (m: number) => padTop + usable - ((m - profile.minM) / rangeM) * usable;
  const line = profile.points.map((p, i) => `${i ? 'L' : 'M'}${x(p.km).toFixed(1)} ${y(p.m).toFixed(1)}`).join('');
  const last = profile.points[profile.points.length - 1];
  const area = `${line}L${x(last.km).toFixed(1)} ${h}L0 ${h}Z`;
  return { line, area };
}
