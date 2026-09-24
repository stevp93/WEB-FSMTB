export type ExperienceMode = 'pending' | '3d' | 'poster';

type NetworkInformationLike = { saveData?: boolean; effectiveType?: string };
type NavigatorLike = Navigator & { connection?: NetworkInformationLike; deviceMemory?: number };

let webglSupport: boolean | undefined;

function hasWebGL() {
  if (webglSupport !== undefined) return webglSupport;
  try {
    const canvas = document.createElement('canvas');
    webglSupport = Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

/** Pantallas táctiles/pequeñas: el 3D entra después de la carga y a menor resolución. */
export function isMobileDevice(): boolean {
  return window.innerWidth < 1024 && !window.matchMedia('(pointer: fine)').matches;
}

/**
 * El 3D corre en escritorio y en celulares con al menos 4 núcleos y 4 GB de RAM,
 * sin reducción de movimiento, sin ahorro de datos y con WebGL. Lo demás recibe
 * el póster estático con la misma composición.
 */
export function canRun3D(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

  const nav = navigator as NavigatorLike;
  if (nav.connection?.saveData) return false;
  // Solo 2G descarta el 3D: en datos móviles muchos teléfonos reportan "3g" y el chunk se baja después de la carga.
  if (nav.connection?.effectiveType && /(^|-)2g$/.test(nav.connection.effectiveType)) return false;

  if ((nav.hardwareConcurrency ?? 4) < 4) return false;
  // deviceMemory no existe en iOS/Safari: allí decide el número de núcleos.
  if (isMobileDevice() && (nav.deviceMemory ?? 4) < 4) return false;

  return hasWebGL();
}
