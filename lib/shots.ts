/** Encuadres por ruta: la misma cordillera vista desde otro punto, para dar continuidad espacial. */

export type Vec3 = [number, number, number];

export type Shot = {
  position: Vec3;
  target: Vec3;
  fov: number;
  /** Desplaza el centro óptico hacia arriba (fracción del alto) para dejar aire al texto. */
  shiftY: number;
  /** Fracción inferior de la ventana que se funde en niebla (zona del texto). */
  fade: number;
  orbit: boolean;
  dim: number;
  /** Encuadre equivalente del póster estático (transform-only). */
  poster: { scale: number; x: number; y: number };
};

export const SHOTS: Record<string, Shot> = {
  '/': {
    position: [-24, 40, 150],
    target: [-24, 10, -22],
    fov: 34,
    shiftY: 0.17,
    fade: 0.66,
    orbit: true,
    dim: 0,
    poster: { scale: 1, x: 0, y: 0 },
  },
  '/evento': {
    position: [62, 20, 66],
    target: [6, 9, 8],
    fov: 32,
    shiftY: 0.22,
    fade: 0.45,
    orbit: false,
    dim: 0.08,
    poster: { scale: 1.18, x: -6, y: 4 },
  },
  '/recorridos': {
    position: [-30, 215, 92],
    target: [-30, 0, -4],
    fov: 32,
    shiftY: 0.2,
    fade: 0.55,
    orbit: false,
    dim: 0.02,
    poster: { scale: 1.1, x: 0, y: 3 },
  },
  '/kit-servicios': {
    position: [-92, 34, 34],
    target: [0, 9, -22],
    fov: 32,
    shiftY: 0.22,
    fade: 0.45,
    orbit: false,
    dim: 0.22,
    poster: { scale: 1.2, x: 7, y: 4 },
  },
  '/aliados': {
    position: [86, 64, -46],
    target: [0, 6, 2],
    fov: 32,
    shiftY: 0.22,
    fade: 0.45,
    orbit: false,
    dim: 0.22,
    poster: { scale: 1.14, x: 5, y: 2 },
  },
};

/** En pantallas verticales la cámara se aleja para no recortar la cordillera; la niebla escala igual. */
export function framingDistance(aspect: number): number {
  return Math.max(1, Math.pow(1.45 / aspect, 0.75));
}

export function shotFor(pathname: string): Shot {
  return SHOTS[pathname] ?? SHOTS['/evento'];
}
